import type { Metadata } from "next";
import { Suspense } from "react";

import { BracketColumn } from "@/components/bracket/BracketColumn";
import EmptyState from "@/components/ui/EmptyState";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { bracketService } from "@/server/services/football/bracketService";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Bracket - O11CE",
  description: "Cuadro eliminatorio del Mundial 2026",
};

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
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <SectionHeader title="tercer lugar" className="mb-2" />
          <BracketColumn stage="THIRD_PLACE" matches={bracket.THIRD_PLACE} />
        </div>
      )}
    </>
  );
}

export default function BracketPage() {
  return (
    <>
      <div className="border-b border-b1">
        <div className="max-w-[660px] mx-auto px-6 py-7 flex items-end justify-between">
          <h1 className="font-display text-[48px] leading-none tracking-[.02em] text-t1">
            BRACKET
          </h1>
          <div className="font-mono text-label text-t3 text-right leading-relaxed">
            Mundial 2026
            <br />
            <span className="text-t2">fase eliminatoria</span>
          </div>
        </div>
      </div>

      <PageWrapper>
        <Suspense
          fallback={(
            <div className="overflow-x-auto -mx-6 px-6">
              <div className="flex gap-8 min-w-max animate-pulse">
                {[4, 2, 1, 1].map((count, col) => (
                  <div key={col} className="flex flex-col gap-3">
                    <div className="h-3 w-14 bg-s2 rounded mb-1" />
                    {Array.from({ length: count }).map((_, i) => (
                      <div key={i} className="w-[180px] h-[88px] bg-s1 rounded-lg border border-b1" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        >
          <BracketContent />
        </Suspense>
      </PageWrapper>
    </>
  );
}
