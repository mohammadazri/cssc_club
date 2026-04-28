"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { PlayerSession } from "@/types/quiz";
import { SplineScene } from "@/components/3d/SplineScene";

const USERNAME_RE = /^[a-zA-Z0-9_-]{2,24}$/;

export function UsernameGate({
  onComplete,
  onChangeOperator,
  existingSession,
}: {
  onComplete: (session: PlayerSession) => void;
  onChangeOperator?: () => void;
  existingSession?: PlayerSession | null;
}) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dashboardScene = "/models/nexbot_robot_character_concept.spline";

  function validate(val: string): string | null {
    if (val.length < 2) return "Must be at least 2 characters";
    if (val.length > 24) return "Maximum 24 characters";
    if (!USERNAME_RE.test(val)) return "Letters, numbers, _ and - only";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    const validationError = validate(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      // Import here to avoid circular deps at module level
      const { getOrCreateDeviceId } = await import("@/lib/session");
      const { upsertPlayer } = await import("@/lib/supabase/queries");
      const { saveSession } = await import("@/lib/session");

      const deviceId = getOrCreateDeviceId();
      const result = await upsertPlayer(trimmed, deviceId);
      const playerId = result?.playerId ?? `offline-${deviceId}`;
      const resolvedUsername = result?.username ?? trimmed;

      const session: PlayerSession = {
        playerId,
        username: resolvedUsername,
        deviceId,
        createdAt: new Date().toISOString(),
      };

      saveSession(session);
      onComplete(session);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "USERNAME_TAKEN") {
        setError("Callsign already in use by another operative.");
        return;
      }

      setError("Connection failed — proceeding in offline mode");
      const { getOrCreateDeviceId, saveSession } = await import("@/lib/session");
      const deviceId = getOrCreateDeviceId();
      const session: PlayerSession = {
        playerId: `offline-${deviceId}`,
        username: username.trim(),
        deviceId,
        createdAt: new Date().toISOString(),
      };
      saveSession(session);
      onComplete(session);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void-black">
      {/* 3D background */}
      <div className="absolute inset-0 opacity-40">
        <SplineScene
          sceneUrl={dashboardScene}
          label="Gateway"
          fallbackVariant="mainframe"
          className="h-full w-full"
        />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,136,0.12),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface/90 backdrop-blur-xl shadow-[0_0_60px_rgba(0,255,136,0.08)]">
          {/* Header */}
          <div className="relative border-b border-white/5 bg-white/5 px-6 py-5">
            <div className="scan-line" />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyber-green/30 bg-cyber-green/10">
                <svg className="h-5 w-5 text-cyber-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">CSSC QUIZ</p>
                <h1 className="text-lg font-bold text-white">Identify Operative</h1>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label htmlFor="username" className="mb-2 block text-xs uppercase tracking-widest text-zinc-400">
                Operative Callsign
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. 0xGhost_42"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={24}
                  className={clsx(
                    "w-full rounded-lg border bg-void-black/60 px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all",
                    error
                      ? "border-alert-red/60 focus:border-alert-red focus:shadow-[0_0_0_3px_rgba(255,34,68,0.15)]"
                      : "border-white/10 focus:border-cyber-green/60 focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]",
                  )}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-600">
                  {username.length}/24
                </span>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-alert-red"
                >
                  {error}
                </motion.p>
              )}
              <p className="mt-1.5 text-xs text-zinc-600">
                Letters, numbers, _ and - · 2–24 chars · shown on leaderboard
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || username.trim().length < 2}
              className={clsx(
                "relative w-full overflow-hidden rounded-lg px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all",
                submitting || username.trim().length < 2
                  ? "cursor-not-allowed bg-white/5 text-zinc-600"
                  : "bg-cyber-green text-black hover:bg-cyber-green/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] active:scale-[0.98]",
              )}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border border-black border-t-transparent" />
                  Authenticating…
                </span>
              ) : (
                "Deploy Operative"
              )}
            </button>
          </form>

          {/* Footer */}
          {(existingSession || onChangeOperator) && (
            <div className="border-t border-white/5 px-6 py-4">
              <button
                onClick={onChangeOperator}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Change Operator (clears session)
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
