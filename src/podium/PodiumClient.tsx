"use client";

import { useLiveDashboard } from "@/hooks/useLiveDashboard";
import { SplineScene } from "@/components/3d/SplineScene";
import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";

export function PodiumClient() {
  const { entries, loading } = useLiveDashboard(3);

  const top3 = entries.slice(0, 3);
  
  // order for podium: 2, 1, 3 (Silver left, Gold center, Bronze right)
  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-mono">
      {/* ── Spline Background ── */}
      <div className="absolute inset-0">
        <SplineScene
          sceneUrl="/models/nexbot_robot_character_concept.spline"
          label="Podium Background"
          fallbackVariant="vault"
          className="h-full w-full"
        />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 md:p-10 pointer-events-none">
         <Link href="/dashboard" className="pointer-events-auto text-zinc-500 hover:text-cyber-green transition-colors uppercase tracking-[0.2em] text-xs font-bold flex items-center gap-2 border border-white/10 bg-black/40 px-4 py-2 rounded backdrop-blur-md">
            <span>←</span> RETURN TO OPS
         </Link>
         <div className="text-center sm:text-right">
           <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
             HALL OF FAME
           </h1>
           <p className="text-cyber-green text-[10px] sm:text-xs tracking-[0.3em] uppercase mt-1 animate-pulse">Live Ranking Feed Active</p>
         </div>
      </header>

      {/* Podium Layout */}
      <div className="relative z-10 flex min-h-screen items-end justify-center pb-20 md:pb-32 px-4 pointer-events-none">
        {loading ? (
          <div className="flex flex-col items-center gap-4 mb-32">
             <div className="flex gap-3">
               {[0, 1, 2].map(i => (
                 <motion.div key={i} className="h-2 w-2 bg-cyber-green rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
               ))}
             </div>
             <p className="text-cyber-green uppercase tracking-[0.2em] text-xs">Acquiring Target Data...</p>
          </div>
        ) : (
          <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-8 lg:gap-16 w-full max-w-5xl pointer-events-auto">
            {podiumOrder.map((entry) => {
              // Map index in podiumOrder back to actual rank
              const actualRank = top3.indexOf(entry) + 1;
              const height = actualRank === 1 ? "h-[250px] md:h-[400px]" : actualRank === 2 ? "h-[180px] md:h-[280px]" : "h-[120px] md:h-[200px]";
              const color = actualRank === 1 ? "text-yellow-400 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.2)]" : actualRank === 2 ? "text-zinc-300 border-zinc-400 shadow-[0_0_30px_rgba(212,212,216,0.15)]" : "text-orange-400 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.15)]";
              const glow = actualRank === 1 ? "bg-yellow-400/10" : actualRank === 2 ? "bg-zinc-400/10" : "bg-orange-500/10";
              const delay = actualRank === 1 ? 0.6 : actualRank === 2 ? 0.3 : 0;

              return (
                <motion.div 
                  key={entry.runId}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
                  className="flex flex-col items-center flex-1 max-w-[280px]"
                >
                  {/* Floating Hologram Card */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: delay + 0.4 }}
                    className={clsx("w-full rounded-xl border bg-black/40 backdrop-blur-md p-3 md:p-4 mb-4 md:mb-6 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-default", color)}
                  >
                    <div className={clsx("absolute inset-0 top-0 h-1", actualRank === 1 ? "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,1)]" : actualRank === 2 ? "bg-zinc-300" : "bg-orange-500")} />
                    <div className="text-center space-y-1 md:space-y-2 relative z-10">
                      <p className={clsx("text-3xl md:text-5xl font-black italic", actualRank === 1 ? "drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" : "")}>{actualRank}</p>
                      <p className="text-sm md:text-xl font-bold truncate text-white">@{entry.username}</p>
                      <p className={clsx("text-[10px] sm:text-sm md:text-base font-black tabular-nums tracking-widest", color)}>{entry.score.toLocaleString()} PTS</p>
                      <div className="pt-2 border-t border-white/10 flex justify-between text-[8px] md:text-xs text-zinc-400">
                        <span>{entry.difficulty.substring(0, 4).toUpperCase()}</span>
                        <span>{Math.round((entry.correctCount / entry.totalCount) * 100)}% ACC</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Physical Pedestal */}
                  <div className={clsx("w-full border-t border-l border-r rounded-t-lg relative flex justify-center", height, color, glow)}>
                     {/* Light beam */}
                     <div className={clsx("absolute bottom-full w-3/4 h-[300px] md:h-[400px] bg-gradient-to-t to-transparent pointer-events-none opacity-30", actualRank === 1 ? "from-yellow-400" : actualRank === 2 ? "from-zinc-400" : "from-orange-500")} />
                     <div className="mt-4 md:mt-8 opacity-50">
                       <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase">RANK 0{actualRank}</span>
                     </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
