"use client";

import { useEffect, useState } from "react";

interface StartCountdownKpiProps {
  targetIso: string;
  className?: string;
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdownParts(targetIso: string): CountdownParts {
  const targetDate = new Date(targetIso);
  const targetMs = targetDate.getTime();

  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const nowMs = Date.now();
  const diffMs = Math.max(0, targetMs - nowMs);

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function padTwo(value: number): string {
  return String(value).padStart(2, "0");
}

export default function StartCountdownKpi({ targetIso, className }: StartCountdownKpiProps) {
  const [countdown, setCountdown] = useState<CountdownParts>(() => getCountdownParts(targetIso));

  useEffect(() => {
    setCountdown(getCountdownParts(targetIso));

    const intervalId = window.setInterval(() => {
      setCountdown(getCountdownParts(targetIso));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetIso]);

  if (countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0) return null;

  return (
    <article className={`rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-sm backdrop-blur-sm ${className ?? ""}`}>
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Cuenta regresiva Mundial
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 p-2 sm:p-3">
          <p className="font-display text-2xl sm:text-3xl font-bold leading-none text-zinc-100">{countdown.days}</p>
          <p className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-500">días</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 p-2 sm:p-3">
          <p className="font-display text-2xl sm:text-3xl font-bold leading-none text-zinc-100">{padTwo(countdown.hours)}</p>
          <p className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-500">horas</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 p-2 sm:p-3">
          <p className="font-display text-2xl sm:text-3xl font-bold leading-none text-zinc-100">{padTwo(countdown.minutes)}</p>
          <p className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-500">min</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 p-2 sm:p-3">
          <p className="font-display text-2xl sm:text-3xl font-bold leading-none text-emerald-400">{padTwo(countdown.seconds)}</p>
          <p className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-500">seg</p>
        </div>
      </div>
    </article>
  );
}
