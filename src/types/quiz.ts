export type Difficulty = "ScriptKiddie" | "Hacker" | "Elite";

export type SceneId = "vault" | "phishing" | "mainframe";

export interface QuestionOption {
  id: string;
  text: string;
  isTrap: boolean;
}

export interface Question {
  id: string;
  scenario: string;
  question: string;
  options: QuestionOption[];
  explanation: string;
  sceneId: SceneId;
  difficulty: Difficulty;
}

export interface GameState {
  currentLevel: number;
  score: number;
  isTrapped: boolean;
  health: number;
}

export interface RunSummary {
  runId: string;
  startedAtIso: string;
  finishedAtIso: string;
  score: number;
  correctCount: number;
  totalCount: number;
  healthRemaining: number;
  outcome: "success" | "failed";
  // V3 additions — optional so V2 localStorage data still parses safely
  username?: string;
  difficulty?: Difficulty;
}

// V3: Player identity (stored in localStorage + Supabase)
export interface PlayerSession {
  playerId: string;
  username: string;
  deviceId: string;
  createdAt: string;
}

// V3: Difficulty unlock state
export interface UnlockState {
  hackerUnlocked: boolean;
  eliteUnlocked: boolean;
}

// V3: Adaptive difficulty state machine (lives in component state, not persisted)
export interface AdaptiveDifficultyState {
  consecutiveCorrect: number;
  consecutiveWrong: number;
  pointMultiplier: number;    // 0.75 | 1.0 | 1.25 | 1.5
  timerMultiplier: number;    // 0.75 | 1.0 | 1.25
  currentTier: "easier" | "base" | "harder";
}
