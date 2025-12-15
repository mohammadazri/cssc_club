"use client";

import { useState } from "react";
import clsx from "clsx";
import { MissionLoader } from "@/components/MissionLoader";
import type { Question } from "@/types/quiz";

export function MissionEntry() {
  const [level, setLevel] = useState<"easy" | "medium" | "hard" | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function choose(l: "easy" | "medium" | "hard") {
    setLevel(l);
    setLoading(true);
    try {
      if (l === "easy") {
        const mod = await import("@/data/questions_easy");
        setQuestions(mod.QUESTIONS_EASY);
      } else if (l === "medium") {
        const mod = await import("@/data/questions_medium");
        setQuestions(mod.QUESTIONS_MEDIUM);
      } else {
        const mod = await import("@/data/questions_hard");
        setQuestions(mod.QUESTIONS_HARD);
      }
    } catch (err) {
      // fallback: leave questions null (MissionLoader will not start)
      // In dev you may want to console.error(err)
      // eslint-disable-next-line no-console
      console.error("Failed to load questions for level", l, err);
    } finally {
      setLoading(false);
    }
  }

  if (questions) {
    return <MissionLoader questions={questions} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold text-white">Select Mission Difficulty</h1>

      <div className="flex gap-4">
        <button
          onClick={() => choose("easy")}
          className={clsx(
            "rounded-lg px-5 py-3 font-semibold transition",
            level === "easy" ? "bg-emerald-500 text-black" : "bg-white/5 text-white hover:bg-white/10"
          )}
        >
          Easy
        </button>

        <button
          onClick={() => choose("medium")}
          className={clsx(
            "rounded-lg px-5 py-3 font-semibold transition",
            level === "medium" ? "bg-warning-amber text-black" : "bg-white/5 text-white hover:bg-white/10"
          )}
        >
          Medium
        </button>

        <button
          onClick={() => choose("hard")}
          className={clsx(
            "rounded-lg px-5 py-3 font-semibold transition",
            level === "hard" ? "bg-alert-red text-black" : "bg-white/5 text-white hover:bg-white/10"
          )}
        >
          Hard
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-slate-400">Loading questions…</p>
      )}

      <p className="mt-4 text-xs text-slate-500">Questions are loaded per difficulty and cached for the session.</p>
    </div>
  );
}
