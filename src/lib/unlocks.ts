import type { RunSummary, UnlockState } from "@/types/quiz";
import { getUnlocksFromDB, grantUnlockInDB } from "./supabase/queries";

const UNLOCK_CACHE_KEY = "zdr:unlocks";

function loadCachedUnlocks(): UnlockState {
  if (typeof window === "undefined") return { hackerUnlocked: false, eliteUnlocked: false };
  try {
    const raw = window.localStorage.getItem(UNLOCK_CACHE_KEY);
    if (!raw) return { hackerUnlocked: false, eliteUnlocked: false };
    return JSON.parse(raw) as UnlockState;
  } catch {
    return { hackerUnlocked: false, eliteUnlocked: false };
  }
}

function saveCachedUnlocks(state: UnlockState): void {
  try {
    window.localStorage.setItem(UNLOCK_CACHE_KEY, JSON.stringify(state));
  } catch {}
}

// localStorage-primary, Supabase-canonical
export async function loadUnlocks(playerId: string): Promise<UnlockState> {
  const cached = loadCachedUnlocks();
  // If both are already unlocked, no need to re-check Supabase
  if (cached.hackerUnlocked && cached.eliteUnlocked) return cached;

  // Check Supabase for any unlocks this device doesn't know about (cross-device)
  try {
    const remote = await getUnlocksFromDB(playerId);
    const merged: UnlockState = {
      hackerUnlocked: cached.hackerUnlocked || remote.hackerUnlocked,
      eliteUnlocked: cached.eliteUnlocked || remote.eliteUnlocked,
    };
    if (merged.hackerUnlocked !== cached.hackerUnlocked || merged.eliteUnlocked !== cached.eliteUnlocked) {
      saveCachedUnlocks(merged);
    }
    return merged;
  } catch {
    return cached;
  }
}

// Write to both Supabase and localStorage cache
export async function grantUnlock(
  playerId: string,
  difficulty: "Hacker" | "Elite",
): Promise<void> {
  const cached = loadCachedUnlocks();
  const updated: UnlockState = {
    hackerUnlocked: cached.hackerUnlocked || difficulty === "Hacker",
    eliteUnlocked: cached.eliteUnlocked || difficulty === "Elite",
  };
  saveCachedUnlocks(updated);
  await grantUnlockInDB(playerId, difficulty);
}

// Check if a completed run qualifies for a new unlock
export function checkUnlockEligibility(
  summary: RunSummary,
): "Hacker" | "Elite" | null {
  if (summary.outcome !== "success") return null;
  const accuracy = summary.totalCount > 0 ? summary.correctCount / summary.totalCount : 0;
  if (accuracy < 0.6) return null;

  if (summary.difficulty === "ScriptKiddie" && summary.score >= 400) return "Hacker";
  if (summary.difficulty === "Hacker" && summary.score >= 800) return "Elite";
  return null;
}
