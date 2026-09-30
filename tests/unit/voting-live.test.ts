import { describe, it, expect, vi, afterEach } from "vitest";
import { handleGetLiveVoteResults, clearLiveCache } from "../../src/modules/voting-live.js";
import { votingTools, handleVoting } from "../../src/modules/voting.js";
import {
  FINISHED_FEED,
  NOT_STARTED_FEED,
  COUNTING_FEED,
  CKAN_PACKAGE,
  FEED_URLS,
} from "../fixtures/voting-live.js";

const CKAN_URL = "ckan.opendata.swiss/api/3/action/package_show";

/** Serve JSON per URL fragment, so a wrong URL fails instead of matching by accident. */
function mockFeeds(byUrl: Record<string, unknown>) {
  const fetchMock = vi.fn().mockImplementation((url: string) => {
    const key = Object.keys(byUrl).find((k) => url.includes(k));
    if (!key) {
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: "Not Found",
        headers: new Headers(),
        json: () => Promise.resolve({}),
      });
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      json: () => Promise.resolve(JSON.parse(JSON.stringify(byUrl[key]))),
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const ALL = {
  [CKAN_URL]: CKAN_PACKAGE,
  [FEED_URLS["2026-06-14"]]: FINISHED_FEED,
  [FEED_URLS["2026-09-27"]]: NOT_STARTED_FEED,
};

/** Freeze "today" in Switzerland; only Date is faked so timeouts still work. */
function today(iso: string) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(iso));
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  clearLiveCache();
});

describe("which vote day", () => {
  it("defaults to the latest vote day that has happened, and names the upcoming one", async () => {
    today("2026-09-26T10:00:00+02:00");
    mockFeeds(ALL);

    const result = JSON.parse(await handleGetLiveVoteResults({}));

    expect(result.vote_day).toBe("2026-06-14");
    expect(result.upcoming_vote_day).toBe("2026-09-27");
  });

  it("switches to the new vote day when it is voting Sunday", async () => {
    today("2026-09-27T14:00:00+02:00");
    mockFeeds(ALL);

    const result = JSON.parse(await handleGetLiveVoteResults({}));

    expect(result.vote_day).toBe("2026-09-27");
    expect(result.upcoming_vote_day).toBeUndefined();
  });

  it("uses the Swiss calendar date, not UTC, around midnight", async () => {
    // 00:30 on Sunday in Zürich is still Saturday in UTC.
    today("2026-09-27T00:30:00+02:00");
    mockFeeds(ALL);

    const result = JSON.parse(await handleGetLiveVoteResults({}));

    expect(result.vote_day).toBe("2026-09-27");
  });

  it("takes an explicit date", async () => {
    today("2026-09-26T10:00:00+02:00");
    mockFeeds(ALL);

    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-09-27" }));

    expect(result.vote_day).toBe("2026-09-27");
  });

  it("lists the available days when the date has no feed", async () => {
    mockFeeds(ALL);

    await expect(handleGetLiveVoteResults({ date: "2020-01-01" })).rejects.toThrow(
      /2026-03-08, 2026-06-14, 2026-09-27/,
    );
  });

  it("ignores dataset resources that are not VoteInfo feeds", async () => {
    mockFeeds(ALL);

    await expect(handleGetLiveVoteResults({ date: "1983-12-04" })).rejects.toThrow(/No live feed/);
  });

  it("fails clearly when the dataset lists no VoteInfo files", async () => {
    mockFeeds({ [CKAN_URL]: { success: true, result: { resources: [] } } });

    await expect(handleGetLiveVoteResults({})).rejects.toThrow(/No VoteInfo feed/);
  });
});

describe("a finished vote day", () => {
  it("reports the result and the cantonal tally, with half cantons", async () => {
    today("2026-10-01T10:00:00+02:00");
    mockFeeds(ALL);

    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-06-14" }));
    const [initiative, law] = result.votes;

    expect(result.status).toBe("complete");
    expect(initiative).toMatchObject({
      id: 6860,
      status: "complete",
      accepted: false,
      yes_count: 1492857,
      no_count: 1809246,
      yes_percent: 45.21,
      turnout: 58.86,
      cantonal_majority_required: true,
      cantons_yes: 10, // 8 full + 4 half
      cantons_no: 13, // 12 full + 2 half
    });
    expect(law).toMatchObject({
      id: 6870,
      accepted: true,
      cantonal_majority_required: false,
      cantons_yes: 17.5,
      cantons_no: 5.5,
    });
  });

  it("keeps BFS's provisional flag and says when the data was published", async () => {
    mockFeeds(ALL);

    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-06-14" }));

    expect(result.votes[0].provisional).toBe(true);
    expect(result.data_timestamp).toBe("2026-06-23T15:50:54");
    expect(result.fetched_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("lists cantons by number with their own counts", async () => {
    mockFeeds(ALL);

    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-06-14" }));
    const cantons = result.votes[0].cantons;

    expect(cantons.map((c: { canton: string }) => c.canton)).toEqual(
      FINISHED_FEED.schweiz.vorlagen[0].kantone.map((k: { geoLevelname: string }) => k.geoLevelname),
    );
    expect(cantons[0]).toMatchObject({ canton: "Zürich", counted: true, yes_count: 238179, no_count: 357691, yes_percent: 39.97 });
    expect(Object.keys(cantons[0]).sort()).toEqual(
      ["canton", "counted", "no_count", "turnout", "yes_count", "yes_percent"],
    );
  });
});

describe("before the count starts", () => {
  it("has no numbers and no verdict, rather than zeros", async () => {
    mockFeeds(ALL);

    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-09-27" }));
    const [neutrality] = result.votes;

    expect(result.status).toBe("not_started");
    expect(neutrality).toMatchObject({
      id: 6880,
      status: "not_started",
      accepted: null,
      yes_count: null,
      no_count: null,
      yes_percent: null,
      turnout: null,
      cantons_yes: null,
      cantons_no: null,
      cantons_counted: 0,
      cantonal_majority_required: true,
    });
  });
});

describe("during the count", () => {
  it("reports what is counted so far and how many cantons are in", async () => {
    mockFeeds({ ...ALL, [FEED_URLS["2026-09-27"]]: COUNTING_FEED });

    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-09-27" }));
    const [first, second] = result.votes;

    expect(result.status).toBe("counting");
    expect(result.data_timestamp).toBe("2026-09-27T12:45:10");
    expect(first).toMatchObject({
      status: "counting",
      accepted: null,
      yes_count: 450000,
      no_count: 500000,
      cantons_counted: 2,
      cantons_yes: 1,
      cantons_no: 1,
    });
    expect(first.cantons.map((c: { counted: boolean }) => c.counted)).toEqual([true, true, false, false]);
    expect(second.status).toBe("not_started");
  });

  it("does not turn a partly filled tally into a number", async () => {
    const feed = JSON.parse(JSON.stringify(COUNTING_FEED));
    feed.schweiz.vorlagen[0].staende.jaStaendeHalb = null;
    mockFeeds({ ...ALL, [FEED_URLS["2026-09-27"]]: feed });

    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-09-27" }));

    expect(result.votes[0].cantons_yes).toBeNull();
  });
});

describe("titles and notices", () => {
  it("returns the requested language and falls back to German", async () => {
    mockFeeds(ALL);

    const fr = JSON.parse(await handleGetLiveVoteResults({ date: "2026-06-14", lang: "fr" }));
    const rm = JSON.parse(await handleGetLiveVoteResults({ date: "2026-06-14", lang: "rm" }));

    expect(fr.votes[0].title).toMatch(/Pas de Suisse à 10 millions/);
    // The fixture keeps de/fr/en only, so Romansh falls back to German.
    expect(rm.votes[0].title).toMatch(/Keine 10-Millionen-Schweiz/);
  });

  it("passes a notice through, in the requested language when it has several", async () => {
    const feed = JSON.parse(JSON.stringify(NOT_STARTED_FEED));
    feed.schweiz.vorlagen[0].reserveInfoText = [
      { langKey: "de", text: "Ergebnis verzögert" },
      { langKey: "fr", text: "Résultat retardé" },
    ];
    feed.schweiz.vorlagen[1].reserveInfoText = "Nur Text";
    mockFeeds({ ...ALL, [FEED_URLS["2026-09-27"]]: feed });

    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-09-27", lang: "fr" }));

    expect(result.votes[0].notice).toBe("Résultat retardé");
    expect(result.votes[1].notice).toBe("Nur Text");
  });

  it("links a counter-proposal to its main vote", async () => {
    const feed = JSON.parse(JSON.stringify(NOT_STARTED_FEED));
    feed.schweiz.vorlagen[1].hauptvorlagenId = 6880;
    mockFeeds({ ...ALL, [FEED_URLS["2026-09-27"]]: feed });

    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-09-27" }));

    expect(result.votes[1].main_vote_id).toBe(6880);
    expect(result.votes[0].main_vote_id).toBeUndefined();
  });
});

describe("caching", () => {
  it("serves repeat calls within a minute from one download", async () => {
    today("2026-09-27T14:00:00+02:00");
    const fetchMock = mockFeeds(ALL);

    await handleGetLiveVoteResults({});
    await handleGetLiveVoteResults({ lang: "fr" });

    expect(fetchMock).toHaveBeenCalledTimes(2); // the dataset listing and one feed file
  });

  it("downloads the feed again after a minute so live results move", async () => {
    today("2026-09-27T14:00:00+02:00");
    const fetchMock = mockFeeds({ ...ALL, [FEED_URLS["2026-09-27"]]: NOT_STARTED_FEED });

    const before = JSON.parse(await handleGetLiveVoteResults({}));
    expect(before.status).toBe("not_started");

    fetchMock.mockClear();
    mockFeeds({ ...ALL, [FEED_URLS["2026-09-27"]]: COUNTING_FEED });
    vi.setSystemTime(new Date("2026-09-27T14:01:05+02:00"));

    const after = JSON.parse(await handleGetLiveVoteResults({}));
    expect(after.status).toBe("counting");
  });

  it("shares one download between concurrent calls", async () => {
    today("2026-09-27T14:00:00+02:00");
    const fetchMock = mockFeeds(ALL);

    await Promise.all([
      handleGetLiveVoteResults({}),
      handleGetLiveVoteResults({}),
      handleGetLiveVoteResults({ lang: "en" }),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("leaves district and commune data out of the response", async () => {
    today("2026-09-27T14:00:00+02:00");
    const withCommunes = JSON.parse(JSON.stringify(NOT_STARTED_FEED));
    for (const v of withCommunes.schweiz.vorlagen) {
      v.kantone[0].gemeinden = Array.from({ length: 200 }, (_, i) => ({ id: i }));
    }
    mockFeeds({ ...ALL, [FEED_URLS["2026-09-27"]]: withCommunes });

    const raw = await handleGetLiveVoteResults({});

    expect(raw).not.toMatch(/gemeinden/);
    expect(raw.length).toBeLessThan(20000);
  });
});

describe("bad upstream content", () => {
  it("fails loudly on a feed without a vote list", async () => {
    mockFeeds({ ...ALL, [FEED_URLS["2026-09-27"]]: { abstimmtag: "20260927" } });

    await expect(handleGetLiveVoteResults({ date: "2026-09-27" })).rejects.toThrow(/unexpected format/i);
  });

  it("does not cache a failed download", async () => {
    mockFeeds({ [CKAN_URL]: CKAN_PACKAGE });
    await expect(handleGetLiveVoteResults({ date: "2026-09-27" })).rejects.toThrow();

    mockFeeds(ALL);
    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-09-27" }));
    expect(result.votes.length).toBe(2);
  });
});

describe("registration", () => {
  it("is one of the voting tools, with the same lang parameter", () => {
    const tool = votingTools.find((t) => t.name === "get_live_vote_results");

    expect(votingTools).toHaveLength(4);
    expect(tool).toBeDefined();
    expect(Object.keys(tool!.inputSchema.properties).sort()).toEqual(["date", "lang"]);
  });

  it("is reachable through the module handler", async () => {
    mockFeeds(ALL);

    const result = JSON.parse(await handleVoting("get_live_vote_results", { date: "2026-06-14" }));

    expect(result.vote_day).toBe("2026-06-14");
  });
});
