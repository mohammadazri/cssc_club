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
  whatsapp: "https://chat.whatsapp.com/Iq8fIHUHYph32JjXxTOsBY",
  instagram: "https://www.instagram.com/cssc_miit?igsh=aDRyNmdkcmRmcjdh",
  linkedin: "https://www.linkedin.com/company/uniklmiitcssc/",
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
  // determine visual tier from rank name
  const tier = rank.includes("Cyber")
    ? "elite"
    : rank.includes("Net") || rank.includes("Security")
      ? "high"
      : rank.includes("Script") || rank.includes("Incident")
        ? "mid"
        : rank === "Operative"
          ? "operational"
          : "initiate";

  const rootClass = clsx(
    "relative w-full aspect-square max-w-[200px] mx-auto rounded-full flex items-center justify-center border-4",
    tier === "elite" && "rank-elite",
    tier === "high" && "rank-high",
    tier === "mid" && "rank-mid",
    tier === "operational" && "rank-op",
    tier === "initiate" && "rank-init"
  );

  const iconClass = clsx("w-12 h-12 mx-auto mb-2", tier === "elite" ? "text-cyber-green" : tier === "high" ? "text-amber-300" : tier === "mid" ? "text-sky-400" : "text-zinc-400");

  return (
    <div className={rootClass} aria-label={`Rank ${rank}`}>
      <div className={clsx("absolute inset-0 rounded-full animate-spin-slow border-t-2 border-transparent", tier === "elite" ? "border-t-cyber-green" : tier === "high" ? "border-t-amber-300" : "border-t-zinc-500")} />
      <div className="text-center z-10">
        <Shield className={iconClass} />
        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Rank Assigned</p>
        <p className={clsx("text-xl font-bold uppercase", tier === "elite" ? "text-cyber-green" : tier === "high" ? "text-amber-300" : tier === "mid" ? "text-sky-400" : "text-white")}>
          {rank}
        </p>
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

  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || process.env.NEXT_PUBLIC_CLUB_JOIN_FORM_URL || FALLBACK_LINKS.whatsapp;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || FALLBACK_LINKS.instagram;
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || FALLBACK_LINKS.linkedin;

  // QR target state and URL
  const [qrTarget, setQrTarget] = useState<"whatsapp" | "instagram" | "linkedin">("whatsapp");
  const qrTargetUrl = qrTarget === "whatsapp" ? whatsappUrl : qrTarget === "instagram" ? instagramUrl : linkedinUrl;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrTargetUrl)}&color=00ff88&bgcolor=05100a&margin=10`;

  const score = lastRun?.score || 0;
  const health = lastRun?.healthRemaining || 0;
  const isSuccess = (lastRun?.outcome || "failed") === "success";
  const accuracy = lastRun ? Math.round((lastRun.correctCount / lastRun.totalCount) * 100) : 0;

  // Average points earned per question (helps infer difficulty mix)
  const avgPoints = lastRun && lastRun.totalCount > 0 ? score / lastRun.totalCount : 0;

  const { rank, subtitle } = useMemo(() => {
    // rank logic that accounts for accuracy and avgPoints so short easy runs can still earn high rank
    if (!lastRun) return { rank: "Initiate", subtitle: "No data" };

    if (accuracy === 100) {
      if (avgPoints >= 230) return { rank: "Cyber Sentinel", subtitle: "Flawless & high-difficulty performance" };
      if (avgPoints >= 150) return { rank: "Net Defender", subtitle: "Perfect accuracy on challenging tasks" };
      return { rank: "Script Prodigy", subtitle: "Perfect accuracy — solid fundamentals" };
    }

    if (accuracy >= 85) {
      if (avgPoints >= 200) return { rank: "Security Specialist", subtitle: "Strong accuracy on tough scenarios" };
      if (avgPoints >= 140) return { rank: "Incident Responder", subtitle: "High accuracy and solid skill" };
      return { rank: "Tactical Analyst", subtitle: "Good accuracy — keep sharpening skills" };
    }

    if (accuracy >= 60) {
      return { rank: "Operative", subtitle: "Adequate performance — room to improve" };
    }

    return { rank: "Initiate", subtitle: "Learn the basics and try again" };
  }, [lastRun, accuracy, avgPoints, score]);

  const isEliteVisual = rank === "Cyber Sentinel" || rank === "Security Specialist" || rank === "Net Defender";

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

      <div className="relative z-10 w-full px-4 py-8 sm:py-12 flex flex-col gap-8">
        
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
                  {isEliteVisual && (
                    <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
                      <div className="confetti" aria-hidden>
                        {Array.from({ length: 18 }).map((_, i) => (
                          <span key={i} style={{ ["--i" as any]: i / 18, left: `${10 + (80 * (i / 18))}%` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Operative Status</p>
                  <h2 className="text-3xl font-bold text-white">{rank}</h2>
                  <p className="text-sm text-zinc-400">{subtitle}</p>
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

              {/* QR Target Switcher */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setQrTarget("whatsapp")}
                  className={clsx(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    qrTarget === "whatsapp" ? "bg-cyber-green text-black" : "bg-white/5 text-zinc-300"
                  )}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setQrTarget("instagram")}
                  className={clsx(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    qrTarget === "instagram" ? "bg-pink-500 text-white" : "bg-white/5 text-zinc-300"
                  )}
                >
                  Instagram
                </button>
                <button
                  type="button"
                  onClick={() => setQrTarget("linkedin")}
                  className={clsx(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    qrTarget === "linkedin" ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-300"
                  )}
                >
                  LinkedIn
                </button>
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
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-cyber-green text-black font-bold rounded-lg hover:bg-cyber-green/90 transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                >
                  <span>Join CSSC Club</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-pink-600/10 text-pink-400 border border-pink-500/20 font-bold rounded-lg hover:bg-pink-600/20 transition-all"
                  >
                    Instagram
                  </a>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-900/10 text-blue-300 border border-blue-500/20 font-bold rounded-lg hover:bg-blue-900/20 transition-all"
                  >
                    LinkedIn
                  </a>
                </div>
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
        .confetti { position: absolute; inset: 0; pointer-events: none; overflow: visible }
        .confetti span { position: absolute; width:8px; height:14px; border-radius:2px; opacity:0.95; transform-origin:center; animation: confetti-fall 1200ms linear forwards; }
        @keyframes confetti-fall {
          0% { transform: translateY(-10%) rotate(0deg) scale(1); opacity:1 }
          100% { transform: translateY(140%) rotate(360deg) scale(0.9); opacity:0 }
        }
        .confetti span:nth-child(odd) { background: linear-gradient(180deg,#00ff88,#00cc66) }
        .confetti span:nth-child(even) { background: linear-gradient(180deg,#ffd86b,#ff9f1c) }
        .confetti span { left: calc(10% + (80% * var(--i))); top: -8%; animation-delay: calc(var(--i) * 60ms); }
        @keyframes rankPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
          50% { transform: scale(1.02); box-shadow: 0 0 28px rgba(0,255,136,0.08); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
        }
        .rank-elite {
          border-color: rgba(0,255,136,0.18);
          background: radial-gradient(ellipse at center, rgba(0,255,136,0.04), rgba(0,0,0,0));
          box-shadow: 0 8px 40px rgba(0,255,136,0.04);
          animation: rankPulse 2.8s ease-in-out infinite;
        }
        .rank-high {
          border-color: rgba(255,184,28,0.18);
          background: radial-gradient(ellipse at center, rgba(255,184,28,0.03), rgba(0,0,0,0));
          box-shadow: 0 6px 28px rgba(255,184,28,0.04);
        }
        .rank-mid {
          border-color: rgba(56,189,248,0.12);
          background: radial-gradient(ellipse at center, rgba(56,189,248,0.02), rgba(0,0,0,0));
        }
        .rank-op {
          border-color: rgba(120,120,120,0.12);
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.01), rgba(0,0,0,0));
        }
        .rank-init {
          border-color: rgba(80,80,80,0.08);
          background: none;
        }
      `}</style>
    </div>
  );
}