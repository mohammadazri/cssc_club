"use client";

import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import dynamic from "next/dynamic";

// Dynamically load Spline runtime
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

type ManagerState = {
  sceneUrl: string | null;
  visible: boolean;
  rect?: DOMRect;
};

let managerApi: {
  showSceneIn?: (sceneUrl: string, container: HTMLElement | null) => void;
  hide?: () => void;
} = {};

function GlobalSplineHost() {
  const [state, setState] = useState<ManagerState>({ sceneUrl: null, visible: false });
  const hostRef = useRef<HTMLDivElement | null>(null);
  const lastScene = useRef<string | null>(null);

  // Expose functions
  useEffect(() => {
    managerApi.showSceneIn = (sceneUrl: string, container: HTMLElement | null) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setState({ sceneUrl, visible: true, rect });
      lastScene.current = sceneUrl;
    };
    managerApi.hide = () => setState({ sceneUrl: null, visible: false });
    return () => {
      managerApi.showSceneIn = undefined;
      managerApi.hide = undefined;
    };
  }, []);

  // Keep host positioned to match requested container
  const style: React.CSSProperties = state.rect
    ? {
        position: "fixed",
        left: Math.max(0, state.rect.left) + "px",
        top: Math.max(0, state.rect.top) + "px",
        width: state.rect.width + "px",
        height: state.rect.height + "px",
        pointerEvents: "auto",
        zIndex: 9998,
      }
    : { display: "none" };

  return (
    <div ref={hostRef} style={style} className="spline-global-host">
      {state.visible && state.sceneUrl ? (
        <div className="h-full w-full">
          {/* Render Spline into this single host and update its scene prop to swap scenes */}
          {/* @ts-ignore dynamic component */}
          <Spline scene={state.sceneUrl} className="h-full w-full" />
        </div>
      ) : null}
    </div>
  );
}

export function initGlobalSplineHost() {
  if (typeof window === "undefined") return;
  if ((window as any).__globalSplineHostMounted) return;
  const container = document.createElement("div");
  container.id = "__global_spline_host";
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(React.createElement(GlobalSplineHost));
  (window as any).__globalSplineHostMounted = true;
}

export function showSceneIn(sceneUrl: string, container: HTMLElement | null) {
  if (typeof window === "undefined") return;
  initGlobalSplineHost();
  // give the host a tick to mount
  setTimeout(() => {
    if (managerApi.showSceneIn) managerApi.showSceneIn(sceneUrl, container);
  }, 0);
}

export function hideGlobalSpline() {
  if (managerApi.hide) managerApi.hide();
}
