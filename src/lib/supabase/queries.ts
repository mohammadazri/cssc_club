import { getSupabaseClient } from "./client";
import type { Difficulty, RunSummary, UnlockState } from "@/types/quiz";

export interface LeaderboardRow {
  runId: string;
  username: string;
  score: number;
  difficulty: Difficulty;
  finishedAt: string;
  outcome: "success" | "failed";
  correctCount: number;
  totalCount: number;
}

// Register or retrieve a player by device_id, ensuring username uniqueness
export async function upsertPlayer(
  username: string,
  deviceId: string,
): Promise<{ playerId: string; username: string } | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;

  try {
    // 1. Check if the username is already taken by ANYONE
    const { data: existingByName } = await sb
      .from("players")
      .select("id, device_id, username")
      .eq("username", username)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingByName) {
      if (existingByName.device_id === deviceId) {
        // It's the same user logging in with their existing username
        return { playerId: existingByName.id, username: existingByName.username };
      } else {
        // Username is taken by a DIFFERENT device/user
        throw new Error("USERNAME_TAKEN");
      }
    }

    // 2. Check if this device already has an account but wants a NEW username
    const { data: existingByDevice } = await sb
      .from("players")
      .select("id, username")
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingByDevice) {
      // Update their existing account with the new username
      const { data: updated, error } = await sb
        .from("players")
        .update({ username })
        .eq("id", existingByDevice.id)
        .select("id, username")
        .single();
        
      if (error || !updated) return null;
      return { playerId: updated.id, username: updated.username };
    }

    // 3. Create brand new player
    const { data: inserted, error } = await sb
      .from("players")
      .insert({ username, device_id: deviceId })
      .select("id, username")
      .single();

    if (error || !inserted) return null;
    return { playerId: inserted.id, username: inserted.username };
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "USERNAME_TAKEN") {
      throw err; // Propagate to caller
    }
    return null;
  }
}

// Insert a completed run (fire-and-forget from game client)
export async function insertRun(
  summary: RunSummary,
  playerId: string,
): Promise<void> {
  const sb = getSupabaseClient();
  if (!sb || !summary.difficulty) return;

  try {
    await sb.from("runs").insert({
      run_id: summary.runId,
      player_id: playerId,
      difficulty: summary.difficulty,
      score: summary.score,
      correct_count: summary.correctCount,
      total_count: summary.totalCount,
      health_remaining: summary.healthRemaining,
      outcome: summary.outcome,
      started_at: summary.startedAtIso,
      finished_at: summary.finishedAtIso,
    });
  } catch {}
}

// Get top N runs with player usernames for leaderboard
export async function getTopRuns(
  limit: number,
  difficulty?: Difficulty,
): Promise<LeaderboardRow[]> {
  const sb = getSupabaseClient();
  if (!sb) return [];

  try {
    let query = sb
      .from("runs")
      .select("run_id, score, difficulty, finished_at, outcome, correct_count, total_count, players(username)")
      .order("score", { ascending: false })
      .limit(limit);

    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    const { data } = await query;
    if (!data) return [];

    return data.map((row) => ({
      runId: row.run_id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      username: (row.players as any)?.username ?? "Unknown",
      score: row.score,
      difficulty: row.difficulty as Difficulty,
      finishedAt: row.finished_at,
      outcome: row.outcome as "success" | "failed",
      correctCount: row.correct_count,
      totalCount: row.total_count,
    }));
  } catch {
    return [];
  }
}

// Count runs completed within the last N minutes (active players proxy)
export async function getActiveRuns(withinMinutes: number): Promise<number> {
  const sb = getSupabaseClient();
  if (!sb) return 0;

  try {
    const since = new Date(Date.now() - withinMinutes * 60 * 1000).toISOString();
    const { count } = await sb
      .from("runs")
      .select("*", { count: "exact", head: true })
      .gte("finished_at", since);

    return count ?? 0;
  } catch {
    return 0;
  }
}

// Fetch unlock state for a player from Supabase
export async function getUnlocksFromDB(
  playerId: string,
): Promise<UnlockState> {
  const sb = getSupabaseClient();
  if (!sb) return { hackerUnlocked: false, eliteUnlocked: false };

  try {
    const { data } = await sb
      .from("unlock_progress")
      .select("difficulty")
      .eq("player_id", playerId);

    if (!data) return { hackerUnlocked: false, eliteUnlocked: false };

    return {
      hackerUnlocked: data.some((r) => r.difficulty === "Hacker"),
      eliteUnlocked: data.some((r) => r.difficulty === "Elite"),
    };
  } catch {
    return { hackerUnlocked: false, eliteUnlocked: false };
  }
}

// Grant an unlock in Supabase
export async function grantUnlockInDB(
  playerId: string,
  difficulty: "Hacker" | "Elite",
): Promise<void> {
  const sb = getSupabaseClient();
  if (!sb) return;

  try {
    await sb
      .from("unlock_progress")
      .insert({ player_id: playerId, difficulty })
      .select();
  } catch {}
}
