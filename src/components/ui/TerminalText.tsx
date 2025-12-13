"use client";

import { useEffect, useMemo, useState } from "react";

import { clsx } from "clsx";

export function TerminalText({
  text,
  speedMs = 14,
  className,
  startDelayMs = 0,
  cursor = true,
}: {
  text: string;
  speedMs?: number;
  startDelayMs?: number;
  cursor?: boolean;
  className?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  const chars = useMemo(() => [...text], [text]);

  useEffect(() => {
    let intervalId: number | null = null;
    const startTimerId = window.setTimeout(() => {
      setVisibleCount(0);
      intervalId = window.setInterval(() => {
        setVisibleCount((c) => {
          if (c >= chars.length) {
            if (intervalId !== null) window.clearInterval(intervalId);
            intervalId = null;
            return c;
          }
          return c + 1;
        });
      }, speedMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startTimerId);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [chars.length, speedMs, startDelayMs]);

  const done = visibleCount >= chars.length;

  return (
    <span className={clsx("whitespace-pre-wrap", className)}>
      {chars.slice(0, visibleCount).join("")}
      {cursor ? (
        <span
          aria-hidden="true"
          className={clsx(
            "ml-0.5 inline-block w-2 align-baseline",
            done ? "opacity-0" : "animate-caret",
          )}
        >
          ▋
        </span>
      ) : null}
    </span>
  );
}
