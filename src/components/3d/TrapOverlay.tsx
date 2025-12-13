"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export function TrapOverlay({
  open,
  title,
  message,
  onContinue,
  canContinue,
}: {
  open: boolean;
  title: string;
  message: string;
  onContinue: () => void;
  canContinue: boolean;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          {/* Dramatic red backdrop with pulse */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-alert-red/20 via-alert-red/10 to-void-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 1] }}
            transition={{ duration: 0.4, times: [0, 0.2, 0.4, 1] }}
          />
          
          {/* Scanline overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,34,68,0.1) 2px, rgba(255,34,68,0.1) 4px)"
            }}
          />

          {/* Warning bars at top and bottom */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-alert-red to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-alert-red to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />

          {/* Main dialog */}
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-alert-red/40 bg-gradient-to-b from-void-black/95 to-void-black/90 shadow-[0_0_60px_rgba(255,34,68,0.3)]"
          >
            {/* Glitch header bar */}
            <div className="flex items-center gap-3 border-b border-alert-red/20 bg-alert-red/10 px-5 py-3">
              <motion.div
                className="flex gap-1"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <span className="h-2 w-2 rounded-full bg-alert-red shadow-[0_0_8px_rgba(255,34,68,0.8)]" />
                <span className="h-2 w-2 rounded-full bg-alert-red shadow-[0_0_8px_rgba(255,34,68,0.8)]" />
                <span className="h-2 w-2 rounded-full bg-alert-red shadow-[0_0_8px_rgba(255,34,68,0.8)]" />
              </motion.div>
              <span className="font-mono text-xs uppercase tracking-widest text-alert-red text-glow-red">
                ⚠ SECURITY BREACH DETECTED
              </span>
            </div>

            <div className="p-6">
              {/* Title with glitch effect */}
              <motion.h2 
                className="glitch text-2xl font-bold text-alert-red"
                data-text={title}
                initial={{ x: -10 }}
                animate={{ x: 0 }}
              >
                {title}
              </motion.h2>

              {/* Message in terminal style */}
              <div className="mt-4 rounded-lg border border-white/5 bg-black/40 p-4 font-mono">
                <p className="text-xs text-zinc-500 mb-2">
                  <span className="text-alert-red">root@system:</span>~# analysis_report
                </p>
                <p className="text-sm leading-relaxed text-zinc-300">{message}</p>
              </div>

              {/* Status indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                <span className={clsx(
                  "h-1.5 w-1.5 rounded-full",
                  canContinue ? "bg-warning-amber animate-pulse" : "bg-alert-red"
                )} />
                {canContinue ? (
                  <span>System recoverable. Proceed with caution.</span>
                ) : (
                  <span className="text-alert-red">Critical failure. Mission compromised.</span>
                )}
              </div>

              {/* Action button */}
              <div className="mt-6 flex items-center justify-end gap-3">
                {canContinue ? (
                  <motion.button
                    type="button"
                    onClick={onContinue}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-zinc-100 transition-all hover:border-cyber-green/40 hover:bg-cyber-green/10 hover:text-cyber-green"
                  >
                    <span className="relative z-10">Continue Mission →</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-cyber-green/0 via-cyber-green/10 to-cyber-green/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={onContinue}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-lg border border-alert-red/30 bg-alert-red/10 px-6 py-2.5 text-sm font-medium text-alert-red"
                  >
                    Mission Failed - View Debrief
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

