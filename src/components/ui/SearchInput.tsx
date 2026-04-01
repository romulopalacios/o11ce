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
    <div className="relative mb-7 sm:mb-8">
      <label htmlFor="global-search-input" className="sr-only">
        Buscar contenido
      </label>
      <input
        id="global-search-input"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border border-[var(--b2)]/22",
          "bg-[linear-gradient(118deg,rgba(58,168,255,.08),rgba(255,77,66,.05)_40%,rgba(11,19,34,.5))]",
          "pl-[68px] pr-20 py-3.5 sm:py-3",
          "font-mono text-[12px] leading-[1.2] tracking-[.045em] text-[var(--text)]",
          "placeholder:text-[var(--text3)]",
          "focus-visible:border-cyan-300/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45",
          "transition-all duration-150",
        )}
        aria-describedby={resultCount !== undefined && value ? "search-result-count" : undefined}
      />

      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[.16em] text-[var(--text2)]">
        filtrar
      </span>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value ? (
          <>
            {resultCount !== undefined ? (
              <span id="search-result-count" className="font-mono text-[10px] text-[var(--text2)]">
                {resultCount}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Limpiar busqueda"
              className="h-7 w-7 rounded-full border border-[var(--b2)]/24 bg-[var(--s2)]/52 font-mono text-[10px] text-[var(--text2)] transition-all hover:border-[var(--brand-cyan)]/45 hover:text-[var(--text)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/70 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--brand-navy)]"
            >
              ✕
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
