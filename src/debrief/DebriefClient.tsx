"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";

import { useGamePersistence } from "@/hooks/useGameState";

function formatIso(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function DebriefClient() {
  const { lastRun, leaderboard, clear } = useGamePersistence();

  const joinFormUrl = process.env.NEXT_PUBLIC_CLUB_JOIN_FORM_URL || "#";
  const discordUrl = process.env.NEXT_PUBLIC_CLUB_DISCORD_URL || "#";

  const headline = useMemo(() => {
    if (!lastRun) return "No debrief found";
    if (lastRun.outcome === "success") return "ACCESS GRANTED";
    return "MISSION FAILED";
  }, [lastRun]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Debrief
          </p>
          <h1
            className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl"
            data-text={headline}
          >
            <span className="glitch" data-text={headline}>
              {headline}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-200">
            This is a skills signal, not a grade. If you’re curious and willing
            to learn, you belong.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 hover:bg-white/10"
        >
          New Run
        </Link>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-white/10 bg-void-black/60 p-6"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
            Your Results
          </p>
          {lastRun ? (
            <div className="mt-4 grid gap-2 text-sm text-zinc-200">
              <p>
                Score: <span className="font-semibold text-zinc-50">{lastRun.score}</span>
              </p>
              <p>
                Correct: {lastRun.correctCount}/{lastRun.totalCount}
              </p>
              <p>
                Health Remaining: {lastRun.healthRemaining}
              </p>
              <p className="text-xs text-zinc-500">
                Finished: {formatIso(lastRun.finishedAtIso)}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-400">
              Run the mission to generate a debrief.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={joinFormUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-cyber-green px-5 py-3 text-sm font-semibold text-void-black transition hover:opacity-90"
            >
              Join the Club (Form)
            </a>
            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
            >
              Discord
            </a>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
            >
              Clear Debrief
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="rounded-2xl border border-white/10 bg-void-black/60 p-6"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
            Local Leaderboard
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Stored only in this browser (no server).
          </p>
          <div className="mt-4 grid gap-2">
            {leaderboard.length ? (
              leaderboard.map((e, i) => (
                <div
                  key={e.runId}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="text-sm text-zinc-200">
                    #{i + 1} <span className="text-zinc-500">·</span> {e.score}
                  </p>
                  <p className="text-xs text-zinc-500">{formatIso(e.finishedAtIso)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-400">No runs yet.</p>
            )}
          </div>
        </motion.section>
      </div>

      <footer className="mt-10 text-xs text-zinc-500">
        Use this curiosity responsibly. Learn, defend, and protect.
      </footer>
    </div>
  );
}
