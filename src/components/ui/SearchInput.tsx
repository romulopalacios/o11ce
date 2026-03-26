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
    <div className="relative mb-6 sm:mb-7">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border border-[var(--b2)]/70",
          "bg-[linear-gradient(118deg,rgba(58,168,255,.12),rgba(255,77,66,.08)_40%,rgba(11,19,34,.82))]",
          "pl-[68px] pr-20 py-3.5",
          "font-mono text-[12px] tracking-[.045em] text-[var(--text)]",
          "placeholder:text-[var(--text3)]",
          "focus:border-[var(--brand-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)]/30",
          "transition-all duration-150",
        )}
      />

      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[.16em] text-[var(--text2)]">
        filtrar
      </span>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value ? (
          <>
            {resultCount !== undefined ? (
              <span className="font-mono text-[10px] text-[var(--text2)]">
                {resultCount}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onChange("")}
              className="h-6 w-6 rounded-full border border-[var(--b2)]/70 bg-[var(--s2)]/80 font-mono text-[10px] text-[var(--text2)] transition-colors hover:border-[var(--brand-cyan)] hover:text-[var(--text)]"
            >
              ✕
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
