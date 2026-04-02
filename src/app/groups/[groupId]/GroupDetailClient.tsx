"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import { Trophy, CalendarDays, Activity } from 'lucide-react';
import type { StandingGroup, FootballMatch } from '@/server/services/football/types';
import StandingsTable from '@/components/groups/StandingsTable';
import MatchCard from '@/components/match/MatchCard';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';

interface GroupDetailClientProps {
  allGroups: StandingGroup[];
  currentGroup: StandingGroup | undefined;
  groupMatches: FootballMatch[];
  groupId: string;
}

export default function GroupDetailClient({
  allGroups,
  currentGroup,
  groupMatches,
  groupId
}: GroupDetailClientProps) {
  // Filtrar partidos del grupo actual si la API no lo ha hecho por nombre exacto
  const matches = groupMatches || [];

  return (
    <div className="animate-fade-in">
      {/* Pills de navegación de grupos */}
      <nav className="mb-8 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <ul className="flex min-w-max items-center justify-center gap-2 lg:flex-wrap">
          {allGroups.map((g) => {
            const groupName = g.group?.replace('GROUP_', 'Grupo ') || g.group;
            const isActive = g.group === currentGroup?.group;
            return (
              <li key={g.group}>
                <Link
                  href={`/groups/${(g.group || '').replace(' ', '_').toUpperCase()}`}
                  className={cn(
                    "relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                    isActive
                      ? "text-emerald-400"
                      : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 z-0 rounded-full bg-emerald-500/10 border border-emerald-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">{groupName}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Título Principal */}
      <header className="mb-10 text-center flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="flex h-16 w-16 items-center justify-center mb-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.1)]"
        >
          <Trophy className="h-8 w-8" />
        </motion.div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
          {currentGroup?.group?.replace('GROUP_', 'Grupo ') || groupId}
        </h1>
        <p className="mt-2 text-zinc-500 max-w-xl">
          Posiciones, rendimientos y fixture oficial del grupo interactivo.
        </p>
      </header>

      {/* Contenido: Dashboard Layout */}
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] items-start pb-20">
        {/* Columna Izquierda: Posiciones */}
        <section className="flex flex-col">
          <div className="flex items-center gap-2 mb-6 w-full border-b border-zinc-800 pb-3">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-zinc-100">Tabla de Posiciones</h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentGroup ? (
              <StandingsTable standings={[currentGroup]} />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 text-center shadow-lg">
                <Activity className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
                <h2 className="text-lg font-semibold text-zinc-300">No hay datos de posiciones</h2>
              </div>
            )}
          </motion.div>
        </section>

        {/* Columna Derecha: Partidos */}
        <section className="flex flex-col">
          <div className="flex items-center gap-2 mb-6 w-full border-b border-zinc-800 pb-3">
            <CalendarDays className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-zinc-100">Calendario Oficial</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {matches.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {matches.map((match, i) => (
                  <MatchCard key={match.id} match={match} animationDelayMs={i * 50} />
                ))}
              </div>
            ) : (
              <div className="shadow-lg">
                <EmptyState
                  message="No hay partidos programados"
                  description="Aún no hay encuentros generados oficialmente en este grupo por la competencia."
                />
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}