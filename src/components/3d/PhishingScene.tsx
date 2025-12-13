"use client";

import { SplineScene } from "@/components/3d/SplineScene";

export function PhishingScene({ className }: { className?: string }) {
  return (
    <SplineScene
      label="Phishing Hook"
      sceneUrl={process.env.NEXT_PUBLIC_SPLINE_PHISHING_SCENE}
      className={className}
    />
  );
}
