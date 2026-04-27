"use client";

import { useState } from "react";
import type { PlayerSession } from "@/types/quiz";
import { loadSession, clearSession } from "@/lib/session";
import { UsernameGate } from "@/components/UsernameGate";
import { MissionEntry } from "@/components/MissionEntry";

export function MissionPage() {
  const [session, setSession] = useState<PlayerSession | null>(() => {
    if (typeof window === "undefined") return null;
    return loadSession();
  });

  function handleChangeOperator() {
    clearSession();
    setSession(null);
  }

  if (!session) {
    return (
      <UsernameGate
        onComplete={(s) => setSession(s)}
        onChangeOperator={handleChangeOperator}
      />
    );
  }

  return (
    <MissionEntry
      username={session.username}
      playerId={session.playerId}
    />
  );
}
