"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import type { ScheduledMatchPrediction } from "@/server/services/predictions/predictionService";

interface PredictionCardProps {
  prediction: ScheduledMatchPrediction;
  animationDelayMs?: number;
}

function formatLocalDateTime(utcDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(new Date(utcDate));
}

export default function PredictionCard({ prediction, animationDelayMs = 0 }: PredictionCardProps) {
  const isFallback = prediction.probabilities.homeWin === prediction.probabilities.awayWin;
  const animationStyle = {
    "--prediction-delay": `${animationDelayMs}ms`,
  } as CSSProperties;

  return (
    <motion.article
      className="mb-[8px] rounded-2xl border border-[var(--b2)]/55 bg-[linear-gradient(126deg,rgba(58,168,255,.11),rgba(255,77,66,.08)_46%,rgba(8,16,31,.74))] px-5 py-4 transition-colors duration-200 hover:border-[var(--brand-cyan)]/75 animate-fade-up [animation-delay:var(--prediction-delay)]"
      style={animationStyle}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-5">
        <span className="truncate font-sans text-[13px] font-medium text-[var(--text)]">{prediction.homeTeam.name}</span>
        <div className="flex flex-col items-center gap-[2px]">
          <span className="font-mono text-[10px] tracking-[.12em] uppercase text-[var(--text3)]">vs</span>
          <span className="font-mono text-[10px] tracking-[.08em] text-[var(--text3)]">{formatLocalDateTime(prediction.utcDate)}</span>
        </div>
        <span className="truncate text-right font-sans text-[13px] font-medium text-[var(--text)]">{prediction.awayTeam.name}</span>
      </div>

      {isFallback ? (
        <div className="py-2 text-center">
          <p className="font-mono text-label text-[var(--text3)]">predicción disponible cuando el torneo comience</p>
        </div>
      ) : (
        <>
          <div className="mb-3 grid grid-cols-[1fr_52px_1fr] items-end gap-3">
            <div className="flex flex-col gap-[5px]">
              <span className="font-display text-[24px] text-ac leading-none">{prediction.probabilities.homeWin}%</span>
              <div className="relative h-[5px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-ac rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.probabilities.homeWin}%` }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              </div>
              <span className="font-mono text-[10px] tracking-[.1em] uppercase text-[var(--text3)]">local</span>
            </div>

            <div className="flex flex-col items-center gap-[5px]">
              <span className="font-mono text-[11px] text-[var(--text2)]">{prediction.probabilities.draw}%</span>
              <div className="relative w-[40px] h-[5px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-t3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.probabilities.draw}%` }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              </div>
              <span className="text-center font-mono text-[10px] tracking-[.1em] uppercase text-[var(--text3)]">empate</span>
            </div>

            <div className="flex flex-col items-end gap-[5px]">
              <span
                className={cn(
                  "font-display text-[24px] leading-none",
                  prediction.probabilities.awayWin > 40 ? "text-ac" : "text-t2",
                )}
              >
                {prediction.probabilities.awayWin}%
              </span>
              <div className="relative h-[5px] bg-white/10 rounded-full overflow-hidden w-full">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    background: prediction.probabilities.awayWin > 40 ? "var(--accent)" : "var(--text3)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.probabilities.awayWin}%` }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              </div>
              <span className="text-right font-mono text-[10px] tracking-[.1em] uppercase text-[var(--text3)]">visitante</span>
            </div>
          </div>

          <p className="text-right font-mono text-[10px] tracking-[.08em] uppercase text-[var(--text3)]">basado en datos del torneo</p>
        </>
      )}
    </motion.article>
  );
}
