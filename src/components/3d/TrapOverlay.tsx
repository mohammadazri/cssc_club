"use client";

import { motion, AnimatePresence } from "framer-motion";

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
          <div className="absolute inset-0 bg-alert-red/15 backdrop-blur-sm" />
          <motion.div
            initial={{ y: 14, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            className="relative w-full max-w-xl rounded-2xl border border-alert-red/30 bg-void-black/80 p-6"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-alert-red">
              INTRUSION DETECTED
            </p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-100">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-200">{message}</p>
            <div className="mt-5 flex items-center justify-end">
              <button
                type="button"
                disabled={!canContinue}
                onClick={onContinue}
                className={
                  "rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                }
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
