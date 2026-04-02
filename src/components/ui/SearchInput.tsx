"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div 
      className="relative mb-7 sm:mb-8 group"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
          "w-full rounded-2xl border border-zinc-800 bg-zinc-900/50",
          "pl-[44px] pr-20 py-3.5 sm:py-3",
          "text-sm text-zinc-100",
          "placeholder:text-zinc-500",
          "focus-visible:border-emerald-500/50 focus-visible:outline-none focus-visible:bg-zinc-800",
          "transition-all duration-300",
        )}
        aria-describedby={resultCount !== undefined && value ? "search-result-count" : undefined}
      />

      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-emerald-500" />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <AnimatePresence>
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              {resultCount !== undefined ? (
                <span id="search-result-count" className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  {resultCount} res
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Limpiar busqueda"
                className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800/80 text-zinc-400 transition-all hover:bg-zinc-700 hover:text-zinc-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
