// Integration tests for the live vote feed — hit the real VoteInfo files.
// Run with: npm run test:integration
//
// What the feed holds depends on the calendar (before, during or after a voting
// Sunday), so these assert the shape for whichever state it is in, and lean on
// finished vote days for the numbers.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { handleGetLiveVoteResults, clearLiveCache } from "../../src/modules/voting-live.js";
import { handleGetVotingResults, clearVotingCache } from "../../src/modules/voting.js";

beforeAll(() => {
  clearLiveCache();
  clearVotingCache();
});
afterAll(() => {
  clearLiveCache();
  clearVotingCache();
});

describe("get_live_vote_results (live)", () => {
  it("returns the current or latest vote day with a status", async () => {
    const result = JSON.parse(await handleGetLiveVoteResults({}));

    expect(result.vote_day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(["not_started", "counting", "complete"]).toContain(result.status);
    expect(result.votes.length).toBeGreaterThan(0);
    expect(result.data_timestamp).toBeTruthy();
    expect(result.source).toMatch(/VoteInfo/);
  });

  it("stays well under the response budget", async () => {
    const raw = await handleGetLiveVoteResults({});

    expect(raw.length).toBeLessThan(50000);
  });

  it("lists all 26 cantons for every vote", async () => {
    const result = JSON.parse(await handleGetLiveVoteResults({}));

    for (const vote of result.votes) {
      expect(vote.cantons).toHaveLength(26);
      expect(vote.cantons_total).toBe(26);
      expect(vote.cantons_counted).toBeLessThanOrEqual(26);
    }
  });

  // 2026-06-14 is finished: 26 of 26 counted, and the cantons add up to the nation.
  it("adds up on a finished vote day", async () => {
    const result = JSON.parse(await handleGetLiveVoteResults({ date: "2026-06-14" }));

    expect(result.status).toBe("complete");
    for (const vote of result.votes) {
      expect(vote.status).toBe("complete");
      expect(vote.cantons_counted).toBe(26);
      expect(typeof vote.accepted).toBe("boolean");
      const sum = (k: "yes_count" | "no_count") =>
        vote.cantons.reduce((t: number, c: Record<string, number>) => t + c[k], 0);
      expect(sum("yes_count")).toBe(vote.yes_count);
      expect(sum("no_count")).toBe(vote.no_count);
    }
  });

  it("agrees with the BFS export on the verdict and the yes share", async () => {
    const live = JSON.parse(await handleGetLiveVoteResults({ date: "2026-06-14" }));
    const bfs = JSON.parse(await handleGetVotingResults({ year: 2026, limit: 10 }));

    for (const vote of live.votes) {
      const other = bfs.votes.find((v: { id: number }) => v.id === vote.id);
      expect(other, `vote ${vote.id} in the BFS export`).toBeDefined();
      expect(other.accepted).toBe(vote.accepted);
      expect(Math.abs(other.yes_percent - vote.yes_percent)).toBeLessThan(0.1);
      expect(other.cantons_yes).toBe(vote.cantons_yes);
    }
  });

  it("rejects a date with no feed and lists the days that have one", async () => {
    await expect(handleGetLiveVoteResults({ date: "2000-01-02" })).rejects.toThrow(
      /Vote days available: 20\d\d-/,
    );
  });
});
