"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { Difficulty } from "@/types/quiz";
import type { LeaderboardRow } from "@/lib/supabase/queries";

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={clsx(
        "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase",
        difficulty === "ScriptKiddie" && "bg-cyber-green/10 text-cyber-green",
        difficulty === "Hacker" && "bg-warning-amber/10 text-warning-amber",
        difficulty === "Elite" && "bg-alert-red/10 text-alert-red",
      )}
    >
      {difficulty === "ScriptKiddie" ? "Easy" : difficulty === "Hacker" ? "Medium" : "Hard"}
    </span>
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
      <div className="flex items-center justify-center py-8 text-sm text-zinc-500">
        No runs yet — be the first operative.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => (
          <motion.div
            key={entry.runId}
            layout
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            className={clsx(
              "flex items-center gap-3 rounded-lg border px-3 transition-colors",
              compact ? "py-2" : "py-3",
              i === 0
                ? "border-cyber-green/25 bg-cyber-green/5 shadow-[0_0_12px_rgba(0,255,136,0.06)]"
                : "border-white/5 bg-white/3 hover:bg-white/5",
            )}
          >
            {/* Rank */}
            <span
              className={clsx(
                "w-6 text-center font-mono font-bold",
                compact ? "text-xs" : "text-sm",
                i === 0 ? "text-cyber-green" : i === 1 ? "text-warning-amber" : i === 2 ? "text-zinc-300" : "text-zinc-500",
              )}
            >
              {i === 0 ? "①" : i === 1 ? "②" : i === 2 ? "③" : `${i + 1}`}
            </span>

            {/* Username */}
            <span
              className={clsx(
                "flex-1 font-mono",
                compact ? "text-xs text-zinc-300" : "text-sm text-white",
                i === 0 && "font-semibold",
              )}
            >
              @{entry.username}
            </span>

            {/* Difficulty */}
            {showDifficulty && <DifficultyBadge difficulty={entry.difficulty} />}

            {/* Outcome */}
            <span
              className={clsx(
                "font-mono text-[10px]",
                entry.outcome === "success" ? "text-cyber-green" : "text-alert-red",
              )}
            >
              {entry.outcome === "success" ? "✓" : "✗"}
            </span>

            {/* Score */}
            <span
              className={clsx(
                "font-mono font-bold text-cyber-green",
                compact ? "text-sm" : "text-base",
              )}
            >
              {entry.score.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
