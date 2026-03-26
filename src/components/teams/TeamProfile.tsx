import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamDetailResponse } from "@/server/services/football/types";

interface TeamProfileProps {
  team: TeamDetailResponse;
}

export default function TeamProfile({ team }: TeamProfileProps) {
  return (
    <Card className="rounded-2xl border-white/10 bg-white/[0.03]">
      <CardHeader className="p-6">
        <CardTitle className="text-[28px] leading-none tracking-[.02em] text-[var(--text)]">{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid gap-6 md:grid-cols-[104px_1fr] md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            {team.crest ? (
              <img src={team.crest} alt={`Escudo de ${team.name}`} className="h-16 w-16 object-contain" />
            ) : (
              <span className="text-xs text-[var(--text3)]">Sin escudo</span>
            )}
          </div>

          <div className="space-y-1.5 text-sm text-[var(--text2)]">
            <p>
              <span className="font-semibold text-[var(--text)]">Nombre corto:</span>{" "}
              {team.shortName ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold text-[var(--text)]">Codigo:</span> {team.tla ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold text-[var(--text)]">Pais:</span> {team.area?.name ?? "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
