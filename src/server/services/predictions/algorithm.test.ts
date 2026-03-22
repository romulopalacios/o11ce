import { describe, expect, it } from "vitest";

import {
  predictMatch,
  type TeamStatsInput,
  type TournamentAverages,
} from "./algorithm";

const globalAverages: TournamentAverages = {
  goalsForPerMatch: 1.4,
  goalsAgainstPerMatch: 1.4,
  groupPoints: 4,
};

describe("predictMatch", () => {
  it("los porcentajes siempre suman 100", () => {
    const home: TeamStatsInput = {
      goalsForPerMatch: 1.8,
      goalsAgainstPerMatch: 1.0,
      groupPoints: 7,
      last3Results: ["W", "W", "D"],
    };

    const away: TeamStatsInput = {
      goalsForPerMatch: 1.1,
      goalsAgainstPerMatch: 1.7,
      groupPoints: 3,
      last3Results: ["L", "D", "L"],
    };

    const result = predictMatch(home, away, globalAverages);

    expect(result.homeWin + result.draw + result.awayWin).toBe(100);
  });

  it("equipo con mejores stats tiene mayor probabilidad de ganar", () => {
    const strongerHome: TeamStatsInput = {
      goalsForPerMatch: 2.1,
      goalsAgainstPerMatch: 0.7,
      groupPoints: 9,
      last3Results: ["W", "W", "W"],
    };

    const weakerAway: TeamStatsInput = {
      goalsForPerMatch: 0.8,
      goalsAgainstPerMatch: 1.9,
      groupPoints: 1,
      last3Results: ["L", "L", "D"],
    };

    const result = predictMatch(strongerHome, weakerAway, globalAverages);

    expect(result.homeWin).toBeGreaterThan(result.awayWin);
  });

  it("sin datos H2H no lanza error", () => {
    const home: TeamStatsInput = {
      goalsForPerMatch: 1.5,
      goalsAgainstPerMatch: 1.3,
      groupPoints: 5,
      last3Results: ["W", "L", "D"],
    };

    const away: TeamStatsInput = {
      goalsForPerMatch: 1.4,
      goalsAgainstPerMatch: 1.4,
      groupPoints: 4,
      last3Results: ["D", "W", "L"],
    };

    expect(() => predictMatch(home, away, globalAverages)).not.toThrow();
  });

  it("equipos identicos dan aproximadamente 33% cada uno", () => {
    const home: TeamStatsInput = {
      goalsForPerMatch: 1.6,
      goalsAgainstPerMatch: 1.2,
      groupPoints: 6,
      last3Results: ["W", "D", "L"],
    };

    const away: TeamStatsInput = {
      goalsForPerMatch: 1.6,
      goalsAgainstPerMatch: 1.2,
      groupPoints: 6,
      last3Results: ["W", "D", "L"],
    };

    const result = predictMatch(home, away, globalAverages);

    expect(Math.abs(result.homeWin - 33)).toBeLessThanOrEqual(2);
    expect(Math.abs(result.draw - 33)).toBeLessThanOrEqual(2);
    expect(Math.abs(result.awayWin - 33)).toBeLessThanOrEqual(2);
  });

  it("usa fallback global cuando hay datos insuficientes", () => {
    const insufficientHome: TeamStatsInput = {
      goalsForPerMatch: null,
      goalsAgainstPerMatch: undefined,
      groupPoints: null,
      last3Results: ["W"],
    };

    const insufficientAway: TeamStatsInput = {
      goalsForPerMatch: undefined,
      goalsAgainstPerMatch: null,
      groupPoints: undefined,
      last3Results: [],
    };

    const result = predictMatch(insufficientHome, insufficientAway, globalAverages);

    expect(result.homeWin + result.draw + result.awayWin).toBe(100);
    expect(Math.abs(result.homeWin - result.awayWin)).toBeLessThanOrEqual(1);
  });
});
