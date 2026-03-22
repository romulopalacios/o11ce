interface AccuracyBadgeProps {
  accuracy: number;
  correct: number;
  total: number;
}

export default function AccuracyBadge({ accuracy, correct, total }: AccuracyBadgeProps) {
  return (
    <div className="mb-5 flex items-center gap-3 border border-b1 rounded-[10px] px-3.5 py-3 bg-s1">
      <div>
        <span className="font-display text-[28px] leading-none text-ac">
          {accuracy}%
        </span>
      </div>
      <div>
        <div className="text-[13px] text-t1">
          precision del algoritmo
        </div>
        <div className="mt-[2px] font-mono text-[10px] text-t3 tracking-[.08em] uppercase">
          {correct} de {total} predicciones evaluadas
        </div>
      </div>
    </div>
  );
}
