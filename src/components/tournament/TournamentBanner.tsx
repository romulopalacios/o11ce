import { CalendarDays, Goal, Trophy } from "lucide-react";

interface TournamentBannerProps {
  phase: string;
  matchesPlayed: number;
  totalGoals: number;
  daysToWorldCup: number;
  daysToFinal: number;
}

interface StatItemProps {
  value: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  toneClass?: string;
  progress: number;
}

function StatItem({ value, label, Icon, toneClass = "text-blue-600", progress }: StatItemProps) {
  return (
    <article
      className={[
        "rounded-xl border border-slate-200/80 bg-white px-3.5 py-3.5 shadow-[0_8px_20px_rgb(15,23,42,0.05)]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgb(15,23,42,0.1)]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-slate-500">{label}</span>
        <Icon size={14} className={toneClass} />
      </div>

      <p className="mt-2 font-display text-[34px] leading-none tracking-tight text-slate-900 sm:text-[38px]">{value}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <span className="block h-full rounded-full bg-slate-700 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}

export default function TournamentBanner({
  phase,
  matchesPlayed,
  totalGoals,
  daysToWorldCup,
  daysToFinal,
}: TournamentBannerProps) {
  const goalsPace = matchesPlayed > 0 ? totalGoals / matchesPlayed : 0;
  const goalsPaceProgress = Math.min(Math.round((goalsPace / 4) * 100), 100);
  const matchesProgress = Math.min(Math.round((matchesPlayed / 104) * 100), 100);
  const finalProgress = Math.min(Math.max(100 - Math.round((daysToFinal / 365) * 100), 0), 100);
  const startProgress = Math.min(Math.max(100 - Math.round((daysToWorldCup / 365) * 100), 0), 100);

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgb(15,23,42,0.08)] sm:p-6">
      <header className="mb-4 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-3">
        <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-slate-500">fase actual</p>
        <p className="mt-1 text-[15px] font-semibold text-slate-800">{phase}</p>
        <p className="mt-1 text-xs text-slate-500">Resumen visual de progreso y ritmo competitivo</p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-3">
        <StatItem value={String(matchesPlayed)} label="partidos jugados" Icon={Trophy} progress={matchesProgress} />
        <StatItem value={String(totalGoals)} label="goles totales" Icon={Goal} toneClass="text-slate-700" progress={goalsPaceProgress} />
        <StatItem value={String(daysToFinal)} label="dias para la final" Icon={CalendarDays} progress={finalProgress} />
        <StatItem value={String(daysToWorldCup)} label="dias para el mundial" Icon={CalendarDays} toneClass="text-blue-700" progress={startProgress} />
      </div>
    </section>
  );
}
