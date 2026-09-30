import { fetchJSON } from "../utils/http.js";
import { cached, type CachedValue } from "../utils/cache.js";
import { swissToday } from "../utils/date.js";

/**
 * The Federal Chancellery's VoteInfo feed: one JSON file per voting Sunday,
 * republished while the cantons report. The list of available days comes from
 * the opendata.swiss dataset that links to each file.
 */
const CKAN_DATASET =
  "https://ckan.opendata.swiss/api/3/action/package_show?id=echtzeitdaten-am-abstimmungstag-zu-eidgenoessischen-abstimmungsvorlagen";
const FEED_FILE = /sd-t-17-02-(\d{4})(\d{2})(\d{2})-eidgAbstimmung\.json$/;
const DATA_URL =
  "https://opendata.swiss/en/dataset/echtzeitdaten-am-abstimmungstag-zu-eidgenoessischen-abstimmungsvorlagen";
const SOURCE = "Federal Chancellery — VoteInfo real-time feed";

/** Results move by the minute on a voting Sunday; the day list barely at all. */
const RESULT_TTL_MS = 60 * 1000;
const DAYS_TTL_MS = 60 * 60 * 1000;

type Lang = "de" | "fr" | "it" | "rm" | "en";
const LANGS: Lang[] = ["de", "fr", "it", "rm", "en"];

// ── Feed shape (only the parts read here) ────────────────────────────────────

interface FeedResult {
  gebietAusgezaehlt?: boolean;
  jaStimmenInProzent?: number | null;
  jaStimmenAbsolut?: number | null;
  neinStimmenAbsolut?: number | null;
  stimmbeteiligungInProzent?: number | null;
  anzahlStimmberechtigte?: number | null;
}

interface FeedVote {
  vorlagenId: number;
  vorlagenTitel?: { langKey: string; text: string }[];
  vorlageBeendet?: boolean;
  provisorisch?: boolean;
  vorlageAngenommen?: boolean | null;
  hauptvorlagenId?: number | null;
  reserveInfoText?: unknown;
  doppeltesMehr?: boolean | null;
  staende?: {
    jaStaendeGanz?: number | null;
    neinStaendeGanz?: number | null;
    jaStaendeHalb?: number | null;
    neinStaendeHalb?: number | null;
  };
  resultat?: FeedResult;
  kantone?: { geoLevelnummer: string; geoLevelname: string; resultat?: FeedResult }[];
}

interface Feed {
  abstimmtag: string;
  timestamp?: string;
  schweiz?: { nochKeineInformation?: boolean; vorlagen?: FeedVote[] };
}

// ── Vote days ────────────────────────────────────────────────────────────────

interface VoteDays {
  /** YYYY-MM-DD to feed URL. */
  urls: Map<string, string>;
  dates: string[]; // ascending
}

const voteDays = cached<VoteDays>(DAYS_TTL_MS, async () => {
  const pkg = await fetchJSON<{ result?: { resources?: { download_url?: string }[] } }>(
    CKAN_DATASET,
    { timeoutMs: 60_000 },
  );
  const urls = new Map<string, string>();
  for (const r of pkg.result?.resources ?? []) {
    const url = r.download_url ?? "";
    const m = FEED_FILE.exec(url);
    if (m && url.includes("voteinfo-app.ch")) urls.set(`${m[1]}-${m[2]}-${m[3]}`, url);
  }
  if (urls.size === 0) throw new Error("No VoteInfo feed files listed on opendata.swiss");
  return { urls, dates: [...urls.keys()].sort() };
});

/** The most recent vote day up to today: the current one on a voting Sunday. */
function defaultDay(dates: string[], today: string): string {
  return [...dates].reverse().find((d) => d <= today) ?? dates[0];
}

// ── Slimming ─────────────────────────────────────────────────────────────────

const round2 = (n: number | null | undefined): number | null =>
  typeof n === "number" ? Math.round(n * 100) / 100 : null;

function pickTitle(titles: FeedVote["vorlagenTitel"], lang: Lang): string {
  const by = (l: string) => titles?.find((t) => t.langKey === l)?.text?.trim();
  return by(lang) || by("de") || "Unknown";
}

/** The notice may be plain text or one entry per language; anything else is dropped. */
function pickNotice(value: unknown, lang: Lang): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (Array.isArray(value)) {
    const by = (l: string) =>
      value.find((t) => t?.langKey === l)?.text as string | undefined;
    return (by(lang) || by("de"))?.trim() || undefined;
  }
  return undefined;
}

/** Half cantons count 0.5, so a tally with a null part is not a tally yet. */
function cantonTally(yesFull?: number | null, yesHalf?: number | null): number | null {
  return typeof yesFull === "number" && typeof yesHalf === "number"
    ? yesFull + yesHalf / 2
    : null;
}

type VoteStatus = "not_started" | "counting" | "complete";

interface LiveVote {
  id: number;
  title: string;
  status: VoteStatus;
  /** null until the vote is decided. */
  accepted: boolean | null;
  provisional: boolean;
  yes_percent: number | null;
  yes_count: number | null;
  no_count: number | null;
  turnout: number | null;
  cantons_counted: number;
  cantons_total: number;
  cantonal_majority_required: boolean | null;
  cantons_yes: number | null;
  cantons_no: number | null;
  main_vote_id?: number;
  notice?: string;
  cantons: {
    canton: string;
    counted: boolean;
    yes_count: number | null;
    no_count: number | null;
    yes_percent: number | null;
    turnout: number | null;
  }[];
}

function toLiveVote(v: FeedVote, lang: Lang): LiveVote {
  const cantons = (v.kantone ?? [])
    .map((k) => ({
      number: Number(k.geoLevelnummer),
      canton: k.geoLevelname,
      counted: k.resultat?.gebietAusgezaehlt === true,
      yes_count: k.resultat?.jaStimmenAbsolut ?? null,
      no_count: k.resultat?.neinStimmenAbsolut ?? null,
      yes_percent: round2(k.resultat?.jaStimmenInProzent),
      turnout: round2(k.resultat?.stimmbeteiligungInProzent),
    }))
    .sort((a, b) => a.number - b.number)
    .map(({ number: _number, ...rest }) => rest);

  const counted = cantons.filter((c) => c.counted).length;
  const res = v.resultat ?? {};
  const anyNumbers = res.jaStimmenAbsolut != null || counted > 0;
  const status: VoteStatus = v.vorlageBeendet
    ? "complete"
    : anyNumbers
      ? "counting"
      : "not_started";
  const s = v.staende ?? {};

  const live: LiveVote = {
    id: v.vorlagenId,
    title: pickTitle(v.vorlagenTitel, lang),
    status,
    accepted: v.vorlageAngenommen ?? null,
    provisional: v.provisorisch === true,
    yes_percent: round2(res.jaStimmenInProzent),
    yes_count: res.jaStimmenAbsolut ?? null,
    no_count: res.neinStimmenAbsolut ?? null,
    turnout: round2(res.stimmbeteiligungInProzent),
    cantons_counted: counted,
    cantons_total: cantons.length,
    cantonal_majority_required: v.doppeltesMehr ?? null,
    cantons_yes: cantonTally(s.jaStaendeGanz, s.jaStaendeHalb),
    cantons_no: cantonTally(s.neinStaendeGanz, s.neinStaendeHalb),
    cantons,
  };
  if (v.hauptvorlagenId) live.main_vote_id = v.hauptvorlagenId;
  const notice = pickNotice(v.reserveInfoText, lang);
  if (notice) live.notice = notice;
  return live;
}

interface Snapshot {
  data_timestamp?: string;
  fetched_at: string;
  votes: FeedVote[];
}

/** Keep only the slim vote list in the cache: the raw feed is ~2 MB a day. */
const feedByDay = new Map<string, CachedValue<Snapshot>>();

function snapshot(date: string, url: string): Promise<Snapshot> {
  let entry = feedByDay.get(date);
  if (!entry) {
    entry = cached<Snapshot>(RESULT_TTL_MS, async () => {
      const feed = await fetchJSON<Feed>(url, { timeoutMs: 60_000 });
      const votes = feed.schweiz?.vorlagen;
      if (!Array.isArray(votes)) {
        throw new Error(`Unexpected format from the VoteInfo feed — ${url}`);
      }
      return {
        data_timestamp: feed.timestamp,
        fetched_at: new Date().toISOString(),
        votes: votes.map(slimFeedVote),
      };
    });
    feedByDay.set(date, entry);
  }
  return entry.get();
}

/** Drop districts and communes (the bulk of the file) before caching. */
function slimFeedVote(v: FeedVote): FeedVote {
  return {
    ...v,
    kantone: (v.kantone ?? []).map((k) => ({
      geoLevelnummer: k.geoLevelnummer,
      geoLevelname: k.geoLevelname,
      resultat: k.resultat,
    })),
  };
}

/** Reset the module-level caches. Tests must call this between cases. */
export function clearLiveCache(): void {
  voteDays.clear();
  feedByDay.clear();
}

// ── Tool ─────────────────────────────────────────────────────────────────────

export const liveVotingTools = [
  {
    name: "get_live_vote_results",
    description:
      "Live federal vote count on a voting Sunday: national totals, cantonal tally, per-canton results. Defaults to the current or latest vote day",
    inputSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "YYYY-MM-DD, recent days only",
        },
        lang: {
          type: "string",
          enum: LANGS,
          default: "de",
          description: "Title language",
        },
      },
    },
  },
];

export async function handleGetLiveVoteResults(params: {
  date?: string;
  lang?: string;
}): Promise<string> {
  const lang = LANGS.includes(params.lang as Lang) ? (params.lang as Lang) : "de";
  const days = await voteDays.get();
  const today = swissToday();

  const date = params.date?.trim() || defaultDay(days.dates, today);
  const url = days.urls.get(date);
  if (!url) {
    throw new Error(
      `No live feed for ${date}. Vote days available: ${days.dates.join(", ")}. For older votes use get_vote_details.`,
    );
  }

  const snap = await snapshot(date, url);
  const votes = snap.votes.map((v) => toLiveVote(v, lang));

  const status: VoteStatus = votes.every((v) => v.status === "complete")
    ? "complete"
    : votes.every((v) => v.status === "not_started")
      ? "not_started"
      : "counting";
  const upcoming = days.dates.find((d) => d > today && d !== date);

  return JSON.stringify({
    vote_day: date,
    status,
    ...(upcoming ? { upcoming_vote_day: upcoming } : {}),
    data_timestamp: snap.data_timestamp,
    fetched_at: snap.fetched_at,
    source: SOURCE,
    data_url: DATA_URL,
    votes,
  });
}
