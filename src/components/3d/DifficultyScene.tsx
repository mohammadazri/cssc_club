"use client";

import { SplineScene } from "./SplineScene";

type Level = "easy" | "medium" | "hard";
type FallbackVariant = "vault" | "phishing" | "mainframe";

const SCENE_MAP: Record<Level, string> = {
  easy: "/models/genkub_greeting_robot.spline",
  medium: "/models/lock.spline",
  hard: "/models/server.spline",
};

const FALLBACK_MAP: Record<Level, FallbackVariant> = {
  easy: "vault",
  medium: "phishing",
  hard: "mainframe",
};

export function DifficultyScene({
  level,
  className,
}: {
  level: Level | null;
  className?: string;
}) {
  const sceneUrl = level ? SCENE_MAP[level] : undefined;
  const fallbackVariant: FallbackVariant = level ? FALLBACK_MAP[level] : "vault";

  return (
    <SplineScene
      sceneUrl={sceneUrl}
      label={level ? `${level} background` : "Select level"}
      fallbackVariant={fallbackVariant}
      className={className}
    />
  );
}
