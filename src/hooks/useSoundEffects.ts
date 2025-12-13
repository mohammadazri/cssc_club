"use client";

import { Howl } from "howler";
import { useMemo } from "react";

type Sfx = "success" | "fail" | "click";

function safePlay(howl: Howl | null) {
  if (!howl) return;
  try {
    howl.play();
  } catch {
    // Ignore missing/blocked audio.
  }
}

export function useSoundEffects(enabled: boolean) {
  const sounds = useMemo(() => {
    if (!enabled) {
      return {
        success: null,
        fail: null,
        click: null,
      } as const;
    }

    const base = "/audio";
    const mk = (file: string) =>
      new Howl({
        src: [`${base}/${file}`],
        volume: 0.35,
        preload: true,
        onloaderror: () => {
          // Swallow missing assets.
        },
        onplayerror: () => {
          // Swallow autoplay restrictions.
        },
      });

    return {
      success: mk("success.mp3"),
      fail: mk("fail.mp3"),
      click: mk("click.mp3"),
    } as const;
  }, [enabled]);

  return {
    play: (sfx: Sfx) => safePlay(sounds[sfx]),
  };
}
