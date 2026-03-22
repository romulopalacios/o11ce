"use client";

import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "buscar...",
  resultCount,
}: SearchInputProps) {
  return (
    <div className="relative mb-4 sm:mb-5">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-[var(--surface)] border border-[var(--border)]",
          "rounded-[10px] pl-[58px] pr-20 py-2.5",
          "font-mono text-[12px] tracking-[.03em] text-[var(--text)]",
          "placeholder:text-[var(--text3)]",
          "focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20",
          "transition-all duration-150",
        )}
      />

      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[.14em] text-[var(--text3)]">
        filtrar
      </span>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value ? (
          <>
            {resultCount !== undefined ? (
              <span className="font-mono text-[10px] text-[var(--text3)]">
                {resultCount}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onChange("")}
              className="h-6 w-6 rounded-full border border-[var(--border)] font-mono text-[10px] text-[var(--text3)] hover:border-[var(--border2)] hover:text-[var(--text2)] transition-colors"
            >
              ✕
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
