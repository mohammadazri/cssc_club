"use client";

import { useState } from "react";
import { Instagram, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import clsx from "clsx";
import {
  generateAchievementCard,
  type AchievementShareData,
} from "@/lib/generateAchievementCard";

type ShareState = "idle" | "generating" | "downloaded" | "error";

export function ShareAchievementButton({ data }: { data: AchievementShareData }) {
  const [state, setState] = useState<ShareState>("idle");

  async function handleShare() {
    if (state === "generating") return;
    setState("generating");

    try {
      const blob = await generateAchievementCard(data);
      const file = new File([blob], "zero-day-achievement.png", { type: "image/png" });

      // Mobile: Web Share API → native share sheet → user picks Instagram
      const canShare =
        typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });

      if (canShare) {
        try {
          await navigator.share({
            title: `Zero Day Recruit — ${data.rank}`,
            text: `I scored ${data.score.toLocaleString()} pts as @${data.username} on Zero Day Recruit! #ZeroDayRecruit #CSSC #UniKL`,
            files: [file],
          });
          setState("idle");
          return;
        } catch (err) {
          if ((err as Error).name === "AbortError") {
            // User cancelled the share sheet — not an error
            setState("idle");
            return;
          }
          // Other error → fall through to download
        }
      }

      // Desktop fallback: trigger download
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "zero-day-achievement.png";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      setState("downloaded");
      setTimeout(() => setState("idle"), 5000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={handleShare}
        disabled={state === "generating"}
        className={clsx(
          "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold transition-all",
          state === "idle" &&
            "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white hover:opacity-90 hover:shadow-[0_0_28px_rgba(219,39,119,0.40)] active:scale-[0.98]",
          state === "generating" &&
            "cursor-not-allowed border border-white/10 bg-white/5 text-zinc-500",
          state === "downloaded" &&
            "border border-cyber-green/30 bg-cyber-green/10 text-cyber-green",
          state === "error" &&
            "border border-alert-red/30 bg-alert-red/10 text-alert-red",
        )}
      >
        {state === "idle" && (
          <>
            <Instagram className="h-4 w-4" />
            Share Achievement
          </>
        )}
        {state === "generating" && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating card…
          </>
        )}
        {state === "downloaded" && (
          <>
            <CheckCircle className="h-4 w-4" />
            Saved! Open Instagram and post it
          </>
        )}
        {state === "error" && (
          <>
            <AlertCircle className="h-4 w-4" />
            Failed — tap to retry
          </>
        )}
      </button>

      {state === "downloaded" && (
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          Image saved to your downloads folder
        </p>
      )}
    </div>
  );
}
