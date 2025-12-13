"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { TerminalText } from "@/components/ui/TerminalText"; // Ensure this path is correct

// --- DATA CONSTANTS ---
const SYSTEM_LOGS = [
  "Connection established...",
  "Encryption: AES-256 [SECURE]",
  "Fetching candidate profile...",
  "STATUS: WAITING_FOR_INPUT",
];

const BRIEFING_ITEMS = [
  { 
    title: "Threat Identification", 
    desc: "9 interactive scenarios. Spot the phishing, malware, and social engineering attempts.", 
    icon: "👁️" 
  },
  { 
    title: "Zero-Trust Protocol", 
    desc: "You have 3 Lives. One wrong click triggers the lockdown mechanism.", 
    icon: "🛡️" 
  },
  { 
    title: "Time Critical", 
    desc: "45 seconds per node. Hackers don't wait for you to think.", 
    icon: "⏱️" 
  },
  { 
    title: "Psychological Warfare", 
    desc: "The test isn't just technical. It tests your ability to remain calm under pressure.", 
    icon: "🧠" 
  },
];

export function LandingClient() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [briefingModal, setBriefingModal] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  // --- AUDIO & TIME LOGIC (UNCHANGED) ---
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      // Malaysia Time is UTC+8
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const malaysia = new Date(utc + 8 * 60 * 60000);
      const timeString = malaysia.toLocaleTimeString('en-GB', { hour12: false });
      setCurrentTime(timeString + " MYT");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cssc_audio_on");
    if (saved === "1") setIsAudioOn(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: ["/audio/backgroun_music.mp3"], // Ensure path is correct
        loop: true,
        volume: 0.22,
        preload: true,
        html5: true,
        mute: true,
      });
      try { soundRef.current.play(); } catch (e) {}
    }
    const howl = soundRef.current;
    if (isAudioOn) {
      if (!howl.playing()) howl.play();
      howl.mute(false);
      howl.fade(0, 0.22, 1000);
      localStorage.setItem("cssc_audio_on", "1");
    } else {
      howl.fade(0.22, 0, 500);
      setTimeout(() => howl.mute(true), 500);
      localStorage.setItem("cssc_audio_on", "0");
    }
    return () => { soundRef.current?.unload(); };
  }, [isAudioOn, mounted]);


  // --- RENDER ---
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-zinc-100 font-sans selection:bg-cyber-green/30">
      
      {/* 1. BACKGROUND LAYERS */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      
      {/* Floating Particles: More green rising dots for advanced effect */}
      <div className="fixed inset-0 pointer-events-none">
        {mounted && Array.from({ length: 32 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyber-green"
            style={{
              height: `${Math.random() * 0.7 + 0.5}rem`,
              width: `${Math.random() * 0.7 + 0.5}rem`,
              left: `${Math.random() * 100}%`,
              opacity: 0.7 + Math.random() * 0.3,
              filter: 'blur(0.5px)'
            }}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 0.7, 0] }}
            transition={{ duration: 8 + Math.random() * 12, repeat: Infinity, delay: Math.random() * 6, ease: 'linear' }}
          />
        ))}
      </div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between p-4 sm:p-8 lg:p-12 w-full max-w-none mx-auto">
        
        {/* TOP BAR: HEADER */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-start justify-between border-b border-white/15 pb-6"
        >
          <div className="flex items-center gap-5">
            {/* Logo Container */}
            <div className="flex -space-x-3">
               <div className="h-16 w-16 rounded-lg bg-white/10 p-2 backdrop-blur-sm border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                 <Image src="/ICON/unikl-logo-png-new.png" alt="UniKL" width={64} height={64} className="h-full w-full object-contain" />
               </div>
               <div className="h-16 w-16 rounded-lg bg-zinc-900/90 p-2 backdrop-blur-sm border border-white/15 z-10 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                 <Image src="/ICON/CLUB.png" alt="CSSC" width={64} height={64} className="h-full w-full object-contain" />
               </div>
            </div>
            <div className="block leading-tight">
              <p className="text-[11px] sm:text-xs font-mono text-cyber-green uppercase">UniKL MIIT</p>
              <h2 className="text-base sm:text-lg font-bold tracking-wide text-white uppercase">CSSC</h2>
              <p className="hidden sm:block text-[10px] sm:text-[11px] text-zinc-200 font-mono tracking-[0.22em] uppercase">Secure Recruitment Node</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Audio Toggle */}
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={clsx(
                "group flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono transition-all",
                isAudioOn ? "border-cyber-green/60 bg-cyber-green/15 text-cyber-green" : "border-white/20 hover:border-white/40 text-zinc-200"
              )}
            >
              <div className={clsx("h-1.5 w-1.5 rounded-full", isAudioOn ? "bg-cyber-green animate-pulse" : "bg-zinc-500")} />
              {isAudioOn ? "AUDIO ONLINE" : "AUDIO MUTED"}
            </button>
            <div className="hidden sm:flex font-mono text-xs text-zinc-200">
              {currentTime}
            </div>
          </div>
        </motion.header>

        {/* CENTER: SPLIT CONTENT */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center my-auto">
          
          {/* LEFT: Typography & CTA */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 rounded bg-white/10 border border-white/20 px-3 py-1 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Clearance Level: Public</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[0.9] relative">
                <span className="block text-white text-2xl sm:text-3xl font-mono tracking-normal mb-2 font-normal">
                  <span className="animate-pulse text-cyber-green">&#9654;</span> Tue. 16/12/2025
                </span>
                 WE NEED <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-emerald-600">
                  MINDSETS
                </span>
              </h1>
              
              <p className="text-lg text-zinc-100 max-w-md leading-relaxed">
                <TerminalText 
                  text="Not just coders. We need thinkers. Strategists. Defenders. Prove you have the instinct to protect the digital frontier."
                  speedMs={15}
                />
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/mission" className="group relative overflow-hidden rounded bg-cyber-green px-8 py-4 text-black font-bold text-lg tracking-wide hover:bg-emerald-400 transition-all w-full sm:w-auto text-center">
                <span className="relative z-10 flex items-center gap-2">
                  INITIALIZE TEST <span className="text-xs font-mono group-hover:translate-x-1 transition-transform">→</span>
                </span>
                {/* Button Glitch Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white/20 skew-x-12 transition-transform duration-500" />
              </Link>
              
              <button 
                onClick={() => setBriefingModal(true)}
                className="px-8 py-4 rounded border border-white/20 text-white font-medium hover:bg-white/5 hover:border-white/40 transition-all uppercase tracking-widest text-xs w-full sm:w-auto"
              >
                Mission Data
              </button>
            </motion.div>
          </div>

          {/* RIGHT: Status Monitor (The "Professional" Detail) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block relative"
          >
            {/* The "Card" is now a Data Terminal */}
            <div className="relative rounded-lg border border-white/15 bg-zinc-900/80 backdrop-blur-md p-4 sm:p-6 w-full max-w-md ml-auto shadow-[0_20px_50px_rgba(0,0,0,0.55)] min-w-0">
              <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-cyber-green" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-cyber-green" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l border-b border-cyber-green" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-cyber-green" />

              <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-2 gap-1 sm:gap-0">
                <span className="text-xs font-mono text-white">SYS.MONITOR_V2.1</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>

              {/* Console Logs */}
              <div className="space-y-2 font-mono text-xs text-emerald-100 mb-6 h-24 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent z-10" />
                {SYSTEM_LOGS.map((log, i) => (
                  <p key={i} className="opacity-70 whitespace-nowrap overflow-x-auto">{"> "}{log}</p>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-white/10 p-2 sm:p-3 border border-white/15">
                  <div className="text-[10px] uppercase text-zinc-200">Latency</div>
                  <div className="text-xl font-mono text-white">12<span className="text-xs text-zinc-300">ms</span></div>
                </div>
                <div className="rounded bg-white/10 p-2 sm:p-3 border border-white/15">
                   <div className="text-[10px] uppercase text-zinc-200">Threat Level</div>
                   <div className="text-xl font-mono text-orange-300">MED</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM: Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-100 font-mono"
        >
          <div>
            SECURE CONNECTION // UNIKL MIIT
          </div>
          <div className="mt-2 sm:mt-0">
             Build v.2025.1-alpha
          </div>
        </motion.footer>

      </div>

      {/* 3. BRIEFING MODAL (Redesigned) */}
      <AnimatePresence>
        {briefingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
            onClick={() => setBriefingModal(false)}
            style={{ overscrollBehavior: 'contain' }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col max-h-[90vh]"
              style={{ overflow: 'hidden' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-cyber-green/10 text-cyber-green">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Mission Briefing</h3>
                    <p className="text-xs text-zinc-500">Read carefully before initialization</p>
                  </div>
                </div>
                <button onClick={() => setBriefingModal(false)} className="text-zinc-500 hover:text-white transition">
                  [CLOSE]
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 overflow-y-auto flex-1 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                {BRIEFING_ITEMS.map((item, i) => (
                  <div key={i} className="group rounded border border-white/5 bg-white/[0.02] p-3 sm:p-4 transition-colors hover:border-cyber-green/30 hover:bg-cyber-green/[0.05]">
                    <div className="mb-2 text-2xl">{item.icon}</div>
                    <h4 className="mb-1 font-bold text-zinc-200">{item.title}</h4>
                    <p className="text-xs leading-relaxed text-zinc-400">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="bg-zinc-900/50 px-6 py-4 text-center">
                <button 
                   onClick={() => setBriefingModal(false)}
                   className="w-full rounded bg-white/10 py-3 text-sm font-bold text-white transition hover:bg-white/20 uppercase tracking-widest"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}