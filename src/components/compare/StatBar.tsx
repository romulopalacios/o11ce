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
  // Alternar colores de barra y valor destacado
  const accentColors = ["var(--accent-red)", "var(--accent-green)", "var(--accent-blue)"];
  const accentA = accentColors[0];
  const accentB = accentColors[2];

  return (
    <div className="mb-5 rounded-3xl border border-[var(--b2)]/16 bg-[linear-gradient(128deg,rgba(58,168,255,.09),rgba(255,77,66,.06)_46%,rgba(8,16,31,.5))] px-4 py-4 shadow-[0_14px_30px_rgba(0,0,0,0.2)] sm:px-5">
      <div className="mb-3 text-center font-mono text-[10px] tracking-[.16em] uppercase text-[var(--text3)]">
        {label}
      </div>

      <div className="grid grid-cols-[44px_minmax(0,1fr)_12px_minmax(0,1fr)_44px] items-center gap-2 sm:grid-cols-[48px_minmax(0,1fr)_12px_minmax(0,1fr)_48px] sm:gap-2.5">
        <span
          className={cn(
            "font-mono text-[12px] font-medium text-right",
            aWins ? undefined : "text-[var(--text2)]",
          )}
          style={aWins ? { color: accentA } : {}}
        >
          {valueA}
        </span>

        <div className="relative h-[6px] overflow-hidden rounded-full" style={{ background: 'rgba(231,76,60,0.10)' }}>
          <motion.div
            className="absolute right-0 top-0 h-full rounded-full"
            style={{
              background: aWins ? accentA : "var(--text3)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${widthA}%` }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        </div>

        <div className="h-3 w-[1px] bg-white/8" />

        <div className="relative h-[6px] overflow-hidden rounded-full" style={{ background: 'rgba(41,128,185,0.10)' }}>
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background: !aWins ? accentB : "var(--text3)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${widthB}%` }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        </div>

        <span
          className={cn(
            "font-mono text-[12px] font-medium",
            !aWins ? undefined : "text-[var(--text2)]",
          )}
          style={!aWins ? { color: accentB } : {}}
        >
          {valueB}
        </span>
      </div>
    </div>
  );
}
