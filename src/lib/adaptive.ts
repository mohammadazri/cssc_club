import type { AdaptiveDifficultyState } from "@/types/quiz";

export const INITIAL_ADAPTIVE_STATE: AdaptiveDifficultyState = {
  consecutiveCorrect: 0,
  consecutiveWrong: 0,
  pointMultiplier: 1.0,
  timerMultiplier: 1.0,
  currentTier: "base",
};

const CORRECT_THRESHOLD = 3;
const WRONG_THRESHOLD = 2;
const MAX_POINT_MULT = 1.5;
const MIN_POINT_MULT = 0.75;
const MAX_TIMER_MULT = 1.25; // more time = easier
const MIN_TIMER_MULT = 0.75; // less time = harder

export function computeNextAdaptiveState(
  current: AdaptiveDifficultyState,
  wasCorrect: boolean,
): AdaptiveDifficultyState {
  if (wasCorrect) {
    const consecutiveCorrect = current.consecutiveCorrect + 1;
    const consecutiveWrong = 0;

    if (consecutiveCorrect >= CORRECT_THRESHOLD) {
      const pointMultiplier = Math.min(current.pointMultiplier + 0.25, MAX_POINT_MULT);
      const timerMultiplier = Math.max(current.timerMultiplier - 0.25, MIN_TIMER_MULT);
      return {
        consecutiveCorrect: 0,
        consecutiveWrong,
        pointMultiplier,
        timerMultiplier,
        currentTier: pointMultiplier > 1.0 ? "harder" : "base",
      };
    }

    return { ...current, consecutiveCorrect, consecutiveWrong };
  }

  // Wrong answer
  const consecutiveWrong = current.consecutiveWrong + 1;
  const consecutiveCorrect = 0;

  if (consecutiveWrong >= WRONG_THRESHOLD) {
    const pointMultiplier = Math.max(current.pointMultiplier - 0.25, MIN_POINT_MULT);
    const timerMultiplier = Math.min(current.timerMultiplier + 0.25, MAX_TIMER_MULT);
    return {
      consecutiveCorrect,
      consecutiveWrong: 0,
      pointMultiplier,
      timerMultiplier,
      currentTier: pointMultiplier < 1.0 ? "easier" : "base",
    };
  }

  return { ...current, consecutiveCorrect, consecutiveWrong };
}
