import type { Metadata } from 'next';
import { footballAPIClient } from '@/server/services/football/client';
import TopScorers from '@/components/stats/TopScorers';
import { BarChart3 } from 'lucide-react';
import type { Scorer } from '@/server/services/football/types';

export const metadata: Metadata = {
  title: 'Estadísticas - O11CE',
  description: 'Goleadores y estadísticas del campeonato.',
};

export const revalidate = 600;

export default async function StatsPage() {
  const scorersData = await footballAPIClient.getScorers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Goleadores
          </h1>
        </div>
        <p className="text-zinc-500 max-w-2xl text-lg">
          Tabla de máximos anotadores del torneo.
        </p>
      </header>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <TopScorers scorers={scorersData?.scorers || []} />
      </div>
    </div>
  );
}

