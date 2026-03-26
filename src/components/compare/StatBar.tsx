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

  return (
    <div className="mb-5 rounded-3xl border border-[var(--b2)]/55 bg-[linear-gradient(128deg,rgba(58,168,255,.12),rgba(255,77,66,.08)_46%,rgba(8,16,31,.74))] px-4 py-4 shadow-[0_20px_45px_rgba(0,0,0,0.3)]">
      <div className="mb-3 text-center font-mono text-[10px] tracking-[.16em] uppercase text-[var(--text3)]">
        {label}
      </div>

      <div className="grid grid-cols-[40px_1fr_10px_1fr_40px] items-center gap-2">
        <span
          className={cn(
            "font-mono text-[12px] font-medium text-right",
            aWins ? "text-ac" : "text-[var(--text2)]",
          )}
        >
          {valueA}
        </span>

        <div className="relative h-[6px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="absolute right-0 top-0 h-full rounded-full"
            style={{
              background: aWins ? "var(--accent)" : "var(--text3)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${widthA}%` }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        </div>

        <div className="h-3 w-[1px] bg-white/15" />

        <div className="relative h-[6px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background: !aWins ? "var(--accent)" : "var(--text3)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${widthB}%` }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        </div>

        <span
          className={cn(
            "font-mono text-[12px] font-medium",
            !aWins ? "text-ac" : "text-[var(--text2)]",
          )}
        >
          {valueB}
        </span>
      </div>
    </div>
  );
}
