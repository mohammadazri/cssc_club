"use client";

import { useState, useEffect, useCallback } from "react";
import type { UnlockState } from "@/types/quiz";
import { loadUnlocks, grantUnlock as grantUnlockLib } from "@/lib/unlocks";

const OFFLINE_UNLOCKS: UnlockState = { hackerUnlocked: false, eliteUnlocked: false };

export function useUnlockProgress(playerId: string | null) {
  const [unlocks, setUnlocks] = useState<UnlockState>(OFFLINE_UNLOCKS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!playerId) {
      setUnlocks(OFFLINE_UNLOCKS);
      setLoaded(true);
      return;
    }

    loadUnlocks(playerId).then((state) => {
      setUnlocks(state);
      setLoaded(true);
    });
  }, [playerId]);

  const grantUnlock = useCallback(
    async (difficulty: "Hacker" | "Elite") => {
      if (!playerId) return;
      await grantUnlockLib(playerId, difficulty);
      setUnlocks((prev) => ({
        hackerUnlocked: prev.hackerUnlocked || difficulty === "Hacker",
        eliteUnlocked: prev.eliteUnlocked || difficulty === "Elite",
      }));
    },
    [playerId],
  );

  return { unlocks, loaded, grantUnlock };
}
