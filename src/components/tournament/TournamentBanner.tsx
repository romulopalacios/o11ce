interface TournamentBannerProps {
  phase: string;
  matchesPlayed: number;
  totalGoals: number;
  daysToFinal: number;
}

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div>
      <div className="font-mono text-[13px] font-medium text-[var(--text)]">{value}</div>
      <div className="mt-[2px] font-mono text-[10px] text-[var(--text3)]">{label}</div>
    </div>
  );
}

export default function TournamentBanner({
  phase,
  matchesPlayed,
  totalGoals,
  daysToFinal,
}: TournamentBannerProps) {
  return (
    <div className="mb-6 border-b border-[var(--border)] pb-5">
      <span className="font-mono text-[11px] tracking-[.1em] uppercase text-[var(--text2)]">{phase}</span>

      <div className="mt-2 flex gap-6">
        <StatItem value={`${matchesPlayed} partidos`} label="jugados" />
        <StatItem value={`${totalGoals} goles`} label="en el torneo" />
        <StatItem value={`${daysToFinal} días`} label="para la final" />
      </div>
    </div>
  );
}
