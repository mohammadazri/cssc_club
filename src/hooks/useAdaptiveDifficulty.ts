"use client";

import { useState, useCallback } from "react";
import type { AdaptiveDifficultyState } from "@/types/quiz";
import { computeNextAdaptiveState, INITIAL_ADAPTIVE_STATE } from "@/lib/adaptive";

export function useAdaptiveDifficulty() {
  const [state, setState] = useState<AdaptiveDifficultyState>(INITIAL_ADAPTIVE_STATE);

  const recordAnswer = useCallback((wasCorrect: boolean) => {
    setState((prev) => computeNextAdaptiveState(prev, wasCorrect));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_ADAPTIVE_STATE);
  }, []);

  return { state, recordAnswer, reset };
}
