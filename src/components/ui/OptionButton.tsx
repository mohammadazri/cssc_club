"use client";

import { clsx } from "clsx";
import { motion } from "framer-motion";

type Variant = "default" | "success" | "danger" | "disabled";

const OPTION_KEYS = ["A", "B", "C", "D", "E", "F"];

export function OptionButton({
  children,
  onClick,
  disabled,
  variant = "default",
  index = 0,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: Variant;
  index?: number;
  className?: string;
}) {
  const v = disabled ? "disabled" : variant;
  const key = OPTION_KEYS[index] || String(index + 1);
  
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.01, x: 4 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={clsx(
        "group relative w-full overflow-hidden rounded-lg border text-left transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-cyber-green/50",
        v === "default" && [
          "border-white/10 bg-gradient-to-r from-white/[0.03] to-white/[0.06]",
          "hover:border-cyber-green/30 hover:bg-gradient-to-r hover:from-cyber-green/[0.05] hover:to-cyber-green/[0.10]",
          "hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]",
          "text-zinc-200 hover:text-zinc-50",
        ],
        v === "success" && [
          "border-cyber-green/50 bg-gradient-to-r from-cyber-green/10 to-cyber-green/20",
          "text-cyber-green shadow-[0_0_25px_rgba(0,255,136,0.2)]",
        ],
        v === "danger" && [
          "border-alert-red/50 bg-gradient-to-r from-alert-red/10 to-alert-red/20",
          "text-alert-red shadow-[0_0_25px_rgba(255,34,68,0.2)]",
        ],
        v === "disabled" && [
          "border-white/5 bg-white/[0.02] text-zinc-600 cursor-not-allowed",
        ],
        className,
      )}
    >
      {/* Key indicator */}
      <div className="flex items-stretch">
        <div className={clsx(
          "flex w-12 shrink-0 items-center justify-center border-r transition-colors",
          v === "default" && "border-white/10 bg-white/[0.03] group-hover:border-cyber-green/20 group-hover:bg-cyber-green/[0.05]",
          v === "success" && "border-cyber-green/30 bg-cyber-green/10",
          v === "danger" && "border-alert-red/30 bg-alert-red/10",
          v === "disabled" && "border-white/5 bg-white/[0.02]",
        )}>
          <span className={clsx(
            "font-mono text-sm font-bold transition-colors",
            v === "default" && "text-zinc-500 group-hover:text-cyber-green",
            v === "success" && "text-cyber-green",
            v === "danger" && "text-alert-red",
            v === "disabled" && "text-zinc-700",
          )}>
            {key}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-1 px-4 py-3.5">
          <span className="relative z-10 text-sm leading-relaxed">{children}</span>
        </div>
      </div>

      {/* Hover glow effect */}
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          v === "default" && "bg-[radial-gradient(ellipse_at_left,rgba(0,255,136,0.08),transparent_70%)]",
        )}
      />
      
      {/* Scan line on hover */}
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity",
          "group-hover:opacity-40",
          "bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,136,0.03)_2px,rgba(0,255,136,0.03)_4px)]",
        )}
      />
    </motion.button>
  );
}

