import type { Metadata } from "next";
import { Suspense } from "react";

import { BracketColumn } from "@/components/bracket/BracketColumn";
import EmptyState from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { bracketService } from "@/server/services/football/bracketService";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Bracket | O11CE",
    description: "Cuadro eliminatorio del Mundial 2026.",
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
    <>
      <SectionHeader title="cuadro eliminatorio" />

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-sm">
        <p className="font-mono text-label tracking-[.1em] text-[var(--text2)]">
          fase de grupos en curso · el bracket se completa cuando terminen los octavos · desde 2 jul 2026
        </p>
      </div>

      {!hasEliminationMatches ? (
        <EmptyState
          message="sin cruces disponibles"
          description="la fase eliminatoria comienza cuando terminen los partidos de grupos"
          className="border-dashed"
        />
      ) : (
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-2">
          <div className="flex gap-4 sm:gap-6 min-w-max pr-2 sm:pr-0">
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
        <div className="mt-8 border-t border-white/10 pt-7">
          <SectionHeader title="tercer lugar" className="mb-3" />
          <BracketColumn stage="THIRD_PLACE" matches={bracket.THIRD_PLACE} />
        </div>
      )}
    </>
  );
}

export default function BracketPage() {
  return (
    <>
      <PageHero title="BRACKET" subtitle="fase eliminatoria" meta="Mundial 2026" />

      <PageWrapper>
        <section className="section-shell border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6">
          <Suspense
            fallback={(
              <div className="overflow-x-auto -mx-2 px-2">
                <div className="flex gap-8 min-w-max animate-pulse">
                  {[4, 2, 1, 1].map((count, col) => (
                    <div key={col} className="flex flex-col gap-4">
                      <div className="mb-1 h-3 w-14 rounded bg-white/10" />
                      {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="h-[94px] w-[186px] rounded-2xl border border-white/10 bg-white/[0.03]" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          >
            <BracketContent />
          </Suspense>
        </section>
      </PageWrapper>
    </>
  );
}
