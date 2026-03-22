"use client";

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
  const animationStyle = {
    "--prediction-delay": `${animationDelayMs}ms`,
  } as CSSProperties;

  return (
    <article
      className="panel-compact px-4 py-3 mb-[5px] hover:border-b2 hover:bg-s2/90 transition-colors duration-150 animate-fade-up [animation-delay:var(--prediction-delay)]"
      style={animationStyle}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
        <span className="font-sans text-[13px] font-medium text-t1 truncate">{prediction.homeTeam.name}</span>
        <div className="flex flex-col items-center gap-[2px]">
          <span className="font-mono text-[10px] tracking-[.12em] uppercase text-t3">vs</span>
          <span className="font-mono text-[10px] text-t3 tracking-[.08em]">{formatLocalDateTime(prediction.utcDate)}</span>
        </div>
        <span className="font-sans text-[13px] font-medium text-t1 truncate text-right">{prediction.awayTeam.name}</span>
      </div>

      <div className="grid grid-cols-[1fr_52px_1fr] gap-3 items-end mb-3">
        <div className="flex flex-col gap-[5px]">
          <span className="font-display text-[24px] text-ac leading-none">{prediction.probabilities.homeWin}%</span>
          <div className="h-[4px] bg-b2 rounded-full overflow-hidden">
            <div
              className="h-full bg-ac rounded-full"
              style={{
                width: `${prediction.probabilities.homeWin}%`,
              }}
            />
          </div>
          <span className="font-mono text-[10px] text-t3 tracking-[.1em] uppercase">local</span>
        </div>

        <div className="flex flex-col items-center gap-[5px]">
          <span className="font-mono text-[11px] text-t2">{prediction.probabilities.draw}%</span>
          <div className="w-[40px] h-[4px] bg-b2 rounded-full overflow-hidden">
            <div
              className="h-full bg-t3 rounded-full"
              style={{
                width: "100%",
              }}
            />
          </div>
          <span className="font-mono text-[10px] text-t3 text-center tracking-[.1em] uppercase">empate</span>
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
          <div className="h-[4px] bg-b2 rounded-full overflow-hidden w-full">
            <div
              className="h-full rounded-full"
              style={{
                width: `${prediction.probabilities.awayWin}%`,
                background: prediction.probabilities.awayWin > 40 ? "var(--accent)" : "var(--text3)",
              }}
            />
          </div>
          <span className="font-mono text-[10px] text-t3 text-right tracking-[.1em] uppercase">visitante</span>
        </div>
      </div>

      <p className="font-mono text-[10px] text-t3 text-right tracking-[.08em] uppercase">basado en datos del torneo</p>
    </article>
  );
}
