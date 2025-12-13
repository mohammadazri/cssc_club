"use client";

import Spline from "@splinetool/react-spline";
import { clsx } from "clsx";
import { useMemo, useState } from "react";

function placeholderLabel(sceneName: string) {
  return `${sceneName} scene not configured`;
}

type FallbackVariant = "vault" | "phishing" | "mainframe";

function SceneFallbackVisual({ variant }: { variant: FallbackVariant }) {
  switch (variant) {
    case "vault":
      return (
        <div className="relative mx-auto mt-5 h-36 w-36">
          <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5" />
          <div className="absolute inset-3 rounded-full border border-white/15" />
          <div className="absolute inset-5.5 rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(34,197,94,0.20),transparent_60%)]" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-green/70" />
          <div className="absolute left-1/2 top-1/2 h-12 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white/20" />
          <div className="absolute left-1/2 top-1/2 h-0.5 w-12 -translate-x-1/2 -translate-y-1/2 bg-white/20" />

          <div className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/20" />
          <div className="absolute left-1/2 bottom-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/20" />
          <div className="absolute top-1/2 left-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/20" />
          <div className="absolute top-1/2 right-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/20" />
        </div>
      );
    case "phishing":
      return (
        <div className="relative mx-auto mt-5 h-36 w-44">
          <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5" />
          <div className="absolute left-4 right-4 top-4 h-3 rounded bg-white/10" />
          <div className="absolute left-4 right-16 top-10 h-2 rounded bg-white/10" />
          <div className="absolute left-4 right-10 top-14 h-2 rounded bg-white/10" />
          <div className="absolute left-4 right-24 top-18 h-2 rounded bg-white/10" />

          <div className="absolute -right-3 bottom-8 h-10 w-10 rounded-full border border-alert-red/30 bg-alert-red/10" />
          <div className="absolute -right-1 bottom-10 h-6 w-6 rounded-full border border-alert-red/40 bg-alert-red/10" />
          <div className="absolute left-1/2 bottom-4 h-0.5 w-16 -translate-x-1/2 bg-white/20" />
          <div className="absolute left-1/2 bottom-4 h-5 w-5 -translate-x-1/2 translate-y-3 rounded-full border border-white/15 bg-white/5" />
        </div>
      );
    case "mainframe":
      return (
        <div className="relative mx-auto mt-5 grid h-36 w-48 grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, col) => (
            <div
              key={col}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              <div className="absolute inset-x-0 top-0 h-10 bg-white/5" />
              <div className="absolute left-3 top-3 h-1.5 w-8 rounded bg-white/10" />
              <div className="absolute left-3 top-6 h-1.5 w-12 rounded bg-white/10" />
              <div className="absolute left-3 top-14 h-1.5 w-10 rounded bg-white/10" />
              <div className="absolute left-3 top-18.5 h-1.5 w-12 rounded bg-white/10" />
              <div className="absolute left-3 top-23.5 h-1.5 w-9 rounded bg-white/10" />

              <div className="absolute right-3 top-4 h-1.5 w-1.5 rounded-full bg-cyber-green/60" />
              <div className="absolute right-3 top-8 h-1.5 w-1.5 rounded-full bg-white/20" />
              <div className="absolute right-3 top-12 h-1.5 w-1.5 rounded-full bg-white/20" />
              <div className="absolute right-3 top-16 h-1.5 w-1.5 rounded-full bg-alert-red/25" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.14),transparent_55%)]" />
            </div>
          ))}
        </div>
      );
  }
}

export function SplineScene({
  sceneUrl,
  label,
  fallbackVariant,
  className,
}: {
  sceneUrl?: string;
  label: string;
  fallbackVariant: FallbackVariant;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const normalizedUrl = typeof sceneUrl === "string" ? sceneUrl.trim() : "";
  const looksLikeSplineCode = normalizedUrl.endsWith("/scene.splinecode");
  const enabled = Boolean(normalizedUrl) && looksLikeSplineCode && !failed;

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
          <SceneFallbackVisual variant={fallbackVariant} />
          <p className="mt-3 text-xs text-zinc-500">
            Paste the Spline React-export URL ending in
            <span className="font-mono"> /scene.splinecode</span> into
            <span className="font-mono"> .env.local</span>.
          </p>
          {!looksLikeSplineCode && Boolean(normalizedUrl) ? (
            <p className="mt-2 text-[11px] leading-4 text-zinc-500">
              The current value looks like a share-page URL, not a
              <span className="font-mono"> .splinecode</span> resource.
            </p>
          ) : null}
        </div>
      </div>
    );
  }, [fallbackVariant, label]);

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
        scene={normalizedUrl}
        onError={() => setFailed(true)}
        className="h-full w-full"
      />
    </div>
  );
}
