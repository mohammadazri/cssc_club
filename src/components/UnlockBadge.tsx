"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

export function UnlockBadge({
  locked,
  justUnlocked = false,
}: {
  locked: boolean;
  justUnlocked?: boolean;
}) {
  return (
    <motion.div
      animate={justUnlocked ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
      transition={{ duration: 0.5 }}
      className={clsx(
        "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
        locked
          ? "border-warning-amber/50 bg-warning-amber/10 text-warning-amber"
          : "border-cyber-green/50 bg-cyber-green/10 text-cyber-green",
      )}
      title={locked ? "Complete the previous tier to unlock" : "Unlocked"}
    >
      {locked ? "🔒" : "✓"}
    </motion.div>
  );
}
