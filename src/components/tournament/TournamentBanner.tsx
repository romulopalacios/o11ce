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
}

function StatItem({ value, label, Icon, toneClass = "text-ac" }: StatItemProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[.11em] uppercase text-t3">{label}</span>
        <Icon size={15} className={toneClass} />
      </div>
      <div className="stat-value mt-2 text-t1">{value}</div>
    </div>
  );
}

export default function TournamentBanner({
  phase,
  matchesPlayed,
  totalGoals,
  daysToWorldCup,
  daysToFinal,
}: TournamentBannerProps) {
  return (
    <section className="panel p-4 sm:p-5">
      <div className="mb-3 rounded-md border border-b1 bg-s1 px-3 py-2">
        <span className="font-mono text-[10px] tracking-[.12em] uppercase text-t3">fase actual</span>
        <p className="mt-1 text-[15px] text-t1">{phase}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <StatItem value={String(matchesPlayed)} label="partidos jugados" Icon={Trophy} />
        <StatItem value={String(totalGoals)} label="goles totales" Icon={Goal} toneClass="text-[#cda75b]" />
        <StatItem value={String(daysToWorldCup)} label="dias para el mundial" Icon={CalendarDays} />
        <StatItem value={String(daysToFinal)} label="dias para la final" Icon={CalendarDays} />
      </div>
    </section>
  );
}
