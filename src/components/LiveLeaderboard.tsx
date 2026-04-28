"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { Difficulty } from "@/types/quiz";
import type { LeaderboardRow } from "@/lib/supabase/queries";

const RANK_CONFIG = [
  {
    badge: "◆",
    label: "1ST",
    rowClass: "border-yellow-400/30 bg-yellow-400/5 shadow-[0_0_18px_rgba(250,204,21,0.10)]",
    badgeClass: "text-yellow-400 text-glow-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]",
    nameClass: "text-yellow-200 font-bold",
    scoreClass: "text-yellow-300",
  },
  {
    badge: "◈",
    label: "2ND",
    rowClass: "border-zinc-400/25 bg-zinc-400/5 shadow-[0_0_12px_rgba(161,161,170,0.08)]",
    badgeClass: "text-zinc-300 drop-shadow-[0_0_6px_rgba(212,212,216,0.6)]",
    nameClass: "text-zinc-200 font-semibold",
    scoreClass: "text-zinc-200",
  },
  {
    badge: "◇",
    label: "3RD",
    rowClass: "border-orange-700/25 bg-orange-900/10 shadow-[0_0_10px_rgba(194,65,12,0.07)]",
    badgeClass: "text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]",
    nameClass: "text-orange-200 font-semibold",
    scoreClass: "text-orange-300",
  },
];

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={clsx(
        "rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border",
        difficulty === "ScriptKiddie" && "border-cyber-green/30 bg-cyber-green/10 text-cyber-green",
        difficulty === "Hacker" && "border-warning-amber/30 bg-warning-amber/10 text-warning-amber",
        difficulty === "Elite" && "border-alert-red/30 bg-alert-red/10 text-alert-red",
      )}
    >
      {difficulty === "ScriptKiddie" ? "EASY" : difficulty === "Hacker" ? "MED" : "ELITE"}
    </span>
  );
}

function ScoreBar({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return (
    <div className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-white/5">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-cyber-green/50 to-cyber-green"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </div>
  );
}

export function LiveLeaderboard({
  entries,
  compact = false,
  showDifficulty = true,
}: {
  entries: LeaderboardRow[];
  compact?: boolean;
  showDifficulty?: boolean;
}) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="font-mono text-3xl text-zinc-700">[ ]</div>
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
          Awaiting operatives…
        </p>
      </div>
    );
  }

  const maxScore = entries[0]?.score ?? 1;

  return (
    <div className="space-y-1.5">
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => {
          const cfg = RANK_CONFIG[i] ?? null;
          const accuracy = entry.totalCount > 0
            ? Math.round((entry.correctCount / entry.totalCount) * 100)
            : 0;

          return (
            <motion.div
              key={entry.runId}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.96 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              className={clsx(
                "group relative overflow-hidden rounded-lg border px-3 transition-all duration-200",
                compact ? "py-2" : "py-2.5",
                cfg
                  ? cfg.rowClass
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]",
              )}
            >
              {/* shimmer on hover for top 3 */}
              {cfg && (
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
              )}

              <div className="flex items-center gap-3">
                {/* Rank badge */}
                <span
                  className={clsx(
                    "w-7 shrink-0 text-center font-mono font-black",
                    compact ? "text-sm" : "text-base",
                    cfg ? cfg.badgeClass : "text-zinc-600",
                  )}
                >
                  {cfg ? cfg.badge : `${i + 1}`}
                </span>

                {/* Username + score bar */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        "truncate font-mono",
                        compact ? "text-xs" : "text-sm",
                        cfg ? cfg.nameClass : "text-zinc-300",
                      )}
                    >
                      @{entry.username}
                    </span>
                    {!compact && (
                      <span className="shrink-0 font-mono text-[10px] text-zinc-600">
                        {accuracy}%
                      </span>
                    )}
                    <span
                      className={clsx(
                        "shrink-0 font-mono text-[10px]",
                        entry.outcome === "success" ? "text-cyber-green" : "text-alert-red",
                      )}
                    >
                      {entry.outcome === "success" ? "✓" : "✗"}
                    </span>
                  </div>
                  {!compact && <ScoreBar score={entry.score} maxScore={maxScore} />}
                </div>

                {/* Difficulty badge */}
                {showDifficulty && <DifficultyBadge difficulty={entry.difficulty} />}

                {/* Score */}
                <span
                  className={clsx(
                    "shrink-0 font-mono font-bold tabular-nums",
                    compact ? "text-sm" : "text-base",
                    cfg ? cfg.scoreClass : "text-cyber-green",
                  )}
                >
                  {entry.score.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
