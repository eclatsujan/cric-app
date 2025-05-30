export enum MatchFormat {
  T20 = "T20",
  ODI = "ODI",
  TEST = "TEST",
}

export enum ExtraType {
  NONE = "NONE",
  WIDE = "WIDE",
  NO_BALL = "NO_BALL",
  BYE = "BYE",
  LEG_BYE = "LEG_BYE",
}

export enum WicketType {
  NONE = "NONE",
  BOWLED = "BOWLED",
  CAUGHT = "CAUGHT",
  LBW = "LBW",
  RUN_OUT = "RUN_OUT",
  STUMPED = "STUMPED",
  HIT_WICKET = "HIT_WICKET",
  RETIRED_HURT = "RETIRED_HURT",
  RETIRED_OUT = "RETIRED_OUT",
  TIMED_OUT = "TIMED_OUT",
  OBSTRUCTING_FIELD = "OBSTRUCTING_FIELD",
  HANDLED_BALL = "HANDLED_BALL",
}

export enum MatchStatus {
  UPCOMING = "UPCOMING",
  LIVE = "LIVE",
  DELAYED = "DELAYED",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  players: Player[];
}

export interface BallEvent {
  id: string;
  ballNumber: number; // 0.1, 0.2, ..., 0.6, 1.1, 1.2, etc.
  runs: number;
  extraType: ExtraType;
  extraRuns: number;
  wicketType: WicketType;
  striker: string; // player id
  nonStriker: string; // player id
  bowler: string; // player id
  outBatsman?: string; // player id
  fielder?: string; // player id in case of catches/run outs
  timestamp: number;
}

export interface Over {
  id: string;
  overNumber: number;
  bowler: string; // player id
  balls: BallEvent[];
  runs: number;
  wickets: number;
  maidenOver: boolean;
}

export interface BatsmanInnings {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isBatting: boolean;
  isOut: boolean;
  outMethod?: WicketType;
  outBowler?: string; // player id
  outFielder?: string; // player id
}

export interface BowlerInnings {
  playerId: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface Innings {
  id: string;
  teamId: string;
  battingOrder: string[]; // ordered list of player ids
  currentBatsmen: string[]; // current striker and non-striker ids
  batsmen: Record<string, BatsmanInnings>; // keyed by player id
  bowlers: Record<string, BowlerInnings>; // keyed by player id
  currentBowler: string; // player id
  totalRuns: number;
  totalWickets: number;
  totalOvers: number; // 12.3 would be 12 overs and 3 balls
  currentOverBalls: number;
  extras: number;
  overs: Over[];
  currentRunRate: number;
  requiredRunRate?: number;
}

export interface Match {
  id: string;
  format: MatchFormat;
  venue: string;
  date: string;
  status: MatchStatus;
  teams: {
    team1: Team;
    team2: Team;
  };
  tossWinner: string; // team id
  tossDecision: "BAT" | "FIELD";
  currentInningsNumber: number;
  innings: Innings[];
  maxOvers: number;
  targetScore?: number;
  dls?: {
    isActive: boolean;
    parScore: number;
    revisedTarget?: number;
  };
  result?: {
    winner: string; // team id
    winMargin: number;
    winMarginType: "RUNS" | "WICKETS" | "DRAW" | "TIE";
  };
  events: {
    id: string;
    type: "DELAY" | "RESUME" | "DRINKS" | "INNINGS_BREAK";
    timestamp: number;
    duration?: number;
    description?: string;
  }[];
  matchHistory: BallEvent[]; // For undo/redo support
}
