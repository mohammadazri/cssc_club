"use client";

import { SplineScene } from "@/components/3d/SplineScene";

export function MainframeScene({ className }: { className?: string }) {
  return (
    <SplineScene
      label="Mainframe"
      sceneUrl={process.env.NEXT_PUBLIC_SPLINE_MAINFRAME_SCENE}
      className={className}
    />
  );
}
