"use client";

import { SplineScene } from "./SplineScene";

type Level = "easy" | "medium" | "hard";
type FallbackVariant = "vault" | "phishing" | "mainframe";

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
  const urlMap: Record<Level, string | undefined> = {
    easy: process.env.NEXT_PUBLIC_SPLINE_EASY_BG_SCENE,
    medium: process.env.NEXT_PUBLIC_SPLINE_MEDIUM_BG_SCENE,
    hard: process.env.NEXT_PUBLIC_SPLINE_HARD_BG_SCENE,
  };

  const sceneUrl = level ? urlMap[level] : undefined;
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
