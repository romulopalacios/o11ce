"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  valueA: number;
  valueB: number;
  higherIsBetter?: boolean;
}

export function StatBar({ label, valueA, valueB, higherIsBetter = true }: StatBarProps) {
  const maxValue = Math.max(Math.abs(valueA), Math.abs(valueB), 1);
  const widthA = Math.round((Math.abs(valueA) / maxValue) * 100);
  const widthB = Math.round((Math.abs(valueB) / maxValue) * 100);

  const aWins = higherIsBetter ? valueA >= valueB : valueA <= valueB;
  const isDraw = valueA === valueB;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700/50 hover:bg-zinc-900">
      <div className="mb-4 text-center font-mono text-[10px] font-bold tracking-widest uppercase text-zinc-400">
        {label}
      </div>

      <div className="grid grid-cols-[44px_minmax(0,1fr)_12px_minmax(0,1fr)_44px] items-center gap-3 sm:grid-cols-[48px_minmax(0,1fr)_12px_minmax(0,1fr)_48px] sm:gap-4">
        {/* Value A */}
        <span
          className={cn(
            "font-mono text-xs font-bold text-right",
            aWins ? "text-emerald-400" : "text-zinc-500",
            isDraw && "text-zinc-300"
          )}
        >
          {valueA}
        </span>

        {/* Bar A */}
        <div className="relative h-[6px] overflow-hidden rounded-full bg-zinc-800">
          <motion.div
            className={cn(
              "absolute right-0 top-0 h-full rounded-full",
              aWins ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-zinc-600",
              isDraw && "bg-zinc-400 shadow-none"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${widthA}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div className="h-3 w-[1px] bg-zinc-700 justify-self-center" />

        {/* Bar B */}
        <div className="relative h-[6px] overflow-hidden rounded-full bg-zinc-800">
          <motion.div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full",
              !aWins || isDraw ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" : "bg-zinc-600",
              isDraw && "bg-zinc-400 shadow-none"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${widthB}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Value B */}
        <span
          className={cn(
            "font-mono text-xs font-bold",
            !aWins || isDraw ? "text-blue-400" : "text-zinc-500",
            isDraw && "text-zinc-300"
          )}
        >
          {valueB}
        </span>
      </div>
    </div>
  );
}

