"use client";

import Spline from "@splinetool/react-spline";
import { clsx } from "clsx";
import { useMemo, useState } from "react";

function placeholderLabel(sceneName: string) {
  return `${sceneName} scene not configured`;
}

export function SplineScene({
  sceneUrl,
  label,
  className,
}: {
  sceneUrl?: string;
  label: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const enabled = Boolean(sceneUrl) && !failed;

  const fallback = useMemo(() => {
    return (
      <div
        className={clsx(
          "relative grid h-full w-full place-items-center overflow-hidden rounded-2xl",
          "border border-white/10 bg-void-black/60",
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(34,197,94,0.18),transparent_55%)]" />
        <div className="relative z-10 px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            {label}
          </p>
          <p className="mt-2 text-sm text-zinc-200">
            {placeholderLabel(label)}
          </p>
          <p className="mt-3 text-xs text-zinc-500">
            Set <span className="font-mono">NEXT_PUBLIC_SPLINE_*</span> in
            <span className="font-mono"> .env.local</span>.
          </p>
        </div>
      </div>
    );
  }, [label]);

  if (!enabled) {
    return <div className={clsx("h-full w-full", className)}>{fallback}</div>;
  }

  return (
    <div
      className={clsx(
        "h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-void-black/60",
        className,
      )}
    >
      <Spline
        scene={sceneUrl!}
        onError={() => setFailed(true)}
        className="h-full w-full"
      />
    </div>
  );
}
