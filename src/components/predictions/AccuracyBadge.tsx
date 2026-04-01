interface AccuracyBadgeProps {
  accuracy: number;
  correct: number;
  total: number;
}

export default function AccuracyBadge({ accuracy, correct, total }: AccuracyBadgeProps) {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[var(--b2)]/20 bg-[linear-gradient(126deg,rgba(58,168,255,.08),rgba(255,77,66,.06)_46%,rgba(8,16,31,.5))] px-5 py-4 backdrop-blur-sm">
      <div>
        <span className="font-display text-[32px] leading-none text-[var(--accent)]">
          {accuracy}%
        </span>
      </div>
      <div>
        <div className="text-[13px] font-medium text-[var(--text)]">
          precision del algoritmo
        </div>
        <div className="mt-[3px] font-mono text-[10px] tracking-[.1em] uppercase text-[var(--text3)]">
          {correct} de {total} predicciones evaluadas
        </div>
      </div>
    </div>
  );
}
