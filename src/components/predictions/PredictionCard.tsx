"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import Image from "next/image";

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
  const isFallback = false;
  const animationStyle = {
    "--prediction-delay": `${animationDelayMs}ms`,
  } as CSSProperties;

  return (
    <motion.article
      className="mb-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors duration-200 hover:border-purple-500/30 hover:bg-zinc-900 animate-fade-up [animation-delay:var(--prediction-delay)] sm:p-5"
      style={animationStyle}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
        {/* Home Team */}
        <div className="flex items-center gap-3 justify-end text-right">
          <span className="truncate font-sans text-sm font-semibold text-zinc-100">{prediction.homeTeam.name}</span>
          {typeof (prediction.homeTeam as any).crest === "string" && (
            <div className="h-8 w-8 shrink-0 overflow-hidden relative drop-shadow-sm">
              <Image
                src={(prediction.homeTeam as any).crest}
                alt={prediction.homeTeam.name}
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
          )}
        </div>

        {/* Center VS Date */}
        <div className="flex flex-col items-center justify-center gap-1 min-w-[100px]">
          <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase text-zinc-400">VS</span>
          <span className="font-mono text-[10px] text-zinc-500">{formatLocalDateTime(prediction.utcDate)}</span>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-3">
          {typeof (prediction.awayTeam as any).crest === "string" && (
            <div className="h-8 w-8 shrink-0 overflow-hidden relative drop-shadow-sm">
              <Image
                src={(prediction.awayTeam as any).crest}
                alt={prediction.awayTeam.name}
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
          )}
          <span className="truncate font-sans text-sm font-semibold text-zinc-100">{prediction.awayTeam.name}</span>
        </div>
      </div>

      {isFallback ? (
        <div className="flex items-center justify-center rounded-xl bg-zinc-900/50 py-4 border border-zinc-800/50">
          <p className="font-mono text-xs font-medium text-zinc-500 uppercase tracking-wider">Esperando más datos del torneo para la predicción</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl font-bold tracking-tight text-zinc-100 leading-none">{prediction.probabilities.homeWin}%</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Local</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-zinc-400 leading-none">{prediction.probabilities.draw}%</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Empate</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-2xl font-bold tracking-tight text-zinc-100 leading-none">{prediction.probabilities.awayWin}%</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Visitante</span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800 flex">
            {/* Home Win Bar */}
            <motion.div
              className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)] relative z-10 rounded-l-full"   
              initial={{ width: 0 }}
              animate={{ width: `${prediction.probabilities.homeWin}%` }}   
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Draw Bar */}
            <motion.div
              className="h-full bg-zinc-600 relative z-0"   
              initial={{ width: 0 }}
              animate={{ width: `${prediction.probabilities.draw}%` }}      
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Away Win Bar */}
            <motion.div
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)] relative z-10 rounded-r-full"
              initial={{ width: 0 }}
              animate={{ width: `${prediction.probabilities.awayWin}%` }}   
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

      )}
    </motion.article>
  );
}
