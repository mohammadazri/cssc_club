"use client";

import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    __splineSceneBlobs?: Record<string, string>;
  }
}

const CACHE_NAME = "spline-scenes-v1";

// Get all Spline scene URLs from environment
function getSplineUrls(): string[] {
  const urls: string[] = [];
  
  const vault = process.env.NEXT_PUBLIC_SPLINE_VAULT_SCENE;
  const phishing = process.env.NEXT_PUBLIC_SPLINE_PHISHING_SCENE;
  const mainframe = process.env.NEXT_PUBLIC_SPLINE_MAINFRAME_SCENE;
  
  if (vault?.endsWith("/scene.splinecode")) urls.push(vault);
  if (phishing?.endsWith("/scene.splinecode")) urls.push(phishing);
  if (mainframe?.endsWith("/scene.splinecode")) urls.push(mainframe);
  
  return urls;
}

async function cacheSplineScene(url: string): Promise<boolean> {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Check if already cached
    const cached = await cache.match(url);
    if (cached) {
      return true;
    }
    
    // Fetch and cache
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) {
      await cache.put(url, response.clone());
      // Also create an in-memory blob URL for faster local access during this session
      try {
        if (typeof window !== "undefined") {
          const blob = await response.clone().blob();
          const blobUrl = URL.createObjectURL(blob);
          window.__splineSceneBlobs = window.__splineSceneBlobs || {};
          window.__splineSceneBlobs[url] = blobUrl;
        }
      } catch {}
      return true;
    }
    return false;
  } catch {
    // Cache API might not be available or CORS issue
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
    // Prevent double-run in strict mode
    if (startedRef.current) return;
    startedRef.current = true;

    const urls = getSplineUrls();
    
    if (urls.length === 0) {
      // No scenes to preload, mark as ready
      setStatus("ready");
      setProgress(100);
      return;
    }

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
      })
    ).then(() => {
      // Even if some fail, we proceed (fallback will show)
      setStatus("ready");
    }).catch(() => {
      setStatus("error");
    });
  }, []);

  return { status, progress, loadedCount, totalCount };
}

// Silent background preloader - use on landing page
export function useSilentSplinePreloader() {
  const startedRef = useRef(false);
  
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    
    // Run in background without blocking UI
    const urls = getSplineUrls();
    if (urls.length === 0) return;
    
    // Preload all scenes silently in background
    urls.forEach((url) => {
      cacheSplineScene(url).catch(() => {
        // Silently ignore errors
      });
    });
  }, []);
}

// Check if scenes are already cached (for instant load check)
export async function areScenesCached(): Promise<boolean> {
  try {
    const urls = getSplineUrls();
    if (urls.length === 0) return true;
    
    const cache = await caches.open(CACHE_NAME);
    
    for (const url of urls) {
      const cached = await cache.match(url);
      if (!cached) return false;
    }
    
    return true;
  } catch {
    return false;
  }
}
