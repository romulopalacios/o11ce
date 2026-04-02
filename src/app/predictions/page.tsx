import type { Metadata } from "next";
import { Suspense } from "react";
import { Activity } from "lucide-react";

import AccuracyBadge from "@/components/predictions/AccuracyBadge";
import PredictionCard from "@/components/predictions/PredictionCard";
import EmptyState from "@/components/ui/EmptyState";
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
    <div className="space-y-6">
      {summary ? (
        <AccuracyBadge accuracy={summary.accuracy} correct={summary.correct} total={summary.total} />
      ) : (
        <div className="mb-6 font-mono text-[10px] text-zinc-500 uppercase tracking-widest text-center">        
          sin partidos evaluados aún
        </div>
      )}

      {sortedPredictions.length === 0 ? (
        <EmptyState message="sin predicciones disponibles" />
      ) : (
        <div className="grid gap-3">
          {sortedPredictions.map((prediction, index) => (
            <PredictionCard
              key={prediction.matchId}
              prediction={prediction}
              animationDelayMs={index * 60}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PredictionsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
        <header className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-purple-500">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Predictions Lab</h1>
            <p className="text-sm text-zinc-400">Modelo probabilístico del torneo basado en IA</p>
          </div>
        </header>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-4 md:p-6 backdrop-blur-xl">
          <Suspense
            fallback={(
              <div className="space-y-6">
                <div className="mb-6 h-[92px] animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50" />
                <div className="grid gap-3">
                  <Skeleton count={4} height="h-[126px]" />
                </div>
              </div>
            )}
          >
            <PredictionsContent />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
