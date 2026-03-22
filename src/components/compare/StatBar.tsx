import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  valueA: number;
  valueB: number;
  higherIsBetter?: boolean;
}

export function StatBar({ label, valueA, valueB, higherIsBetter = true }: StatBarProps) {
  const maxValue = Math.max(Math.abs(valueA), Math.abs(valueB), 1);
  const widthA = Math.round((Math.abs(valueA) / maxValue) * 100);
  const widthB = Math.round((Math.abs(valueB) / maxValue) * 100);

  const aWins = higherIsBetter ? valueA >= valueB : valueA <= valueB;

  return (
    <div className="mb-3.5">
      <div className="font-mono text-[10px] text-t3 text-center tracking-[.12em] mb-2 uppercase">
        {label}
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "font-mono text-[12px] font-medium w-8 text-right shrink-0",
            aWins ? "text-ac" : "text-t2",
          )}
        >
          {valueA}
        </span>

        <div className="flex-1 flex justify-end">
          <div className="h-[4px] bg-b2 rounded-full overflow-hidden w-full">
            <div
              className="h-full rounded-full float-right"
              style={{
                width: `${widthA}%`,
                background: aWins ? "var(--accent)" : "var(--text3)",
                transition: "width 0.5s ease-out",
              }}
            />
          </div>
        </div>

        <div className="w-[1px] h-3 bg-b2 shrink-0" />

        <div className="flex-1">
          <div className="h-[4px] bg-b2 rounded-full overflow-hidden w-full">
            <div
              className="h-full rounded-full"
              style={{
                width: `${widthB}%`,
                background: !aWins ? "var(--accent)" : "var(--text3)",
                transition: "width 0.5s ease-out",
              }}
            />
          </div>
        </div>

        <span
          className={cn(
            "font-mono text-[12px] font-medium w-8 shrink-0",
            !aWins ? "text-ac" : "text-t2",
          )}
        >
          {valueB}
        </span>
      </div>
    </div>
  );
}
