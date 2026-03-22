import * as groupService from "@/server/services/football/groupService";
import * as matchService from "@/server/services/football/matchService";
import type { FootballMatch } from "@/server/services/football/types";

interface TeamStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

interface TeamInfo {
  id: number;
  name: string;
  crest: string | null;
}

interface TeamPosition {
  group: string | null | undefined;
  position: number;
}

interface TeamCompareData extends TeamInfo {
  stats: TeamStats;
  position: TeamPosition | null;
}

interface CompareTeamsResult {
  teamA: TeamCompareData;
  teamB: TeamCompareData;
  h2h: FootballMatch[];
}

function getMatchGoals(match: FootballMatch, teamId: number): { goalsFor: number; goalsAgainst: number } {
  const isHome = match.homeTeam.id === teamId;
  const homeGoals = match.score.fullTime.home ?? 0;
  const awayGoals = match.score.fullTime.away ?? 0;

  return {
    goalsFor: isHome ? homeGoals : awayGoals,
    goalsAgainst: isHome ? awayGoals : homeGoals,
  };
}

export async function compareTeams(teamAId: number, teamBId: number): Promise<CompareTeamsResult> {
  const [allMatches, standings] = await Promise.all([
    matchService.getAll(),
    groupService.getStandings(),
  ]);

  const getTeamMatches = (teamId: number): FootballMatch[] => {
    return allMatches.filter((match) => {
      const hasTeam = match.homeTeam.id === teamId || match.awayTeam.id === teamId;
      return hasTeam && match.status === "FINISHED";
    });
  };

  const calcStats = (teamId: number): TeamStats => {
    const matches = getTeamMatches(teamId);

    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    for (const match of matches) {
      const goals = getMatchGoals(match, teamId);

      goalsFor += goals.goalsFor;
      goalsAgainst += goals.goalsAgainst;

      if (goals.goalsFor > goals.goalsAgainst) {
        wins += 1;
      } else if (goals.goalsFor === goals.goalsAgainst) {
        draws += 1;
      } else {
        losses += 1;
      }
    }

    return {
      played: matches.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDiff: goalsFor - goalsAgainst,
      points: wins * 3 + draws,
    };
  };

  const getTeamInfo = (teamId: number): TeamInfo => {
    const match = allMatches.find((item) => item.homeTeam.id === teamId || item.awayTeam.id === teamId);
    const team = match?.homeTeam.id === teamId ? match.homeTeam : match?.awayTeam;

    return {
      id: teamId,
      name: team?.name ?? "Equipo",
      crest: team?.crest ?? null,
    };
  };

  const h2hMatches = allMatches.filter((match) => {
    const isDirectA = match.homeTeam.id === teamAId && match.awayTeam.id === teamBId;
    const isDirectB = match.homeTeam.id === teamBId && match.awayTeam.id === teamAId;
    return isDirectA || isDirectB;
  });

  const findPosition = (teamId: number): TeamPosition | null => {
    for (const group of standings) {
      const entry = group.table.find((standing) => standing.team.id === teamId);
      if (entry) {
        return {
          group: group.group,
          position: entry.position,
        };
      }
    }

    return null;
  };

  return {
    teamA: {
      ...getTeamInfo(teamAId),
      stats: calcStats(teamAId),
      position: findPosition(teamAId),
    },
    teamB: {
      ...getTeamInfo(teamBId),
      stats: calcStats(teamBId),
      position: findPosition(teamBId),
    },
    h2h: h2hMatches,
  };
}

export const compareService = {
  compareTeams,
};
