"use client";

import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    __splineSceneBlobs?: Record<string, string>;
  }
}

// All local Spline scenes served from /public/models/
const LOCAL_SPLINE_SCENES = [
  "/models/genkub_greeting_robot.spline",
  "/models/lock.spline",
  "/models/server.spline",
  "/models/nexbot_robot_character_concept.spline",
  "/models/batman_beyond.spline",
];

async function cacheSplineScene(url: string): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false;

    // Already cached in memory this session
    if (window.__splineSceneBlobs?.[url]) return true;

    const response = await fetch(url);
    if (!response.ok) return false;

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.__splineSceneBlobs = window.__splineSceneBlobs ?? {};
    window.__splineSceneBlobs[url] = blobUrl;
    return true;
  } catch {
    return false;
  }
}

export function useSplinePreloader() {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const urls = LOCAL_SPLINE_SCENES;
    setTotalCount(urls.length);
    setStatus("loading");

    let loaded = 0;

    Promise.all(
      urls.map(async (url) => {
        const success = await cacheSplineScene(url);
        loaded++;
        setLoadedCount(loaded);
        setProgress(Math.round((loaded / urls.length) * 100));
        return success;
      }),
    ).then(() => {
      setStatus("ready");
    }).catch(() => {
      setStatus("error");
    });
  }, []);

  return { status, progress, loadedCount, totalCount };
}

// Silent background preloader — use on landing page
export function useSilentSplinePreloader() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    LOCAL_SPLINE_SCENES.forEach((url) => {
      cacheSplineScene(url).catch(() => {});
    });
  }, []);
}

export async function areScenesCached(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  return LOCAL_SPLINE_SCENES.every((url) => Boolean(window.__splineSceneBlobs?.[url]));
}
