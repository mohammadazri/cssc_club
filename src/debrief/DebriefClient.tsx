"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useGamePersistence } from "@/hooks/useGameState";
import { Shield, Target, Zap, RefreshCw, Home, ExternalLink, Lock, Unlock, Terminal } from "lucide-react";

// --- CONFIGURATION ---
// Fallback links if env vars are missing
const FALLBACK_LINKS = {
  join: "https://chat.whatsapp.com/YOUR_CODE", // Replace with actual fallback
  discord: "https://discord.gg/YOUR_CODE",
};

// --- COMPONENTS ---

function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={clsx("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 translate-x-[2px] text-red-500 opacity-70 animate-pulse">{text}</span>
      <span className="absolute top-0 left-0 -z-10 -translate-x-[2px] text-blue-500 opacity-70 animate-pulse delay-75">{text}</span>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color = "text-white" }: { label: string; value: string | number; icon: any; color?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <Icon className={clsx("w-5 h-5 mb-2 opacity-80", color)} />
      <span className="text-2xl font-bold font-mono tracking-tight">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
    </div>
  );
}

function RankBadge({ rank, score }: { rank: string; score: number }) {
  const isElite = score > 800;
  return (
    <div className={clsx(
      "relative w-full aspect-square max-w-[200px] mx-auto rounded-full flex items-center justify-center border-4",
      isElite ? "border-cyber-green/50 bg-cyber-green/5" : "border-zinc-700 bg-zinc-900/50"
    )}>
      <div className={clsx(
        "absolute inset-0 rounded-full animate-spin-slow border-t-2 border-transparent",
        isElite ? "border-t-cyber-green" : "border-t-zinc-500"
      )} />
      <div className="text-center z-10">
        <Shield className={clsx("w-12 h-12 mx-auto mb-2", isElite ? "text-cyber-green" : "text-zinc-500")} />
        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Rank Assigned</p>
        <p className={clsx("text-xl font-bold uppercase", isElite ? "text-cyber-green" : "text-white")}>{rank}</p>
      </div>
    </div>
  );
}

export function DebriefClient() {
  const { lastRun } = useGamePersistence();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const joinUrl = process.env.NEXT_PUBLIC_CLUB_JOIN_FORM_URL || FALLBACK_LINKS.join;
  const discordUrl = process.env.NEXT_PUBLIC_CLUB_DISCORD_URL || FALLBACK_LINKS.discord;
  
  // Generate QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(joinUrl)}&color=00ff88&bgcolor=05100a&margin=10`;

  const score = lastRun?.score || 0;
  const health = lastRun?.healthRemaining || 0;
  const isSuccess = (lastRun?.outcome || "failed") === "success";
  const accuracy = lastRun ? Math.round((lastRun.correctCount / lastRun.totalCount) * 100) : 0;

  const rank = useMemo(() => {
    if (score > 800) return "Cyber Sentinel";
    if (score > 500) return "Net Defender";
    return "Initiate";
  }, [score]);

  if (!hydrated) return null;

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-mono selection:bg-cyber-green/30 selection:text-black overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
        <div className={clsx(
          "absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyber-green/10 to-transparent blur-[100px] transition-colors duration-1000",
          !isSuccess && "from-alert-red/10"
        )} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col gap-8">
        
        {/* HEADER */}
        <header className="text-center space-y-4">
          <div className={clsx(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest",
            isSuccess ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green" : "border-alert-red/30 bg-alert-red/10 text-alert-red"
          )}>
            {isSuccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {isSuccess ? "Mission Complete" : "Mission Failed"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase">
            <GlitchText text={isSuccess ? "Access Granted" : "Access Denied"} />
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
            {isSuccess 
              ? "You have demonstrated exceptional capability. The system has unlocked further protocols." 
              : "Security protocols were triggered. Review your tactics and re-initialize the sequence."}
          </p>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          
          {/* LEFT COLUMN: STATS & RANK */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-7 space-y-4"
          >
            {/* Rank Card */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 backdrop-blur-md">
              <RankBadge rank={rank} score={score} />
              <div className="text-center sm:text-left space-y-2">
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Operative Status</p>
                <h2 className="text-3xl font-bold text-white">{rank}</h2>
                <p className="text-sm text-zinc-400">
                  ID: <span className="font-mono text-zinc-300">{lastRun?.runId.slice(0,8).toUpperCase()}</span>
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="Score" value={score} icon={Target} color="text-purple-400" />
              <StatBox label="Accuracy" value={`${accuracy}%`} icon={Zap} color="text-yellow-400" />
              <StatBox label="Integrity" value={`${Math.round((health/3)*100)}%`} icon={Shield} color={health > 1 ? "text-cyber-green" : "text-red-400"} />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/mission" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <RefreshCw className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                <span className="text-sm font-bold text-zinc-300 group-hover:text-white">Retry Mission</span>
              </Link>
              <Link href="/" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <Home className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                <span className="text-sm font-bold text-zinc-300 group-hover:text-white">Return Home</span>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: THE UPLINK (QR) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-5"
          >
            <div className="h-full bg-zinc-900/80 border border-cyber-green/30 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group">
              {/* Scanning Line Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-cyber-green/50 shadow-[0_0_20px_#00ff88] animate-[scan_3s_linear_infinite] opacity-50 pointer-events-none" />
              
              <div className="mb-6 space-y-1">
                <div className="flex items-center justify-center gap-2 text-cyber-green text-xs font-bold uppercase tracking-widest">
                  <Terminal className="w-4 h-4" />
                  Secure Uplink
                </div>
                <p className="text-zinc-500 text-xs">Scan to join the network</p>
              </div>

              {/* QR Code Container */}
              <div className="relative p-3 bg-white rounded-lg shadow-[0_0_40px_rgba(0,255,136,0.15)] transition-transform group-hover:scale-105 duration-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrCodeUrl} 
                  alt="Join Club QR" 
                  className="w-48 h-48 object-contain"
                />
                {/* Corner Accents */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyber-green rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyber-green rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyber-green rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyber-green rounded-br-lg" />
              </div>

              <div className="mt-8 w-full space-y-3">
                <a 
                  href={joinUrl} 
                  target="_blank" 
                  className="flex items-center justify-center gap-2 w-full py-3 bg-cyber-green text-black font-bold rounded-lg hover:bg-cyber-green/90 transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                >
                  <span>Join CSSC Club</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a 
                  href={discordUrl} 
                  target="_blank" 
                  className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold rounded-lg hover:bg-indigo-600/30 transition-all"
                >
                  <span>Discord Community</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>
          </motion.div>

        </div>

        {/* FOOTER */}
        <footer className="text-center text-[10px] text-zinc-600 uppercase tracking-widest">
          <p>System Version 2.0.4 // Secure Connection Established</p>
        </footer>

      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
}