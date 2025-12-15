"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { MissionLoader } from "@/components/MissionLoader";
import type { Question } from "@/types/quiz";

export function MissionEntry() {
  const [level, setLevel] = useState<"easy" | "medium" | "hard" | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<Question[] | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);

  async function choose(l: "easy" | "medium" | "hard") {
    setLevel(l);
    setLoading(true);
    try {
      if (l === "easy") {
        const mod = await import("@/data/questions_easy");
        setAvailableQuestions(mod.QUESTIONS_EASY);
      } else if (l === "medium") {
        const mod = await import("@/data/questions_medium");
        setAvailableQuestions(mod.QUESTIONS_MEDIUM);
      } else {
        const mod = await import("@/data/questions_hard");
        setAvailableQuestions(mod.QUESTIONS_HARD);
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

  function sampleRandom<T>(arr: T[], n: number) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  function startMission() {
    if (!availableQuestions) return;
    const available = availableQuestions.slice();
    const count = Math.min(numQuestions, available.length);
    const chosen = sampleRandom(available, count);
    setQuestions(chosen);
  }

  useEffect(() => {
    // animate pulse when number changes
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 420);
    return () => clearTimeout(t);
  }, [numQuestions]);

  if (questions) {
    return <MissionLoader questions={questions} />;
  }

  const bgClass = level === "easy"
    ? "from-emerald-900 via-emerald-800 to-black"
    : level === "medium"
      ? "from-amber-900 via-amber-800 to-black"
      : level === "hard"
        ? "from-red-900 via-purple-900 to-black"
        : "from-slate-900 via-slate-950 to-black";

  return (
    <div className={clsx(
      "relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-6 py-12 transition-colors duration-700",
      `bg-gradient-to-br ${bgClass}`
    )}>
      <style>{`
        @keyframes scan { 0% { transform: translateY(-100%); opacity: 0 } 10% { opacity: .12 } 50% { opacity: .02 } 100% { transform: translateY(100%); opacity: 0 } }
        @keyframes titleShift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
        @keyframes pulseGlow { 0% { transform: scale(1); box-shadow: none } 50% { transform: scale(1.06); box-shadow: 0 0 24px rgba(16,185,129,0.12) } 100% { transform: scale(1); box-shadow: none } }
        @keyframes glitch1 { 0% { transform: translateX(0) } 20% { transform: translateX(-2px) } 40% { transform: translateX(1px) } 60% { transform: translateX(-1px) } 80% { transform: translateX(0) } 100% { transform: translateX(0) } }
        @keyframes rain { 0% { transform: translateY(-100%) } 100% { transform: translateY(100%) } }

        .hacker-title { background: linear-gradient(90deg, rgba(16,185,129,0.95), rgba(56,189,248,0.85), rgba(168,85,247,0.75)); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: titleShift 6s linear infinite; text-shadow: 0 2px 18px rgba(0,0,0,0.6); }
        .pulse-glow { animation: pulseGlow 420ms ease; }
        .glitch { position: relative; overflow: visible; }
        .glitch::before, .glitch::after { content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; height: 100%; clip: rect(0,9999px,0,0); }
        .glitch::before { left: 2px; text-shadow: -2px 0 rgba(255,0,255,0.6); animation: glitch1 400ms linear infinite; }
        .glitch::after { left: -2px; text-shadow: -2px 0 rgba(0,255,150,0.6); animation: glitch1 650ms linear infinite; }
        .matrix-rain { position: absolute; inset: 0; pointer-events: none; opacity: 0.06; background-image: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 100%), repeating-linear-gradient(180deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 12px); mix-blend-mode: overlay; }
        .matrix-rows { position: absolute; inset: 0; background-image: radial-gradient(rgba(16,185,129,0.02) 1px, transparent 1px); background-size: 8px 8px; transform: translateY(-100%); animation: rain 12s linear infinite; }
        .digit-flicker { transition: color 160ms linear, box-shadow 220ms ease; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px),linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)] bg-size-[32px_32px] opacity-30" />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02))', mixBlendMode: 'overlay'}} />
        <div style={{position:'absolute', left:0,right:0,top:'-40%',height:'200%', background:'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0))', animation:'scan 4s linear infinite'}} />
      </div>

      <h1 className="mb-6 text-2xl sm:text-3xl md:text-4xl text-center font-bold font-mono tracking-wider hacker-title">Choose YOUR MODE</h1>
      <div className="absolute inset-0 matrix-rain"><div className="matrix-rows" /></div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 z-10 w-full max-w-3xl">
        <button
          aria-label="Choose ScriptKiddie (Easy)"
          onClick={() => choose("easy")}
          data-text="ScriptKiddie"
          className={clsx(
            "group relative flex w-full sm:w-40 flex-1 items-center gap-3 rounded-lg border px-4 py-3 transition-transform hover:scale-105",
            level === "easy"
              ? "border-emerald-400 bg-gradient-to-b from-emerald-600/10 to-black/30 ring-2 ring-emerald-400 glitch"
              : "border-slate-700 bg-white/3"
          )}
        >
          <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M21 12A9 9 0 1112 3a9 9 0 019 9z" />
          </svg>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">ScriptKiddie</div>
            <div className="text-xs text-slate-400">Recon • Beginner</div>
          </div>
        </button>

        <button
          aria-label="Choose Hacker (Medium)"
          onClick={() => choose("medium")}
          data-text="Hacker"
          className={clsx(
            "group relative flex w-full sm:w-44 flex-1 items-center gap-3 rounded-lg border px-4 py-3 transition-transform hover:scale-105",
            level === "medium"
              ? "border-amber-400 bg-gradient-to-b from-amber-600/10 to-black/30 ring-2 ring-amber-400 glitch"
              : "border-slate-700 bg-white/3"
          )}
        >
          <svg className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
          </svg>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">Hacker</div>
            <div className="text-xs text-slate-400">Infiltrate • Intermediate</div>
          </div>
        </button>

        <button
          aria-label="Choose Elite (Hard)"
          onClick={() => choose("hard")}
          data-text="Elite"
          className={clsx(
            "group relative flex w-full sm:w-44 flex-1 items-center gap-3 rounded-lg border px-4 py-3 transition-transform hover:scale-105",
            level === "hard"
              ? "border-red-500 bg-gradient-to-b from-red-600/10 to-black/30 ring-2 ring-red-500 glitch"
              : "border-slate-700 bg-white/3"
          )}
        >
          <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 2c1.657 0 3 1.343 3 3v1h3v3h-3v1a3 3 0 11-6 0V9H6V6h3V5c0-1.657 1.343-3 3-3z" />
          </svg>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">Elite</div>
            <div className="text-xs text-slate-400">Exfiltrate • Advanced</div>
          </div>
        </button>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-400 z-10">Loading questions…</p>}

      {availableQuestions ? (
        <div className="mt-6 w-full max-w-3xl z-10 px-2">
          <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-black/40 p-4 sm:p-6 backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-mono text-emerald-400">MISSION BRIEF</h2>
                <p className="text-xs text-slate-400">Difficulty: <span className="font-semibold text-white">{level}</span></p>
              </div>
              <div className="text-xs text-slate-400">Asset cache: {availableQuestions.length} items</div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row items-center gap-3">
              <label className="text-xs text-slate-400">Questions</label>
              <input
                type="range"
                min={5}
                max={Math.min(20, availableQuestions.length)}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="h-2 w-full sm:w-48 accent-emerald-400"
                title="Select number of questions"
              />
              <div className="ml-0 sm:ml-2 w-12 rounded bg-white/5 px-2 py-1 text-center text-sm font-medium">{numQuestions}</div>
            </div>

            <div className="mb-4 text-xs text-slate-500">Questions will be selected randomly and kept hidden—focus on the mission, not the answers.</div>

            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-end gap-2">
              <button
                onClick={() => setAvailableQuestions(null)}
                className="rounded px-3 py-2 text-xs bg-white/5 w-full sm:w-auto"
              >
                Back
              </button>
              <button
                onClick={startMission}
                disabled={availableQuestions.length < 5 || numQuestions < 5}
                className={clsx(
                  "rounded px-4 py-2 font-semibold w-full sm:w-auto",
                  availableQuestions.length >= 5 && numQuestions >= 5 ? "bg-emerald-500 text-black" : "bg-white/5 text-white/40 cursor-not-allowed"
                )}
              >
                Launch Mission
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-xs text-slate-500 z-10">Questions are loaded per difficulty and cached for the session.</p>
      )}
    </div>
  );
}
