"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Howl } from "howler";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import type { Difficulty, Question, RunSummary } from "@/types/quiz";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useGamePersistence } from "@/hooks/useGameState";
import { useAdaptiveDifficulty } from "@/hooks/useAdaptiveDifficulty";
import { OptionButton } from "@/components/ui/OptionButton";
import { TrapOverlay } from "@/components/3d/TrapOverlay";
import { SplineScene } from "@/components/3d/SplineScene";

const TIME_PER_QUESTION = 45;
const CRITICAL_TIME = 10;
const MAX_HEALTH = 3;

function pointsForDifficulty(difficulty: Question["difficulty"], multiplier = 1.0) {
  const base = difficulty === "Elite" ? 250 : difficulty === "Hacker" ? 175 : 100;
  return Math.round(base * multiplier);
}

function getDifficultyColor(difficulty: Question["difficulty"]) {
  switch (difficulty) {
    case "ScriptKiddie": return "text-cyber-green";
    case "Hacker": return "text-warning-amber";
    case "Elite": return "text-alert-red";
  }
}

const DIFFICULTY_SCENE_MAP: Record<Difficulty, string> = {
  ScriptKiddie: "/models/genkub_greeting_robot.spline",
  Hacker: "/models/lock.spline",
  Elite: "/models/server.spline",
};

const DIFFICULTY_FALLBACK_MAP: Record<Difficulty, "vault" | "phishing" | "mainframe"> = {
  ScriptKiddie: "vault",
  Hacker: "phishing",
  Elite: "mainframe",
};

function Scene({ difficulty }: { difficulty: Difficulty }) {
  return (
    <SplineScene
      sceneUrl={DIFFICULTY_SCENE_MAP[difficulty]}
      label={difficulty}
      fallbackVariant={DIFFICULTY_FALLBACK_MAP[difficulty]}
      className="h-full"
    />
  );
}

function HealthDisplay({ current, max }: { current: number; max: number }) {
  if (max === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-wider text-zinc-500">SYS</span>
        <div className="flex items-center gap-1 rounded px-2 py-1 bg-white/5 text-sm text-cyber-green">
          <span className="font-mono">∞</span>
          <span className="text-xs text-zinc-400">unlimited</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 text-xs uppercase tracking-wider text-zinc-500">SYS</span>
      {Array.from({ length: max }).map((_, i) => {
        const isActive = i < current;
        const isCritical = current === 1 && isActive;
        const isWarning = current === 2 && isActive;
        return (
          <div
            key={i}
            className={clsx(
              "h-5 w-8 rounded-sm border transition-all duration-300",
              isActive && !isCritical && !isWarning && "health-segment active border-cyber-green/50",
              isWarning && "health-segment warning border-warning-amber/50",
              isCritical && "health-segment critical border-alert-red/50",
              !isActive && "health-segment lost border-white/10"
            )}
          />
        );
      })}
    </div>
  );
}

function CountdownTimer({ seconds, isCritical }: { seconds: number; isCritical: boolean }) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${minutes}:${secs.toString().padStart(2, "0")}`;
  return (
    <div className={clsx(
      "font-mono text-2xl font-bold tracking-wider transition-all",
      isCritical ? "animate-countdown" : "text-zinc-300"
    )}>
      <span className="mr-1 text-xs uppercase tracking-wider text-zinc-500">TIME</span>
      {display}
    </div>
  );
}

function ScoreDisplay({ score, justEarned }: { score: number; justEarned: number | null }) {
  return (
    <div className="relative flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-zinc-500">PTS</span>
      <span className="font-mono text-xl font-bold text-cyber-green text-glow-green">
        {score.toLocaleString()}
      </span>
      <AnimatePresence>
        {justEarned && (
          <motion.span
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute -right-8 font-mono text-sm font-bold text-cyber-green"
          >
            +{justEarned}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = ((current + 1) / total) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-zinc-400">
        {current + 1}<span className="text-zinc-600">/</span>{total}
      </span>
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-green/80 to-cyber-green"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function ThreatLevel({ difficulty }: { difficulty: Question["difficulty"] }) {
  const levels = { ScriptKiddie: 1, Hacker: 2, Elite: 3 };
  const level = levels[difficulty];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-zinc-500">THREAT</span>
      <div className="flex gap-0.5">
        {[1, 2, 3].map((l) => (
          <div
            key={l}
            className={clsx(
              "h-3 w-1 rounded-sm transition-all",
              l <= level
                ? level === 3
                  ? "bg-alert-red shadow-[0_0_6px_rgba(255,34,68,0.6)]"
                  : level === 2
                    ? "bg-warning-amber shadow-[0_0_6px_rgba(255,170,0,0.5)]"
                    : "bg-cyber-green shadow-[0_0_6px_rgba(0,255,136,0.5)]"
                : "bg-white/10"
            )}
          />
        ))}
      </div>
      <span className={clsx("text-xs font-medium", getDifficultyColor(difficulty))}>
        {difficulty}
      </span>
    </div>
  );
}

function AdaptivePill({ tier }: { tier: "easier" | "base" | "harder" }) {
  if (tier === "base") return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        "rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
        tier === "harder" ? "bg-cyber-green/15 text-cyber-green" : "bg-warning-amber/15 text-warning-amber",
      )}
    >
      {tier === "harder" ? "FLOW +" : "ASSIST"}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN QUIZ ENGINE
   ══════════════════════════════════════════════════════════════════════════ */
export function QuizEngine({
  questions,
  timePerQuestion = TIME_PER_QUESTION,
  maxHealth = MAX_HEALTH,
  username = "",
  difficulty,
}: {
  questions: Question[];
  timePerQuestion?: number;
  maxHealth?: number;
  username?: string;
  difficulty?: Difficulty;
}) {
  const router = useRouter();
  const { saveRun } = useGamePersistence();
  const { state: adaptive, recordAnswer } = useAdaptiveDifficulty();
  const containerRef = useRef<HTMLDivElement>(null);

  const [startedAtIso] = useState(() => new Date().toISOString());
  const [runId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now()),
  );

  function shuffleArray<T>(input: T[]) {
    const arr = input.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const shuffledQuestions = useMemo(() => {
    const qClone = questions.map((q) => ({
      ...q,
      options: q.options.map((o) => ({ ...o })),
    }));
    qClone.forEach((q) => { q.options = shuffleArray(q.options); });
    return shuffleArray(qClone);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, runId]);

  const [idx, setIdx] = useState(0);
  const unlimited = maxHealth === 0;
  const [health, setHealth] = useState(() => (unlimited ? Infinity : maxHealth));
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [trapOpen, setTrapOpen] = useState(false);
  const [trapTitle, setTrapTitle] = useState("Trap Triggered");
  const [trapMessage, setTrapMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => timePerQuestion);
  const [justEarned, setJustEarned] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const sfx = useSoundEffects(audioEnabled);

  const bgRef = useRef<Howl | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!bgRef.current) {
      bgRef.current = new Howl({
        src: ["/audio/quiz_bg.mp3"],
        loop: false,
        volume: 0.18,
        preload: true,
        html5: true,
        mute: true,
      });
      bgRef.current.on("end", () => {
        if (bgRef.current && audioEnabled) {
          try { bgRef.current.seek(0); bgRef.current.play(); } catch {}
        }
      });
      try { bgRef.current.play(); } catch {}
    }
    return () => { bgRef.current?.unload(); bgRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const howl = bgRef.current;
    if (!howl) return;
    if (audioEnabled) {
      try { if (!howl.playing()) howl.play(); } catch {}
      try { howl.mute(false); } catch {}
      try { howl.fade(0, 0.18, 800); } catch {}
    } else {
      try { howl.fade(0.18, 0, 500); } catch {}
      setTimeout(() => { try { howl.mute(true); } catch {} }, 500);
    }
  }, [audioEnabled]);

  const q = shuffledQuestions[idx];
  const total = shuffledQuestions.length;
  const isCriticalTime = timeLeft <= CRITICAL_TIME;

  // Reset timer using adaptive timer multiplier whenever question or multiplier changes
  const effectiveTime = Math.round(timePerQuestion * adaptive.timerMultiplier);
  useEffect(() => {
    setTimeLeft(effectiveTime);
  }, [idx, effectiveTime]);

  const finish = useCallback((
    outcome: RunSummary["outcome"],
    nextHealth: number,
    nextScore: number,
    nextCorrect: number,
  ) => {
    const finishedAtIso = new Date().toISOString();
    const summary: RunSummary = {
      runId,
      startedAtIso,
      finishedAtIso,
      score: nextScore,
      correctCount: nextCorrect,
      totalCount: total,
      healthRemaining: nextHealth,
      outcome,
      username: username || undefined,
      difficulty,
    };
    saveRun(summary);
    router.push("/debrief");
  }, [runId, startedAtIso, total, saveRun, router, username, difficulty]);

  const handleTimeout = useCallback(() => {
    setLocked(true);
    sfx.play("fail");
    recordAnswer(false);
    const nextHealth = Math.max(0, health - 1);
    setHealth(nextHealth);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    setTrapTitle("TIME EXPIRED");
    setTrapMessage("You took too long to respond. In real attacks, hesitation can be costly.");
    setTrapOpen(true);
    if (nextHealth <= 0) {
      setTimeout(() => finish("failed", nextHealth, score, correctCount), 450);
    }
  }, [health, sfx, finish, score, correctCount, recordAnswer]);

  useEffect(() => {
    if (trapOpen || locked) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [idx, trapOpen, locked, handleTimeout]);

  function onAnswer(isTrap: boolean) {
    if (locked) return;
    setLocked(true);
    recordAnswer(!isTrap);

    if (isTrap) {
      sfx.play("fail");
      const nextHealth = Math.max(0, health - 1);
      setHealth(nextHealth);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTrapTitle("INTRUSION DETECTED");
      setTrapMessage(q.explanation);
      setTrapOpen(true);
      if (nextHealth <= 0) {
        setTimeout(() => finish("failed", nextHealth, score, correctCount), 450);
      }
      return;
    }

    sfx.play("success");
    const earned = pointsForDifficulty(q.difficulty, adaptive.pointMultiplier);
    const nextScore = score + earned;
    const nextCorrect = correctCount + 1;
    setScore(nextScore);
    setCorrectCount(nextCorrect);
    setJustEarned(earned);
    setTimeout(() => setJustEarned(null), 1000);

    const isLast = idx >= total - 1;
    if (isLast) {
      setTimeout(() => finish("success", health, nextScore, nextCorrect), 450);
      return;
    }
    setTimeout(() => { setIdx((v) => v + 1); setLocked(false); }, 420);
  }

  function continueAfterTrap() {
    sfx.play("click");
    setTrapOpen(false);
    setLocked(false);
    const isLast = idx >= total - 1;
    if (!isLast && health > 0) {
      setIdx((v) => v + 1);
    }
  }

  const hud = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-surface/80 backdrop-blur-sm"
    >
      <div className="scan-line" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,#20e3b2_1px,transparent_0)] [background-size:16px_16px]" />

      {/* Mobile layout */}
      <div className="flex flex-col gap-3 p-3 sm:hidden">
        <div className="flex items-center justify-between">
          <ProgressBar current={idx} total={total} />
          <CountdownTimer key={idx} seconds={timeLeft} isCritical={isCriticalTime} />
        </div>
        <div className="flex items-center justify-between">
          <ThreatLevel difficulty={q.difficulty} />
          <div className="flex items-center gap-3">
            <HealthDisplay current={health} max={maxHealth} />
            <ScoreDisplay score={score} justEarned={justEarned} />
            <button
              onClick={() => { sfx.play("click", true); setAudioEnabled(!audioEnabled); }}
              className={clsx(
                "flex h-7 w-7 items-center justify-center rounded-md border transition-all text-sm",
                audioEnabled ? "border-cyber-green/50 bg-cyber-green/10 text-cyber-green" : "border-white/10 bg-white/5 text-zinc-500"
              )}
              aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
            >
              {audioEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-4 px-4 py-3 lg:px-5 lg:py-4">
        <div className="flex items-center gap-4 lg:gap-6">
          <ProgressBar current={idx} total={total} />
          <ThreatLevel difficulty={q.difficulty} />
          {username && (
            <span className="hidden lg:flex items-center gap-1.5 font-mono text-xs text-zinc-500">
              <span className="text-cyber-green">@</span>{username}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <AdaptivePill tier={adaptive.currentTier} />
          <CountdownTimer seconds={timeLeft} isCritical={isCriticalTime} />
          <HealthDisplay current={health} max={maxHealth} />
          <ScoreDisplay score={score} justEarned={justEarned} />
          <button
            onClick={() => { sfx.play("click", true); setAudioEnabled(!audioEnabled); }}
            className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-md border transition-all",
              audioEnabled ? "border-cyber-green/50 bg-cyber-green/10 text-cyber-green" : "border-white/10 bg-white/5 text-zinc-500 hover:text-zinc-300"
            )}
            aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
          >
            {audioEnabled ? "🔊" : "🔇"}
          </button>
        </div>
      </div>
    </motion.div>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [adaptive.currentTier, audioEnabled, health, idx, isCriticalTime, justEarned, q.difficulty, score, timeLeft, total, sfx, username]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative w-full min-h-screen overflow-hidden px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8",
        shaking && "animate-shake"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(32,227,178,0.08),transparent_30%),radial-gradient(circle_at_80%_0,rgba(255,64,112,0.08),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.08),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:22px_22px] opacity-25" />

      <div className="relative mb-4 flex justify-end">
        <motion.div whileHover={{ scale: 1.03, x: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 280, damping: 18 }}>
          <Link
            href="/"
            onClick={() => sfx.play("click")}
            className="group relative flex items-center gap-2 rounded-lg border border-alert-red/50 bg-alert-red/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-alert-red shadow-[0_0_22px_rgba(255,34,68,0.25)] hover:border-alert-red hover:bg-alert-red/15"
          >
            <span className="text-sm">✕</span>
            <span className="relative">
              Abort
              <span aria-hidden className="pointer-events-none absolute inset-0 translate-x-[2px] translate-y-[1px] text-alert-red/50 blur-[1px] opacity-0 transition-opacity duration-150 group-hover:opacity-60">
                Abort
              </span>
            </span>
          </Link>
        </motion.div>
      </div>

      <TrapOverlay
        open={trapOpen}
        title={trapTitle}
        message={trapMessage}
        onContinue={continueAfterTrap}
        canContinue={health > 0}
      />

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.15fr_0.85fr]">
        <div className="order-2 lg:order-1 flex flex-col">
          {hud}
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-4 flex-1 overflow-hidden rounded-xl border border-white/10 bg-surface/80 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-alert-red animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">SECURITY CHALLENGE</span>
              </div>
              <span className={clsx("text-xs font-medium", getDifficultyColor(q.difficulty))}>
                {q.difficulty.toUpperCase()}
              </span>
            </div>
            <div className="p-4 sm:p-6">
              <div className="rounded-lg border border-white/5 bg-surface-light/50 p-3 sm:p-4">
                <p className="text-sm leading-relaxed text-zinc-300">{q.scenario}</p>
              </div>
              <h2 className="mt-4 text-base font-semibold leading-snug text-zinc-50 sm:mt-5 sm:text-lg">
                {q.question}
              </h2>
              <div className="mt-4 grid gap-2 sm:mt-6 sm:gap-3">
                {q.options.map((opt, optIdx) => (
                  <OptionButton
                    key={opt.id}
                    disabled={locked}
                    index={optIdx}
                    onClick={() => { sfx.play("click"); onAnswer(opt.isTrap); }}
                  >
                    {opt.text}
                  </OptionButton>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500 sm:mt-6">
                <span className="text-warning-amber">⚠</span>
                Tip: Urgency is a manipulation tactic. Stay calm. Verify.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-4">
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden rounded-xl border border-white/10 bg-surface/60 shadow-[0_0_30px_rgba(0,255,136,0.08)]"
            >
              <div className="h-48 sm:h-64 lg:h-80 xl:h-96">
                <Scene difficulty={difficulty ?? "ScriptKiddie"} />
              </div>
              <div className="flex items-center justify-between border-t border-white/5 bg-white/5 px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyber-green animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">{difficulty ?? "RECON"}</span>
                </div>
                <span className="text-xs text-zinc-500 hidden sm:inline">
                  Objective: <span className="text-zinc-300">Identify the threat</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
