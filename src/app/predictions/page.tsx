import type { Metadata } from "next";
import { Suspense } from "react";

import AccuracyBadge from "@/components/predictions/AccuracyBadge";
import PredictionCard from "@/components/predictions/PredictionCard";
import EmptyState from "@/components/ui/EmptyState";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import * as accuracyService from "@/server/services/predictions/accuracyService";
import { getScheduledPredictions } from "@/server/services/predictions/predictionService";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Predicciones | O11CE",
    description: "Probabilidades de resultados para partidos programados del Mundial.",
  };
}

async function PredictionsContent() {
  const [summary, predictions] = await Promise.all([
    accuracyService.getAccuracySummary(),
    getScheduledPredictions(),
  ]);

  const sortedPredictions = predictions.sort(
    (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
  );

  return (
    <>
      {summary ? (
        <AccuracyBadge {...summary} />
      ) : (
        <div className="mb-6 font-mono text-[10px] text-[var(--text3)]">
          sin partidos evaluados aún
        </div>
      )}

      {sortedPredictions.length === 0 ? (
        <EmptyState message="sin predicciones disponibles" />
      ) : (
        <div className="grid gap-3 stagger">
          {sortedPredictions.map((prediction, index) => (
            <PredictionCard
              key={prediction.matchId}
              prediction={prediction}
              animationDelayMs={index * 60}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function PredictionsPage() {
  return (
    <PageWrapper>
      <SectionHeader title="predicciones" />

      <p className="mb-5 text-[13px] text-t2">
        Probabilidades para partidos programados a partir de datos del torneo.
      </p>

        <Suspense
          fallback={(
            <>
              <div className="h-[80px] bg-gradient-to-br from-s2 to-s3 border border-b2 rounded-lg mb-5 animate-pulse" />
              <Skeleton count={4} height="h-[110px]" />
            </>
          )}
        >
          <PredictionsContent />
        </Suspense>
    </PageWrapper>
  );
}
