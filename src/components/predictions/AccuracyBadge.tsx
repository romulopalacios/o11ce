import { Activity, Target } from "lucide-react";

interface AccuracyBadgeProps {
  accuracy: number;
  correct: number;
  total: number;
}

export default function AccuracyBadge({ accuracy, correct, total }: AccuracyBadgeProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 sm:px-6 backdrop-blur-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
        <Target className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-purple-400">{accuracy}%</span>
          <span className="text-sm font-medium text-zinc-300">Precisión del Algoritmo</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-zinc-500 uppercase">
          <Activity className="h-3 w-3" />
          <span>{correct} aciertos de {total} predicciones evaluadas</span>
        </div>
      </div>
    </div>
  );
}
