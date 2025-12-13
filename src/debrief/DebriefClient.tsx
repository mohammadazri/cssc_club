"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

import { useGamePersistence } from "@/hooks/useGameState";

function formatIso(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function StatCard({ 
  label, 
  value, 
  subtext,
  variant = "default" 
}: { 
  label: string; 
  value: string | number; 
  subtext?: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <div className={clsx(
      "rounded-lg border p-4 transition-all",
      variant === "default" && "border-white/10 bg-white/[0.02]",
      variant === "success" && "border-cyber-green/30 bg-cyber-green/5",
      variant === "warning" && "border-warning-amber/30 bg-warning-amber/5",
      variant === "danger" && "border-alert-red/30 bg-alert-red/5",
    )}>
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={clsx(
        "mt-1 font-mono text-2xl font-bold",
        variant === "default" && "text-zinc-100",
        variant === "success" && "text-cyber-green text-glow-green",
        variant === "warning" && "text-warning-amber",
        variant === "danger" && "text-alert-red",
      )}>
        {value}
      </p>
      {subtext && <p className="mt-1 text-xs text-zinc-500">{subtext}</p>}
    </div>
  );
}

export function DebriefClient() {
  const { lastRun, leaderboard, clear } = useGamePersistence();

  const joinFormUrl = process.env.NEXT_PUBLIC_CLUB_JOIN_FORM_URL || "#";
  const discordUrl = process.env.NEXT_PUBLIC_CLUB_DISCORD_URL || "#";

  const { headline, isSuccess } = useMemo(() => {
    if (!lastRun) return { headline: "NO DEBRIEF FOUND", isSuccess: false };
    if (lastRun.outcome === "success") return { headline: "ACCESS GRANTED", isSuccess: true };
    return { headline: "MISSION FAILED", isSuccess: false };
  }, [lastRun]);

  const accuracy = lastRun 
    ? Math.round((lastRun.correctCount / lastRun.totalCount) * 100) 
    : 0;

  return (
    <div className="relative min-h-screen">
      {/* Success/Failure ambient glow */}
      <div className={clsx(
        "fixed inset-0 pointer-events-none transition-opacity duration-1000",
        lastRun?.outcome === "success" 
          ? "bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.06),transparent_60%)]"
          : "bg-[radial-gradient(ellipse_at_center,rgba(255,34,68,0.04),transparent_60%)]"
      )} />

      <div className="relative z-10 w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className={clsx(
                "h-2 w-2 rounded-full animate-pulse",
                isSuccess ? "bg-cyber-green shadow-[0_0_8px_rgba(0,255,136,0.6)]" : "bg-alert-red shadow-[0_0_8px_rgba(255,34,68,0.6)]"
              )} />
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-zinc-500">
                Mission Debrief
              </span>
            </div>
            <h1 className={clsx(
              "glitch text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl",
              isSuccess ? "text-cyber-green" : "text-alert-red"
            )} data-text={headline}>
              {headline}
            </h1>
            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-zinc-400">
              This is a skills signal, not a grade. If you&apos;re curious and willing to learn, you belong.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-surface/60 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-zinc-200 transition-all hover:border-white/25 hover:bg-surface-light/50"
          >
            ← New Run
          </Link>
        </motion.header>

        {/* Stats Grid */}
        {lastRun && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            <StatCard 
              label="Final Score" 
              value={lastRun.score.toLocaleString()} 
              variant="success"
            />
            <StatCard 
              label="Accuracy" 
              value={`${accuracy}%`}
              subtext={`${lastRun.correctCount}/${lastRun.totalCount} correct`}
              variant={accuracy >= 80 ? "success" : accuracy >= 50 ? "warning" : "danger"}
            />
            <StatCard 
              label="Health" 
              value={lastRun.healthRemaining}
              subtext="remaining"
              variant={lastRun.healthRemaining === 3 ? "success" : lastRun.healthRemaining === 0 ? "danger" : "warning"}
            />
            <StatCard 
              label="Outcome" 
              value={lastRun.outcome === "success" ? "PASS" : "FAIL"}
              variant={lastRun.outcome === "success" ? "success" : "danger"}
            />
          </motion.div>
        )}

        <div className="mt-6 sm:mt-8 lg:mt-10 grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Actions Panel */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-xl border border-white/10 bg-surface/80"
          >
            <div className="border-b border-white/5 bg-surface-light/30 px-4 py-2.5 sm:px-5 sm:py-3">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-zinc-500">
                Next Steps
              </span>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-zinc-300 mb-4 sm:mb-6">
                {isSuccess 
                  ? "You've demonstrated strong security awareness. Ready to go deeper?"
                  : "Every expert was once a beginner. Join us to sharpen your skills."}
              </p>
              <div className="grid gap-2 sm:gap-3">
                <a
                  href={joinFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-cyber-green px-4 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-void-black transition-all hover:shadow-[0_0_25px_rgba(0,255,136,0.3)]"
                >
                  <span className="relative z-10">🎯 Join CSSC Club</span>
                </a>
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-surface-light/30 px-4 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-medium text-zinc-200 transition-all hover:border-white/25 hover:bg-surface-light/50"
                >
                  💬 Join Discord Community
                </a>
                <div className="flex gap-2 sm:gap-3">
                  <Link
                    href="/mission"
                    className="flex-1 inline-flex items-center justify-center rounded-lg border border-white/10 bg-surface/50 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-zinc-300 transition-all hover:bg-surface-light/30"
                  >
                    🔄 Retry
                  </Link>
                  <button
                    type="button"
                    onClick={clear}
                    className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-surface/50 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-zinc-500 transition-all hover:bg-surface-light/30 hover:text-zinc-300"
                  >
                    🗑️ Clear
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Leaderboard Panel */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-xl border border-white/10 bg-surface/80"
          >
            <div className="border-b border-white/5 bg-surface-light/30 px-4 py-2.5 sm:px-5 sm:py-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Local Leaderboard
                </span>
                <span className="text-[10px] sm:text-xs text-zinc-600">Browser only</span>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              {leaderboard.length ? (
                <div className="grid gap-2">
                  {leaderboard.map((e, i) => (
                    <div
                      key={e.runId}
                      className={clsx(
                        "flex items-center justify-between rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 transition-all",
                        i === 0 
                          ? "border-cyber-green/30 bg-cyber-green/5"
                          : "border-white/5 bg-surface/50"
                      )}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={clsx(
                          "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md font-mono text-[10px] sm:text-xs font-bold",
                          i === 0 ? "bg-cyber-green/20 text-cyber-green" : "bg-white/10 text-zinc-500"
                        )}>
                          {i + 1}
                        </span>
                        <span className={clsx(
                          "font-mono text-sm sm:text-lg font-bold",
                          i === 0 ? "text-cyber-green" : "text-zinc-200"
                        )}>
                          {e.score.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-zinc-600 hidden sm:inline">{formatIso(e.finishedAtIso)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 sm:py-8 text-center text-xs sm:text-sm text-zinc-500">
                  No runs recorded yet.
                </p>
              )}
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-12 text-center text-[10px] sm:text-xs text-zinc-600"
        >
          Use this curiosity responsibly. Learn, defend, and protect.
        </motion.footer>
      </div>
    </div>
  );
}