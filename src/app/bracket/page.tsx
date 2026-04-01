import type { Metadata } from "next";
import { Suspense } from "react";
import { GitMerge } from "lucide-react";
import { BracketColumn } from "@/components/bracket/BracketColumn";
import EmptyState from "@/components/ui/EmptyState";
import { bracketService } from "@/server/services/football/bracketService";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Bracket - O11CE",
    description: "Cuadro eliminatorio del torneo.",
  };
}

async function BracketContent() {
  const bracket = await bracketService.getBracket();

  const stages = [
    "ROUND_OF_16",
    "QUARTER_FINALS",
    "SEMI_FINALS",
    "FINAL",
  ] as const;

  const hasEliminationMatches = stages.some((stage) => (bracket[stage]?.length ?? 0) > 0);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4 flex items-start gap-4">
        <div className="mt-0.5 rounded-full bg-blue-500/20 p-1 text-blue-400">
           <GitMerge className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Fase de grupos en curso</h3>
          <p className="text-sm text-zinc-400">
            El bracket en vivo se completará automáticamente una vez que finalicen los partidos de la fase de grupos y los cruces queden definidos.
          </p>
        </div>
      </div>

      {!hasEliminationMatches ? (
        <EmptyState
          message="Sin cruces definidos"
          description="La fase eliminatoria comenzará pronto."
          className="border-dashed border-zinc-800 bg-zinc-900/20 py-16"
        />
      ) : (
        <div className="overflow-x-auto pb-8 hide-scrollbar">
          <div className="flex gap-8 min-w-max">
            {stages.map((stage) => (
              <BracketColumn
                key={stage}
                stage={stage}
                matches={bracket[stage] ?? []}
              />
            ))}
          </div>
        </div>
      )}

      {(bracket.THIRD_PLACE?.length ?? 0) > 0 && (
        <div className="pt-8 border-t border-zinc-800/60">
          <div className="mb-6 flex items-center gap-2">
             <div className="h-4 w-1 bg-zinc-500 rounded-full" />
             <h2 className="text-lg font-bold tracking-wider text-zinc-100 uppercase">Tercer Lugar</h2>
          </div>
          <BracketColumn stage="THIRD_PLACE" matches={bracket.THIRD_PLACE} />
        </div>
      )}
    </div>
  );
}

export default function BracketPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <GitMerge className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Cuadro Eliminatorio
          </h1>
        </div>
        <p className="text-zinc-500 max-w-2xl text-lg">
          Sigue el progreso de las selecciones hacia la gran final.
        </p>
      </header>

      <Suspense
        fallback={(
          <div className="overflow-x-auto">
            <div className="flex gap-8 min-w-max animate-pulse">
              {[8, 4, 2, 1].map((count, col) => (
                <div key={col} className="flex flex-col justify-around gap-4 min-h-[600px]">
                  <div className="mb-2 h-4 w-24 rounded bg-zinc-800" />
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="h-[90px] w-[240px] rounded-xl bg-zinc-900 border border-zinc-800" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      >
        <BracketContent />
      </Suspense>
    </div>
  );
}
