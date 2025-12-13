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
}
