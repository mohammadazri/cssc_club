"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

import { TerminalText } from "@/components/ui/TerminalText";

const STATS = [
  { label: "Threat Level", value: "ELEVATED", color: "text-warning-amber" },
  { label: "Clearance", value: "PENDING", color: "text-zinc-400" },
  { label: "Operatives Online", value: "147", color: "text-cyber-green" },
];

const BRIEFING_ITEMS = [
  { icon: "🎯", text: "9 security challenges. Identify real threats." },
  { icon: "❤️", text: "3 lives. Each wrong choice costs you one." },
  { icon: "⏱️", text: "45 seconds per challenge. Time pressure is real." },
  { icon: "🧠", text: "Learn the psychology behind social engineering." },
];

export function LandingClient() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toISOString().slice(0, 19).replace("T", " "));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyber-green/30"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: "110vh",
              opacity: 0,
            }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
        {/* Terminal header bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 flex items-center justify-between rounded-lg border border-white/10 bg-surface/60 px-3 py-2 sm:px-4 font-mono text-xs backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="h-2 w-2 rounded-full bg-cyber-green animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
            <span className="text-zinc-500 text-[10px] sm:text-xs">CSSC_SECURE_TERMINAL</span>
          </div>
          <span className="text-zinc-600 text-[10px] sm:text-xs hidden sm:inline">{currentTime} UTC</span>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-surface/80 backdrop-blur-md"
        >
          {/* Scan line */}
          <div className="scan-line" />

          {/* Header section */}
          <div className="border-b border-white/5 bg-surface-light/30 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-cyber-green">
                  Operation
                </span>
                <span className="text-xs text-zinc-500 hidden sm:inline">·</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 hidden sm:inline">
                  Zero-Day Recruit
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="text-right">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-600">
                      {stat.label}
                    </p>
                    <p className={clsx("font-mono text-[10px] sm:text-xs font-medium", stat.color)}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              <TerminalText
                text="You are not here by accident."
                speedMs={25}
                startDelayMs={500}
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4 sm:mt-6 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base lg:text-lg"
            >
              A cinematic security training mission designed for curious minds.
              <span className="text-zinc-500"> No coding required—just sharp instincts and calm nerves.</span>
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 sm:mt-8 lg:mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <Link
                href="/mission"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-cyber-green px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-void-black transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Initialize Mission</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyber-green via-emerald-400 to-cyber-green opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <a
                href="#briefing"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-surface-light/30 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-zinc-200 transition-all hover:border-white/25 hover:bg-surface-light/50"
              >
                Read Briefing
              </a>
            </motion.div>
          </div>

          {/* Briefing section */}
          <motion.div
            id="briefing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="border-t border-white/5 bg-surface-light/20 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-warning-amber animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-zinc-500">
                Mission Briefing
              </span>
            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BRIEFING_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.1 }}
                  className="flex items-start gap-3 rounded-lg border border-white/5 bg-surface/50 p-3 sm:p-4"
                >
                  <span className="text-base sm:text-lg">{item.icon}</span>
                  <span className="text-xs sm:text-sm text-zinc-300">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-4 sm:mt-6 flex items-center gap-2 text-[10px] sm:text-xs text-zinc-600"
            >
              <span>🎧</span>
              <span>For best experience, use headphones and a modern browser.</span>
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Footer badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-4 sm:mt-6 text-center"
        >
          <p className="text-[10px] sm:text-xs text-zinc-600">
            Powered by <span className="text-zinc-500">CSSC Security Lab</span> · UniKL MIIT
          </p>
        </motion.div>
        </div>
      </div>
    </div>
  );
}