"use client";

import { useState, useCallback, useEffect } from "react";
import type { PlayerSession } from "@/types/quiz";
import {
  loadSession,
  saveSession as persistSession,
  clearSession as removeSession,
  getOrCreateDeviceId,
} from "@/lib/session";
import { upsertPlayer } from "@/lib/supabase/queries";

export function usePlayerSession() {
  const [session, setSession] = useState<PlayerSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadSession();
    setSession(stored);
    setLoading(false);
  }, []);

  const createSession = useCallback(async (username: string): Promise<PlayerSession> => {
    const deviceId = getOrCreateDeviceId();

    // Try Supabase first; fall back to offline mode
    const result = await upsertPlayer(username, deviceId);
    const playerId = result?.playerId ?? `offline-${deviceId}`;
    const resolvedUsername = result?.username ?? username;

    const newSession: PlayerSession = {
      playerId,
      username: resolvedUsername,
      deviceId,
      createdAt: new Date().toISOString(),
    };

    persistSession(newSession);
    setSession(newSession);
    return newSession;
  }, []);

  const clearSession = useCallback(() => {
    removeSession();
    setSession(null);
  }, []);

  return { session, loading, createSession, clearSession };
}
