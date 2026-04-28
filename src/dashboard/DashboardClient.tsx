"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import type { Difficulty } from "@/types/quiz";
import type { LeaderboardRow } from "@/lib/supabase/queries";
import { useLiveDashboard } from "@/hooks/useLiveDashboard";
import { LiveLeaderboard } from "@/components/LiveLeaderboard";
import { SplineScene } from "@/components/3d/SplineScene";

/* ─── Clock ─────────────────────────────────────────── */
function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-MY", {
          timeZone: "Asia/Kuala_Lumpur",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-sm tabular-nums text-cyber-green/80">
      {time} <span className="text-zinc-600">MYT</span>
    </span>
  );
}

/* ─── Difficulty filter ──────────────────────────────── */
const DIFFICULTY_OPTIONS: (Difficulty | "ALL")[] = ["ALL", "ScriptKiddie", "Hacker", "Elite"];
const DIFFICULTY_LABELS: Record<string, string> = {
  ALL: "ALL",
  ScriptKiddie: "EASY",
  Hacker: "MED",
  Elite: "ELITE",
};
const DIFFICULTY_ACTIVE: Record<string, string> = {
  ALL: "bg-white/20 text-white border-white/20",
  ScriptKiddie: "bg-cyber-green/15 text-cyber-green border-cyber-green/30 shadow-[0_0_10px_rgba(0,255,136,0.2)]",
  Hacker: "bg-warning-amber/15 text-warning-amber border-warning-amber/30 shadow-[0_0_10px_rgba(255,170,0,0.2)]",
  Elite: "bg-alert-red/15 text-alert-red border-alert-red/30 shadow-[0_0_10px_rgba(255,34,68,0.2)]",
};

function DifficultyFilter({
  value,
  onChange,
}: {
  value: Difficulty | "ALL";
  onChange: (v: Difficulty | "ALL") => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {DIFFICULTY_OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={clsx(
            "rounded border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-200",
            value === opt
              ? DIFFICULTY_ACTIVE[opt]
              : "border-white/8 bg-white/3 text-zinc-600 hover:border-white/15 hover:text-zinc-400",
          )}
        >
          {DIFFICULTY_LABELS[opt]}
        </button>
      ))}
    </div>
  );
}

/* ─── Activity feed card ─────────────────────────────── */
function ActivityCard({ entry, index }: { entry: LeaderboardRow; index: number }) {
  const elapsed = Math.round((Date.now() - new Date(entry.finishedAt).getTime()) / 60000);
  const accuracy = entry.totalCount > 0
    ? Math.round((entry.correctCount / entry.totalCount) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, x: 8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={clsx(
        "relative overflow-hidden rounded-lg border p-3 transition-colors",
        entry.outcome === "success"
          ? "border-cyber-green/15 bg-cyber-green/[0.04]"
          : "border-alert-red/15 bg-alert-red/[0.04]",
      )}
    >
      {/* left accent bar */}
      <div
        className={clsx(
          "absolute inset-y-0 left-0 w-0.5",
          entry.outcome === "success" ? "bg-cyber-green/60" : "bg-alert-red/60",
        )}
      />
      <div className="pl-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-xs font-bold text-white">
            @{entry.username}
          </span>
          <span
            className={clsx(
              "shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
              entry.difficulty === "ScriptKiddie" && "border-cyber-green/25 bg-cyber-green/10 text-cyber-green",
              entry.difficulty === "Hacker" && "border-warning-amber/25 bg-warning-amber/10 text-warning-amber",
              entry.difficulty === "Elite" && "border-alert-red/25 bg-alert-red/10 text-alert-red",
            )}
          >
            {entry.difficulty === "ScriptKiddie" ? "EASY" : entry.difficulty === "Hacker" ? "MED" : "ELITE"}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-cyber-green">
            {entry.score.toLocaleString()} pts
          </span>
          <span className="font-mono text-[10px] text-zinc-500">{accuracy}% acc</span>
          <span
            className={clsx(
              "font-mono text-[10px] font-bold",
              entry.outcome === "success" ? "text-cyber-green" : "text-alert-red",
            )}
          >
            {entry.outcome === "success" ? "[ ACCESS GRANTED ]" : "[ BREACH FAILED ]"}
          </span>
        </div>
        <p className="mt-1 font-mono text-[9px] text-zinc-700">
          {elapsed < 1 ? "JUST NOW" : `${elapsed}M AGO`}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Glitch text ────────────────────────────────────── */
function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={clsx("relative inline-block", className)}>
      <span aria-hidden className="pointer-events-none absolute inset-0 translate-x-[2px] text-alert-red/30 blur-[1px] select-none">
        {text}
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-[2px] text-cyber-green/20 blur-[1px] select-none">
        {text}
      </span>
      {text}
    </span>
  );
}

/* ─── Stat chip ──────────────────────────────────────── */
function StatChip({ label, value, color = "green" }: { label: string; value: string | number; color?: "green" | "amber" | "red" }) {
  return (
    <div className={clsx(
      "rounded border px-3 py-1.5 text-center",
      color === "green" && "border-cyber-green/20 bg-cyber-green/5",
      color === "amber" && "border-warning-amber/20 bg-warning-amber/5",
      color === "red" && "border-alert-red/20 bg-alert-red/5",
    )}>
      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">{label}</p>
      <p className={clsx(
        "font-mono text-sm font-bold tabular-nums",
        color === "green" && "text-cyber-green",
        color === "amber" && "text-warning-amber",
        color === "red" && "text-alert-red",
      )}>{value}</p>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export function DashboardClient() {
  const params = useSearchParams();
  const urlDifficulty = params.get("difficulty") as Difficulty | null;
  const [filter, setFilter] = useState<Difficulty | "ALL">(
    urlDifficulty && ["ScriptKiddie", "Hacker", "Elite"].includes(urlDifficulty)
      ? urlDifficulty
      : "ALL",
  );

  const { entries, activeCount, loading } = useLiveDashboard(
    20,
    filter !== "ALL" ? filter : undefined,
  );

  const [prevTopId, setPrevTopId] = useState<string | null>(null);
  const [flashTop, setFlashTop] = useState(false);

  useEffect(() => {
    const topId = entries[0]?.runId ?? null;
    if (prevTopId && topId !== prevTopId) {
      setFlashTop(true);
      setTimeout(() => setFlashTop(false), 700);
    }
    setPrevTopId(topId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const topScore = entries[0]?.score ?? 0;
  const successCount = entries.filter((e) => e.outcome === "success").length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303] font-mono text-zinc-100">

      {/* ── Batman Beyond leaderboard background ── */}
      <div className="pointer-events-none absolute inset-0">
        <SplineScene
          sceneUrl="/models/batman_beyond.spline"
          label="Dashboard background"
          fallbackVariant="mainframe"
          className="h-full w-full opacity-20"
        />
      </div>

      {/* ── Hex grid overlay ── */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.018)_1px,transparent_1px)] bg-[size:44px_44px]" />

      {/* ── Vignette ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

      {/* ── #1 rank flash ── */}
      <AnimatePresence>
        {flashTop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none fixed inset-0 z-50 bg-cyber-green/6"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex h-screen flex-col">

        {/* ════ HEADER ════ */}
        <header className="relative flex items-center justify-between overflow-hidden border-b border-cyber-green/10 bg-black/60 px-6 py-3 backdrop-blur-md">
          <div className="scan-line" />
          {/* corner accent lines */}
          <div className="pointer-events-none absolute left-0 top-0 h-px w-32 bg-gradient-to-r from-cyber-green/60 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-px w-32 bg-gradient-to-l from-cyber-green/40 to-transparent" />

          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-cyber-green/30 bg-cyber-green/8">
              <svg className="h-5 w-5 text-cyber-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-cyber-green" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyber-green" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">CSSC CLUB · UNIKL MIIT</p>
              <h1 className="text-base font-black uppercase tracking-widest text-white">
                ZERO DAY RECRUIT —{" "}
                <GlitchText text="OPERATIONS CENTER" className="text-cyber-green text-glow-green" />
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Stats row */}
            <div className="hidden items-center gap-3 md:flex">
              <StatChip label="Top Score" value={topScore.toLocaleString()} color="green" />
              <StatChip label="Successes" value={successCount} color="amber" />
              <StatChip
                label="Active (15m)"
                value={activeCount}
                color={activeCount > 0 ? "green" : "red"}
              />
            </div>

            {/* Live indicator + clock */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <motion.span
                  className="h-2 w-2 rounded-full bg-cyber-green"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-cyber-green">
                  LIVE
                </span>
              </div>
              <Clock />
            </div>
          </div>
        </header>

        {/* ════ MAIN GRID ════ */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── LEFT: Leaderboard ── */}
          <div className="flex flex-1 flex-col overflow-hidden border-r border-white/5 p-5 lg:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-0.5 bg-cyber-green" />
                <h2 className="font-mono text-xs font-black uppercase tracking-[0.2em] text-zinc-200">
                  TOP OPERATIVES
                </h2>
                <span className="rounded border border-cyber-green/20 bg-cyber-green/5 px-2 py-0.5 font-mono text-[9px] text-cyber-green">
                  {entries.length}
                </span>
              </div>
              <DifficultyFilter value={filter} onChange={setFilter} />
            </div>

            {/* Column headers */}
            {!loading && entries.length > 0 && (
              <div className="mb-2 flex items-center gap-3 px-3">
                <span className="w-7 text-center font-mono text-[9px] uppercase tracking-wider text-zinc-700">RNK</span>
                <span className="flex-1 font-mono text-[9px] uppercase tracking-wider text-zinc-700">OPERATIVE</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-700">LVL</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-700 tabular-nums">SCORE</span>
              </div>
            )}

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-cyber-green"
                        animate={{ opacity: [0.15, 1, 0.15], y: [0, -4, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-700">
                    Accessing records…
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
                <LiveLeaderboard entries={entries} showDifficulty />
              </div>
            )}
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex w-72 flex-col overflow-hidden xl:w-96">

            {/* Nexbot interactive robot — top half */}
            <div className="relative flex-1 overflow-hidden border-b border-white/5">
              {/* Section label */}
              <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-2 bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
                <span className="h-1 w-1 rounded-full bg-cyber-green" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                  FIELD OPERATIVE — INTERACTIVE
                </span>
              </div>

              <SplineScene
                sceneUrl="/models/nexbot_robot_character_concept.spline"
                label="Nexbot operative"
                fallbackVariant="vault"
                className="h-full w-full"
              />

              {/* Decorative corner accents */}
              <div className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-cyber-green/30" />
              <div className="pointer-events-none absolute right-2 bottom-2 h-4 w-4 border-b border-r border-cyber-green/30" />
            </div>

            {/* Activity feed — bottom half */}
            <div className="flex flex-col overflow-hidden bg-black/20 p-4" style={{ maxHeight: "45%" }}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-0.5 bg-warning-amber/70" />
                <h2 className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  RECENT ACTIVITY
                </h2>
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-warning-amber"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
              </div>
              <div className="flex-1 space-y-1.5 overflow-y-auto pr-0.5 scrollbar-thin">
                <AnimatePresence initial={false}>
                  {entries.slice(0, 8).map((entry, i) => (
                    <ActivityCard key={entry.runId} entry={entry} index={i} />
                  ))}
                </AnimatePresence>
                {entries.length === 0 && !loading && (
                  <p className="pt-6 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-700">
                    Awaiting transmissions…
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════ FOOTER ════ */}
        <footer className="relative flex items-center justify-between overflow-hidden border-t border-cyber-green/8 bg-black/60 px-6 py-2.5 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyber-green/20 to-transparent" />
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-700">
            CSSC Club · UniKL MIIT · Secure Channel Active
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-[9px] uppercase tracking-widest text-zinc-700 transition-colors hover:text-zinc-400"
            >
              ← Mission HQ
            </Link>
            <span className="font-mono text-[9px] text-zinc-800">V3.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
