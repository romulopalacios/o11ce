import type { Metadata } from 'next';
import { footballAPIClient } from '@/server/services/football/client';
import { MatchListClient } from '@/components/match/MatchListClient';
import { CalendarDays } from 'lucide-react';
import type { FootballMatch } from '@/server/services/football/types';

export const metadata: Metadata = {
  title: 'Partidos - O11CE',
  description: 'Calendario y resultados de todos los partidos.',
};

export const revalidate = 60;

export default async function MatchesPage() {
  const matchesData = await footballAPIClient.getMatches();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Calendario de Partidos
          </h1>
        </div>
        <p className="text-zinc-500 max-w-2xl text-lg">
          Resultados en vivo, historial y próximos encuentros de la competición.
        </p>
      </header>

      <MatchListClient matches={matchesData?.matches || []} />
    </div>
  );
}

