"use client";

import { SplineScene } from "@/components/3d/SplineScene";

export function VaultScene({ className }: { className?: string }) {
  return (
    <SplineScene
      label="Digital Vault"
      sceneUrl={process.env.NEXT_PUBLIC_SPLINE_VAULT_SCENE}
      className={className}
    />
  );
}
