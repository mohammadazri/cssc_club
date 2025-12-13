"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import type { Question, RunSummary, SceneId } from "@/types/quiz";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useGamePersistence } from "@/hooks/useGameState";
import { OptionButton } from "@/components/ui/OptionButton";
import { TrapOverlay } from "@/components/3d/TrapOverlay";
import { VaultScene } from "@/components/3d/VaultScene";
import { PhishingScene } from "@/components/3d/PhishingScene";
import { MainframeScene } from "@/components/3d/MainframeScene";

function pointsForDifficulty(difficulty: Question["difficulty"]) {
  switch (difficulty) {
    case "ScriptKiddie":
      return 100;
    case "Hacker":
      return 175;
    case "Elite":
      return 250;
  }
}

function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId === "vault") return <VaultScene className="h-full" />;
  if (sceneId === "phishing") return <PhishingScene className="h-full" />;
  return <MainframeScene className="h-full" />;
}

export function QuizEngine({ questions }: { questions: Question[] }) {
  const router = useRouter();
  const { saveRun } = useGamePersistence();

  const [startedAtIso] = useState(() => new Date().toISOString());
  const [runId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now()),
  );

  const [idx, setIdx] = useState(0);
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [trapOpen, setTrapOpen] = useState(false);
  const [trapTitle, setTrapTitle] = useState("Trap Triggered");
  const [trapMessage, setTrapMessage] = useState("");

  const [audioEnabled, setAudioEnabled] = useState(false);
  const sfx = useSoundEffects(audioEnabled);

  const q = questions[idx];
  const total = questions.length;
  const progress = Math.round(((idx + 1) / total) * 100);

  const hud = useMemo(() => {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Level {idx + 1}/{total}
          </p>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-cyber-green"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-zinc-300">
            Health: <span className="font-semibold text-zinc-100">{health}</span>
          </p>
          <p className="text-xs text-zinc-300">
            Score: <span className="font-semibold text-zinc-100">{score}</span>
          </p>
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              className="h-4 w-4 accent-cyber-green"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
            />
            Audio
          </label>
        </div>
      </div>
    );
  }, [audioEnabled, health, idx, progress, score, total]);

  function finish(outcome: RunSummary["outcome"], nextHealth: number, nextScore: number, nextCorrect: number) {
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
    };
    saveRun(summary);
    router.push("/debrief");
  }

  async function onAnswer(isTrap: boolean) {
    if (locked) return;
    setLocked(true);

    if (isTrap) {
      sfx.play("fail");
      const nextHealth = Math.max(0, health - 1);
      setHealth(nextHealth);
      setTrapTitle("Wrong move");
      setTrapMessage(q.explanation);
      setTrapOpen(true);

      if (nextHealth <= 0) {
        window.setTimeout(() => {
          finish("failed", nextHealth, score, correctCount);
        }, 450);
      }
      return;
    }

    sfx.play("success");
    const earned = pointsForDifficulty(q.difficulty);
    const nextScore = score + earned;
    const nextCorrect = correctCount + 1;
    setScore(nextScore);
    setCorrectCount(nextCorrect);

    const isLast = idx >= total - 1;
    if (isLast) {
      window.setTimeout(() => {
        finish("success", health, nextScore, nextCorrect);
      }, 450);
      return;
    }

    window.setTimeout(() => {
      setIdx((v) => v + 1);
      setLocked(false);
    }, 420);
  }

  function continueAfterTrap() {
    setTrapOpen(false);
    setLocked(false);
    const isLast = idx >= total - 1;
    if (!isLast && health > 0) {
      setIdx((v) => v + 1);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <TrapOverlay
        open={trapOpen}
        title={trapTitle}
        message={trapMessage}
        onContinue={continueAfterTrap}
        canContinue={health > 0}
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="order-2 lg:order-1">
          {hud}

          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="mt-6 rounded-2xl border border-white/10 bg-void-black/60 p-6"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Security Challenge · {q.difficulty}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-200">{q.scenario}</p>
            <h2 className="mt-4 text-lg font-semibold text-zinc-50">
              {q.question}
            </h2>

            <div className="mt-5 grid gap-3">
              {q.options.map((opt) => (
                <OptionButton
                  key={opt.id}
                  disabled={locked}
                  onClick={() => {
                    sfx.play("click");
                    onAnswer(opt.isTrap);
                  }}
                >
                  {opt.text}
                </OptionButton>
              ))}
            </div>

            <p className="mt-5 text-xs text-zinc-500">
              Tip: If something feels urgent, that’s often the point.
            </p>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="sticky top-6 h-[380px] lg:h-[540px]">
            <Scene sceneId={q.sceneId} />
            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-zinc-400">
                Scene: <span className="text-zinc-100">{q.sceneId}</span>
                {" · "}
                Objective: <span className="text-zinc-100">Stay calm. Verify.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
