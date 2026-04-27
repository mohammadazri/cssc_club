"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { Difficulty } from "@/types/quiz";
import type { LeaderboardRow } from "@/lib/supabase/queries";
import { useLiveDashboard } from "@/hooks/useLiveDashboard";
import { LiveLeaderboard } from "@/components/LiveLeaderboard";
import { SplineScene } from "@/components/3d/SplineScene";

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
  return <span className="font-mono text-sm text-zinc-400">{time} MYT</span>;
}

function DifficultyFilter({
  value,
  onChange,
}: {
  value: Difficulty | "ALL";
  onChange: (v: Difficulty | "ALL") => void;
}) {
  const options: (Difficulty | "ALL")[] = ["ALL", "ScriptKiddie", "Hacker", "Elite"];
  const labels: Record<string, string> = {
    ALL: "All",
    ScriptKiddie: "Easy",
    Hacker: "Medium",
    Elite: "Hard",
  };

  return (
    <div className="flex items-center gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={clsx(
            "rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider transition-all",
            value === opt
              ? opt === "ALL"
                ? "bg-white/20 text-white"
                : opt === "ScriptKiddie"
                  ? "bg-cyber-green/20 text-cyber-green"
                  : opt === "Hacker"
                    ? "bg-warning-amber/20 text-warning-amber"
                    : "bg-alert-red/20 text-alert-red"
              : "bg-white/5 text-zinc-500 hover:text-zinc-300",
          )}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

function ActivityCard({ entry, index }: { entry: LeaderboardRow; index: number }) {
  const elapsed = Math.round((Date.now() - new Date(entry.finishedAt).getTime()) / 60000);
  const accuracy = entry.totalCount > 0 ? Math.round((entry.correctCount / entry.totalCount) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={clsx(
        "rounded-lg border p-3",
        entry.outcome === "success" ? "border-cyber-green/15 bg-cyber-green/5" : "border-alert-red/15 bg-alert-red/5",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold text-white">@{entry.username}</span>
        <span
          className={clsx(
            "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase",
            entry.difficulty === "ScriptKiddie" && "bg-cyber-green/10 text-cyber-green",
            entry.difficulty === "Hacker" && "bg-warning-amber/10 text-warning-amber",
            entry.difficulty === "Elite" && "bg-alert-red/10 text-alert-red",
          )}
        >
          {entry.difficulty === "ScriptKiddie" ? "Easy" : entry.difficulty === "Hacker" ? "Medium" : "Hard"}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-400">
        <span className="font-mono font-bold text-cyber-green">{entry.score.toLocaleString()} pts</span>
        <span>{accuracy}% accuracy</span>
        <span className={entry.outcome === "success" ? "text-cyber-green" : "text-alert-red"}>
          {entry.outcome === "success" ? "✓ ACCESS GRANTED" : "✗ FAILED"}
        </span>
      </div>
      <p className="mt-1 text-[10px] text-zinc-600">
        {elapsed < 1 ? "just now" : `${elapsed}m ago`}
      </p>
    </motion.div>
  );
}

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
      setTimeout(() => setFlashTop(false), 600);
    }
    setPrevTopId(topId);
  }, [entries]);

  const dashboardScene = process.env.NEXT_PUBLIC_SPLINE_DASHBOARD_SCENE;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] font-mono text-zinc-100">
      {/* 3D background */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <SplineScene
          sceneUrl={dashboardScene}
          label="Dashboard background"
          fallbackVariant="mainframe"
          className="h-full w-full"
        />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* #1 rank change flash */}
      <AnimatePresence>
        {flashTop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 bg-cyber-green/5"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex h-screen flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-white/5 bg-black/40 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyber-green/30 bg-cyber-green/10">
              <svg className="h-5 w-5 text-cyber-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">CSSC CLUB · UNIKL MIIT</p>
              <h1 className="text-lg font-black uppercase tracking-wider text-white">
                ZERO DAY RECRUIT{" "}
                <span className="text-cyber-green text-glow-green">OPERATIONS CENTER</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyber-green" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyber-green">LIVE</span>
            </div>
            <div className="text-right">
              <Clock />
              <p className="text-[10px] text-zinc-600">
                {activeCount} operative{activeCount !== 1 ? "s" : ""} active (15 min)
              </p>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <div className="flex flex-1 gap-0 overflow-hidden lg:gap-0">
          {/* LEFT: Leaderboard */}
          <div className="flex flex-1 flex-col overflow-hidden border-r border-white/5 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
                TOP OPERATIVES
              </h2>
              <DifficultyFilter value={filter} onChange={setFilter} />
            </div>

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-cyber-green"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1">
                <LiveLeaderboard entries={entries} showDifficulty />
              </div>
            )}
          </div>

          {/* RIGHT: Activity feed */}
          <div className="hidden w-80 flex-col overflow-hidden p-6 xl:flex">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-300">
              RECENT ACTIVITY
            </h2>
            <div className="flex-1 space-y-2 overflow-y-auto">
              <AnimatePresence initial={false}>
                {entries.slice(0, 10).map((entry, i) => (
                  <ActivityCard key={entry.runId} entry={entry} index={i} />
                ))}
              </AnimatePresence>
              {entries.length === 0 && !loading && (
                <p className="pt-8 text-center text-xs text-zinc-600">
                  Waiting for operatives to complete missions…
                </p>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="flex items-center justify-between border-t border-white/5 bg-black/40 px-6 py-3 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            CSSC Club · UniKL MIIT · Secure Connection Established
          </p>
          <p className="text-[10px] text-zinc-700">V3.0.0</p>
        </footer>
      </div>
    </div>
  );
}
