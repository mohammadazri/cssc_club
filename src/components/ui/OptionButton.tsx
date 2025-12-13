"use client";

import { clsx } from "clsx";

type Variant = "default" | "success" | "danger" | "disabled";

export function OptionButton({
  children,
  onClick,
  disabled,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: Variant;
  className?: string;
}) {
  const v = disabled ? "disabled" : variant;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "group relative w-full rounded-xl border px-4 py-3 text-left text-sm transition",
        "focus:outline-none focus:ring-2 focus:ring-cyber-green/50",
        "backdrop-blur",
        v === "default" &&
          "border-white/10 bg-white/5 hover:bg-white/10 text-zinc-100",
        v === "success" &&
          "border-cyber-green/40 bg-cyber-green/10 text-cyber-green",
        v === "danger" && "border-alert-red/40 bg-alert-red/10 text-alert-red",
        v === "disabled" && "border-white/10 bg-white/5 text-zinc-500",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity",
          "group-hover:opacity-100",
          "bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.18),transparent_55%)]",
        )}
      />
    </button>
  );
}
