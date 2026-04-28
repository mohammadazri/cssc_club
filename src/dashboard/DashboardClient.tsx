"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import type { Difficulty } from "@/types/quiz";
import type { LeaderboardRow } from "@/lib/supabase/queries";
import { useLiveDashboard } from "@/hooks/useLiveDashboard";
import { SplineScene } from "@/components/3d/SplineScene";

/* ─── Style maps ──────────────────────────────────────────────── */
const MEDALS = ["1", "2", "3"] as const;

const PODIUM = [
  {
    row: "border-yellow-400/30 bg-yellow-400/[0.04] shadow-[inset_0_0_40px_rgba(250,204,21,0.04),0_0_24px_rgba(250,204,21,0.07)]",
    accent: "bg-yellow-400/80",
    medal: "text-yellow-400 drop-shadow-[0_0_14px_rgba(250,204,21,1)] text-3xl",
    name: "text-yellow-100 text-lg font-bold",
    score: "text-yellow-300 text-2xl font-black tabular-nums text-glow-gold",
    bar: "from-yellow-500/50 to-yellow-400",
  },
  {
    row: "border-zinc-400/20 bg-zinc-400/[0.025]",
    accent: "bg-zinc-400/60",
    medal: "text-zinc-300 drop-shadow-[0_0_10px_rgba(212,212,216,0.8)] text-2xl",
    name: "text-zinc-200 text-base font-bold",
    score: "text-zinc-200 text-xl font-black tabular-nums",
    bar: "from-zinc-400/40 to-zinc-300",
  },
  {
    row: "border-orange-600/20 bg-orange-900/[0.05]",
    accent: "bg-orange-500/60",
    medal: "text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.7)] text-2xl",
    name: "text-orange-100 text-base font-bold",
    score: "text-orange-300 text-xl font-black tabular-nums",
    bar: "from-orange-500/40 to-orange-400",
  },
] as const;

const DIFF_BADGE: Record<Difficulty, string> = {
  ScriptKiddie: "border-cyber-green/30 bg-cyber-green/10 text-cyber-green",
  Hacker: "border-warning-amber/30 bg-warning-amber/10 text-warning-amber",
  Elite: "border-alert-red/30 bg-alert-red/10 text-alert-red",
};
const DIFF_LABEL: Record<Difficulty, string> = {
  ScriptKiddie: "EASY",
  Hacker: "MED",
  Elite: "ELITE",
};

const FILTER_OPTIONS: (Difficulty | "ALL")[] = ["ALL", "ScriptKiddie", "Hacker", "Elite"];
const FILTER_LABEL: Record<string, string> = { ALL: "ALL", ScriptKiddie: "EASY", Hacker: "MED", Elite: "ELITE" };
const FILTER_ACTIVE: Record<string, string> = {
  ALL: "border-white/20 bg-white/10 text-white",
  ScriptKiddie: "border-cyber-green/40 bg-cyber-green/10 text-cyber-green shadow-[0_0_8px_rgba(0,255,136,0.2)]",
  Hacker: "border-warning-amber/40 bg-warning-amber/10 text-warning-amber shadow-[0_0_8px_rgba(255,170,0,0.2)]",
  Elite: "border-alert-red/40 bg-alert-red/10 text-alert-red shadow-[0_0_8px_rgba(255,34,68,0.2)]",
};

/* ─── Clock ───────────────────────────────────────────────────── */
function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("en-MY", {
          timeZone: "Asia/Kuala_Lumpur",
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        }),
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-right">
      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-700">SYS TIME</p>
      <p className="font-mono text-xl font-black tabular-nums tracking-wider text-cyber-green">{time}</p>
      <p className="font-mono text-[9px] text-zinc-700">MYT · UTC+8</p>
    </div>
  );
}

/* ─── Glitch text ─────────────────────────────────────────────── */
function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={clsx("relative inline-block", className)}>
      <span aria-hidden className="pointer-events-none absolute inset-0 translate-x-[2px] text-alert-red/20 blur-[1px] select-none">{text}</span>
      <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-[2px] text-cyber-green/15 blur-[1px] select-none">{text}</span>
      {text}
    </span>
  );
}

/* ─── Difficulty badge ────────────────────────────────────────── */
function DiffBadge({ d }: { d: Difficulty }) {
  return (
    <span className={clsx(
      "shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
      DIFF_BADGE[d],
    )}>
      {DIFF_LABEL[d]}
    </span>
  );
}

/* ─── Podium card (top 3) ─────────────────────────────────────── */
function PodiumCard({
  entry,
  rank,
  maxScore,
}: {
  entry: LeaderboardRow;
  rank: 1 | 2 | 3;
  maxScore: number;
}) {
  const s = PODIUM[rank - 1];
  const pct = maxScore > 0 ? Math.round((entry.score / maxScore) * 100) : 0;
  const accuracy = entry.totalCount > 0 ? Math.round((entry.correctCount / entry.totalCount) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -24, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ duration: 0.4, delay: (rank - 1) * 0.06 }}
      className={clsx("group relative overflow-hidden rounded-xl border px-5 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(250,204,21,0.1)] bg-black/60 backdrop-blur-md", s.row)}
    >
      <div className={clsx("absolute inset-y-0 left-0 w-1 shadow-[0_0_15px_currentColor]", s.accent)} />
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <div className="flex items-center gap-4 pl-2">
        <div className={clsx("w-10 shrink-0 text-center font-black", s.medal)}>
          {MEDALS[rank - 1]}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={clsx("truncate font-mono", s.name)}>@{entry.username}</span>
            <DiffBadge d={entry.difficulty} />
            <span className={clsx(
              "font-mono text-[10px] font-bold",
              entry.outcome === "success" ? "text-cyber-green drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]" : "text-alert-red drop-shadow-[0_0_5px_rgba(255,34,68,0.5)]",
            )}>
              {entry.outcome === "success" ? "[ ACCESS GRANTED ]" : "[ ACCESS DENIED ]"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={clsx("h-full rounded-full bg-gradient-to-r", s.bar)}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: (rank - 1) * 0.06 + 0.2 }}
              />
            </div>
            <span className="shrink-0 font-mono text-xs tabular-nums text-zinc-400 font-bold">{accuracy}% ACC</span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className={clsx("font-mono", s.score)}>{entry.score.toLocaleString()}</div>
          <div className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-widest">pts</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Regular row (rank 4+) ───────────────────────────────────── */
function LeaderRow({
  entry,
  rank,
  maxScore,
}: {
  entry: LeaderboardRow;
  rank: number;
  maxScore: number;
}) {
  const pct = maxScore > 0 ? Math.round((entry.score / maxScore) * 100) : 0;
  const accuracy = entry.totalCount > 0 ? Math.round((entry.correctCount / entry.totalCount) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.3, delay: Math.min((rank - 4) * 0.04, 0.3) }}
      className="group relative flex items-center gap-3 rounded-lg border border-white/5 bg-black/40 px-4 py-2.5 transition-all duration-300 hover:scale-[1.01] hover:border-cyber-green/50 hover:bg-cyber-green/[0.05] hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 w-0.5 bg-transparent transition-colors group-hover:bg-cyber-green" />
      
      <span className="w-7 shrink-0 text-center font-mono text-sm font-black tabular-nums text-zinc-500 group-hover:text-cyber-green/70 transition-colors">
        {rank.toString().padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-mono text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">@{entry.username}</span>
          <DiffBadge d={entry.difficulty} />
          <span className={clsx(
            "shrink-0 font-mono text-[9px] font-bold",
            entry.outcome === "success" ? "text-cyber-green/80" : "text-alert-red/80",
          )}>
            {entry.outcome === "success" ? "✓" : "✗"}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-px flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-cyber-green/50 group-hover:bg-cyber-green transition-colors"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <span className="shrink-0 font-mono text-[9px] font-bold tabular-nums text-zinc-500 group-hover:text-zinc-300">{accuracy}%</span>
        </div>
      </div>

      <span className="shrink-0 font-mono text-sm font-black tabular-nums text-cyber-green drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]">
        {entry.score.toLocaleString()}
      </span>
    </motion.div>
  );
}

/* ─── Activity item ───────────────────────────────────────────── */
function ActivityItem({ entry }: { entry: LeaderboardRow }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const elapsed = Math.round((now - new Date(entry.finishedAt).getTime()) / 60000);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className={clsx(
        "relative overflow-hidden rounded border px-3 py-2",
        entry.outcome === "success"
          ? "border-cyber-green/10 bg-cyber-green/[0.025]"
          : "border-alert-red/10 bg-alert-red/[0.025]",
      )}
    >
      <div className={clsx(
        "absolute inset-y-0 left-0 w-0.5",
        entry.outcome === "success" ? "bg-cyber-green/40" : "bg-alert-red/40",
      )} />
      <div className="pl-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-xs font-bold text-white">@{entry.username}</span>
          <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-cyber-green">
            {entry.score.toLocaleString()}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <DiffBadge d={entry.difficulty} />
          <span className="font-mono text-[9px] text-zinc-700">
            {elapsed < 1 ? "JUST NOW" : `${elapsed}m AGO`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */
export function DashboardClient() {
  const params = useSearchParams();
  const urlDiff = params.get("difficulty") as Difficulty | null;
  const [filter, setFilter] = useState<Difficulty | "ALL">(
    urlDiff && ["ScriptKiddie", "Hacker", "Elite"].includes(urlDiff) ? urlDiff : "ALL",
  );

  const { entries, activeCount, loading } = useLiveDashboard(
    20,
    filter !== "ALL" ? filter : undefined,
  );

  const [prevTopId, setPrevTopId] = useState<string | null>(null);
  const [flashTop, setFlashTop] = useState(false);
  const [newEntryName, setNewEntryName] = useState<string | null>(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    const topId = entries[0]?.runId ?? null;
    if (prevTopId && topId !== prevTopId) {
      setFlashTop(true);
      setTimeout(() => setFlashTop(false), 800);
    }
    if (prevLengthRef.current > 0 && entries.length > prevLengthRef.current) {
      setNewEntryName(entries[entries.length - 1].username);
      setTimeout(() => setNewEntryName(null), 3500);
    }
    prevLengthRef.current = entries.length;
    setPrevTopId(topId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const topScore = entries[0]?.score ?? 0;
  const successCount = entries.filter((e) => e.outcome === "success").length;
  const failCount = entries.length - successCount;
  const successRate = entries.length > 0 ? Math.round((successCount / entries.length) * 100) : 0;
  const maxScore = entries[0]?.score ?? 1;
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303] font-mono text-zinc-100">

      {/* ── Batman Beyond background ── */}
      <div className="pointer-events-none absolute inset-0" style={{ opacity: 1 }}>
        <SplineScene
          sceneUrl="/models/batman_beyond.spline"
          label="Dashboard background"
          fallbackVariant="mainframe"
          className="h-full w-full"
        />
      </div>

      {/* ── Hex grid overlay ── */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.012)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* ── Vignette ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.82)_100%)]" />

      {/* ── New #1 flash ── */}
      <AnimatePresence>
        {flashTop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 bg-cyber-green/[0.05]"
          />
        )}
      </AnimatePresence>

      {/* ── New entry toast ── */}
      <AnimatePresence>
        {newEntryName && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg border border-cyber-green/40 bg-black/90 px-5 py-2.5 backdrop-blur-md"
          >
            <p className="font-mono text-xs text-cyber-green">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="mr-2 inline-block"
              >
                ⬤
              </motion.span>
              NEW OPERATIVE: @{newEntryName}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex h-screen flex-col">

        {/* ════ HEADER ════ */}
        <header className="relative flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 overflow-hidden border-b border-cyber-green/10 bg-black/10 px-4 py-3.5 md:px-6">
          <div className="scan-line" />
          <div className="pointer-events-none absolute left-0 top-0 h-px w-56 bg-gradient-to-r from-cyber-green/50 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-px w-56 bg-gradient-to-l from-cyber-green/30 to-transparent" />

          {/* Left: identity */}
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="group relative flex h-11 px-4 items-center gap-2 justify-center rounded-xl border border-alert-red/30 bg-alert-red/10 transition-all hover:border-alert-red hover:bg-alert-red/20 overflow-hidden shadow-[0_0_15px_rgba(255,34,68,0.15)] hover:shadow-[0_0_25px_rgba(255,34,68,0.3)]"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-alert-red/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-alert-red transition-colors group-hover:text-white">
                ← ABORT TO HQ
              </span>
            </Link>
            <div className="h-8 w-px bg-white/10" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyber-green/50 bg-cyber-green/10 shadow-[0_0_15px_rgba(0,255,136,0.15)]">
              <svg className="h-5 w-5 text-cyber-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-ping rounded-full bg-cyber-green opacity-75" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyber-green shadow-[0_0_8px_rgba(0,255,136,1)]" />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">CSSC CLUB · UNIKL MIIT</p>
              <h1 className="font-mono text-base font-black uppercase tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                ZERO DAY RECRUIT
                <span className="mx-2 text-zinc-700">/</span>
                <GlitchText text="OPS CENTER" className="text-cyber-green drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
              </h1>
            </div>
          </div>

          {/* Center: inline stats */}
          <div className="hidden items-center gap-6 lg:flex">
            {[
              { label: "TOP SCORE", value: topScore.toLocaleString(), cls: "text-cyber-green" },
              { label: "TOTAL RUNS", value: String(entries.length), cls: "text-zinc-200" },
              { label: "SUCCESS RATE", value: `${successRate}%`, cls: successRate >= 50 ? "text-cyber-green" : "text-alert-red" },
              { label: "ACTIVE NOW", value: String(activeCount), cls: activeCount > 0 ? "text-cyber-green" : "text-zinc-600" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-700">{s.label}</p>
                <p className={clsx("font-mono text-sm font-black tabular-nums", s.cls)}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Right: LIVE + clock */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <motion.span
                className="h-2.5 w-2.5 rounded-full bg-cyber-green shadow-[0_0_8px_rgba(0,255,136,0.8)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="font-mono text-xs font-black uppercase tracking-[0.3em] text-cyber-green">LIVE</span>
            </div>
            <Clock />
          </div>
        </header>

        {/* ════ BODY ════ */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">

          {/* ── LEFT: Leaderboard ── */}
          <div className="flex flex-1 flex-col overflow-hidden min-h-[60vh] lg:min-h-0 p-4 lg:p-6 bg-black/10 border-b lg:border-b-0 lg:border-r border-white/10 relative z-10">

            {/* Section header */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-0.5">
                  <span className="h-4 w-0.5 bg-cyber-green" />
                  <span className="h-4 w-0.5 bg-cyber-green/40" />
                </div>
                <span className="font-mono text-xs font-black uppercase tracking-[0.25em] text-zinc-200">
                  TOP OPERATIVES
                </span>
                {!loading && (
                  <span className="rounded border border-cyber-green/20 bg-cyber-green/5 px-2 py-0.5 font-mono text-[9px] text-cyber-green">
                    {entries.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={clsx(
                      "rounded border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-200",
                      filter === opt
                        ? FILTER_ACTIVE[opt]
                        : "border-white/5 bg-transparent text-zinc-700 hover:border-white/10 hover:text-zinc-500",
                    )}
                  >
                    {FILTER_LABEL[opt]}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-cyber-green"
                        animate={{ opacity: [0.1, 1, 0.1], y: [0, -5, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-700">
                    Accessing secure records…
                  </p>
                </div>
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3">
                <p className="font-mono text-4xl text-zinc-800">[ _ ]</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-700">
                  Awaiting operatives…
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">

                {/* Podium cards: top 3 */}
                <AnimatePresence initial={false}>
                  {podium.map((entry, i) => (
                    <PodiumCard
                      key={entry.runId}
                      entry={entry}
                      rank={(i + 1) as 1 | 2 | 3}
                      maxScore={maxScore}
                    />
                  ))}
                </AnimatePresence>

                {/* Divider */}
                {rest.length > 0 && (
                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-white/[0.04]" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-700">RANKED</span>
                    <div className="h-px flex-1 bg-white/[0.04]" />
                  </div>
                )}

                {/* Compact rows: rank 4+ */}
                <AnimatePresence initial={false}>
                  <div className="space-y-1.5">
                    {rest.map((entry, i) => (
                      <LeaderRow
                        key={entry.runId}
                        entry={entry}
                        rank={i + 4}
                        maxScore={maxScore}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ── RIGHT: Stats + Activity ── */}
          <div className="flex w-full lg:w-64 xl:w-72 flex-col gap-4 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10 bg-black/10 p-4 relative z-10">

            {/* Granted / Denied */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-cyber-green/15 bg-cyber-green/[0.04] p-3 text-center">
                <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">GRANTED</p>
                <p className="font-mono text-2xl font-black text-cyber-green">{successCount}</p>
              </div>
              <div className="rounded-lg border border-alert-red/15 bg-alert-red/[0.04] p-3 text-center">
                <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">DENIED</p>
                <p className="font-mono text-2xl font-black text-alert-red">{failCount}</p>
              </div>
            </div>

            {/* Difficulty split */}
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-0.5 bg-cyber-green/50" />
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">DIFFICULTY SPLIT</p>
              </div>
              <div className="space-y-2.5">
                {(
                  [
                    { label: "EASY", key: "ScriptKiddie" as Difficulty, color: "bg-cyber-green" },
                    { label: "MED", key: "Hacker" as Difficulty, color: "bg-warning-amber" },
                    { label: "ELITE", key: "Elite" as Difficulty, color: "bg-alert-red" },
                  ] as const
                ).map(({ label, key, color }) => {
                  const count = entries.filter((e) => e.difficulty === key).length;
                  const pct = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-8 font-mono text-[9px] uppercase tracking-wider text-zinc-600">{label}</span>
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          className={clsx("h-full rounded-full opacity-70", color)}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </div>
                      <span className="w-5 shrink-0 text-right font-mono text-[10px] tabular-nums text-zinc-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity feed */}
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-0.5 bg-warning-amber/50" />
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">RECENT ACTIVITY</p>
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-warning-amber"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </div>
              <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto scrollbar-thin">
                <AnimatePresence initial={false}>
                  {entries.slice(0, 12).map((entry) => (
                    <ActivityItem key={entry.runId} entry={entry} />
                  ))}
                </AnimatePresence>
                {entries.length === 0 && !loading && (
                  <p className="pt-4 text-center font-mono text-[9px] uppercase tracking-widest text-zinc-700">
                    No transmissions…
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════ FOOTER ════ */}
        <footer className="relative flex items-center justify-between border-t border-cyber-green/[0.07] bg-black/80 px-6 py-2.5 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-green/12 to-transparent" />
          <div className="flex items-center gap-2">
            <motion.span
              className="h-1 w-1 rounded-full bg-cyber-green"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-700">
              CSSC Club · UniKL MIIT · Secure Channel Active
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] text-zinc-800">V3.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
