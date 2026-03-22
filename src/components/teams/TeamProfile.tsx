import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamDetailResponse } from "@/server/services/football/types";

interface TeamProfileProps {
  team: TeamDetailResponse;
}

export default function TeamProfile({ team }: TeamProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{team.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[96px_1fr] md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            {team.crest ? (
              <img src={team.crest} alt={`Escudo de ${team.name}`} className="h-16 w-16 object-contain" />
            ) : (
              <span className="text-xs text-slate-500">Sin escudo</span>
            )}
          </div>

          <div className="space-y-1 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Nombre corto:</span>{" "}
              {team.shortName ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Codigo:</span> {team.tla ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Pais:</span> {team.area?.name ?? "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
