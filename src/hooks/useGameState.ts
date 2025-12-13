"use client";

import { useCallback, useState } from "react";

import type { RunSummary } from "@/types/quiz";

const LAST_RUN_KEY = "zdr:lastRun";
const LEADERBOARD_KEY = "zdr:leaderboard";

export interface LeaderboardEntry {
  runId: string;
  finishedAtIso: string;
  score: number;
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function useGamePersistence() {
  const [lastRun, setLastRun] = useState<RunSummary | null>(() => {
    if (typeof window === "undefined") return null;
    return safeJsonParse<RunSummary>(window.localStorage.getItem(LAST_RUN_KEY));
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    if (typeof window === "undefined") return [];
    return (
      safeJsonParse<LeaderboardEntry[]>(
        window.localStorage.getItem(LEADERBOARD_KEY),
      ) ?? []
    );
  });

  const saveRun = useCallback((summary: RunSummary) => {
    setLastRun(summary);
    try {
      window.localStorage.setItem(LAST_RUN_KEY, JSON.stringify(summary));

      const current =
        safeJsonParse<LeaderboardEntry[]>(
          window.localStorage.getItem(LEADERBOARD_KEY),
        ) ?? [];

      const next = [...current, {
        runId: summary.runId,
        finishedAtIso: summary.finishedAtIso,
        score: summary.score,
      }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(next));
      setLeaderboard(next);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  const clear = useCallback(() => {
    setLastRun(null);
    try {
      window.localStorage.removeItem(LAST_RUN_KEY);
    } catch {
      // Ignore.
    }
  }, []);

  return {
    lastRun,
    leaderboard,
    saveRun,
    clear,
  };
}
