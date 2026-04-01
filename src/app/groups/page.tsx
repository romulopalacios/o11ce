import type { Metadata } from 'next';
import { footballAPIClient } from '@/server/services/football/client';
import StandingsTable from '@/components/groups/StandingsTable';
import { Trophy, Activity } from 'lucide-react';
import type { StandingGroup } from '@/server/services/football/types';

export const metadata: Metadata = {
  title: 'Clasificación - O11CE',
  description: 'Tabla de posiciones de la liga y grupos activos.',
};

export const revalidate = 600;

export default async function GroupsPage() {
  const standings = await footballAPIClient.getStandings();

  const groupsObj = standings?.standings?.filter((s: StandingGroup) => s.type === 'TOTAL');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Trophy className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Clasificación
          </h1>
        </div>
        <p className="text-zinc-500 max-w-2xl text-lg">
          Tabla de posiciones, puntos y estadísticas de la fase de grupos.
        </p>
      </header>

      {groupsObj && groupsObj.length > 0 ? (
        <StandingsTable standings={groupsObj} />
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 py-12 text-center">
          <Activity className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
          <h2 className="text-lg font-semibold text-zinc-300">No hay datos disponibles</h2>
          <p className="mt-1 text-sm text-zinc-500 max-w-xs">
            Al parecer la competencia aún no arrancó su fase de grupos o los datos no están emitidos.
          </p>
        </div>
      )}
    </div>
  );
}

