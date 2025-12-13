"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { TerminalText } from "@/components/ui/TerminalText";

export function LandingClient() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="rounded-3xl border border-white/10 bg-void-black/70 p-8 sm:p-12">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
          Operation · Zero-Day Recruit
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
          <TerminalText
            text="You are not here by accident."
            speedMs={18}
            startDelayMs={250}
          />
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-zinc-200 sm:text-base">
          A short, cinematic security mission designed for curious students. No
          coding required—just good instincts.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/mission"
            className="inline-flex items-center justify-center rounded-xl bg-cyber-green px-5 py-3 text-sm font-semibold text-void-black transition hover:opacity-90"
          >
            Start Mission
          </Link>
          <a
            href="#rules"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
          >
            Read Briefing
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="mt-10 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
          id="rules"
        >
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Briefing
            </p>
            <ul className="grid gap-2 text-sm text-zinc-200">
              <li>• 9 security challenges. 3 strikes max.</li>
              <li>• Wrong answers trigger an intrusion trap + explanation.</li>
              <li>• Finish the mission to unlock your debrief.</li>
            </ul>
          </div>
          <p className="text-xs text-zinc-500">
            For best experience, use headphones and a modern browser.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
