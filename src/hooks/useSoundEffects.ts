"use client";

import { Howl } from "howler";
import { useRef, useCallback, useEffect } from "react";

type Sfx = "success" | "fail" | "click" | "ambient";

interface SoundRefs {
  success: Howl | null;
  fail: Howl | null;
  click: Howl | null;
  ambient: Howl | null;
}

function safePlay(howl: Howl | null, preventRestart = false) {
  if (!howl) return;
  try {
    // For ambient/looping sounds, prevent restart
    // For short SFX, always allow play
    if (preventRestart && howl.playing()) {
      return;
    }
    howl.play();
  } catch {
    // Ignore missing/blocked audio.
  }
}

function safeStop(howl: Howl | null) {
  if (!howl) return;
  try {
    howl.stop();
  } catch {
    // Ignore missing/blocked audio.
  }
}

export function useSoundEffects(enabled: boolean) {
  const soundsRef = useRef<SoundRefs | null>(null);
  const initializedRef = useRef(false);

  // Initialize sounds only once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const base = "/audio";
    
    const mk = (file: string) =>
      new Howl({
        src: [`${base}/${file}`],
        volume: 0.55,
        preload: true,
        onloaderror: () => {},
        onplayerror: () => {},
      });

    const mkLoop = (file: string, volume = 0.18) =>
      new Howl({
        src: [`${base}/${file}`],
        volume,
        preload: true,
        loop: true,
        onloaderror: () => {},
        onplayerror: () => {},
      });

    soundsRef.current = {
      success: mk("success.wav"),
      fail: mk("incorrect-buzzer-374194.mp3"),
      click: mk("click.mp3"),
      ambient: mkLoop("quiz_bg.mp3"),
    };

    return () => {
      // Cleanup on unmount
      if (soundsRef.current) {
        Object.values(soundsRef.current).forEach((howl) => {
          if (howl) howl.unload();
        });
        soundsRef.current = null;
      }
    };
  }, []);

  const play = useCallback((sfx: Sfx, force = false) => {
    if ((!enabled && !force) || !soundsRef.current) return;
    // Ambient uses preventRestart, short SFX don't
    const preventRestart = sfx === "ambient";
    safePlay(soundsRef.current[sfx], preventRestart);
  }, [enabled]);

  const stopAmbient = useCallback(() => {
    if (!soundsRef.current) return;
    safeStop(soundsRef.current.ambient);
  }, []);

  const stopAll = useCallback(() => {
    if (!soundsRef.current) return;
    safeStop(soundsRef.current.ambient);
  }, []);

  return { play, stopAmbient, stopAll };
}
