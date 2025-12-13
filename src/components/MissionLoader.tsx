"use client";

import { useSplinePreloader } from "@/hooks/useSplinePreloader";
import { QuizEngine } from "@/components/QuizEngine";
import type { Question } from "@/types/quiz";
import { motion } from "framer-motion";

export function MissionLoader({ questions }: { questions: Question[] }) {
  const { status, progress, loadedCount, totalCount } = useSplinePreloader();

  // Show loading screen while preloading
  if (status === "loading" || status === "idle") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-size-[32px_32px]" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-20 w-20 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10"
          >
            <svg className="h-10 w-10 text-emerald-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </motion.div>

          <div className="space-y-3">
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold tracking-widest text-white"
            >
              INITIALIZING MISSION
            </motion.h2>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-slate-400"
            >
              Caching 3D environments for optimal performance...
            </motion.p>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-72 space-y-3"
          >
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
                className="h-full bg-emerald-500"
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>
                {loadedCount}/{totalCount} assets
              </span>
              <span>{progress}%</span>
            </div>
          </motion.div>

          {/* Loading dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-emerald-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>

          <p className="text-[10px] uppercase tracking-widest text-slate-600">
            First load only • Cached for future runs
          </p>
        </div>
      </div>
    );
  }

  // Ready or error - show the quiz (fallback visuals will show if scenes failed)
  return <QuizEngine questions={questions} />;
}
