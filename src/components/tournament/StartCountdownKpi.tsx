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

  return (
    <article className={`rounded-2xl border border-cyan-300/20 bg-[#081522]/75 p-3.5 shadow-[0_8px_18px_rgba(2,10,23,0.3)] ${className ?? ""}`}>
      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-300">Dias para el inicio</p>

      <div className="mt-2 grid grid-cols-4 gap-2">
        <div
          className="rounded-lg bg-[#07101b]/70 px-2 py-2 text-center"
          style={{ border: '2px solid var(--accent-red)' }}
        >
          <p className="font-display text-xl leading-none text-slate-50">{countdown.days}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.11em] text-slate-400">dias</p>
        </div>
        <div
          className="rounded-lg bg-[#07101b]/70 px-2 py-2 text-center"
          style={{ border: '2px solid var(--accent-green)' }}
        >
          <p className="font-display text-xl leading-none text-slate-50">{padTwo(countdown.hours)}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.11em] text-slate-400">horas</p>
        </div>
        <div
          className="rounded-lg bg-[#07101b]/70 px-2 py-2 text-center"
          style={{ border: '2px solid var(--accent-blue)' }}
        >
          <p className="font-display text-xl leading-none text-slate-50">{padTwo(countdown.minutes)}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.11em] text-slate-400">min</p>
        </div>
        <div
          className="rounded-lg bg-[#07101b]/70 px-2 py-2 text-center"
          style={{ border: '2px solid var(--accent-green)' }}
        >
          <p className="font-display text-xl leading-none text-slate-50">{padTwo(countdown.seconds)}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.11em] text-slate-400">seg</p>
        </div>
      </div>
    </article>
  );
}
