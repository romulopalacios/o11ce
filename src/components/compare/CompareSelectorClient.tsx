"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Team } from "@/server/services/football/types";

interface CompareSelectorClientProps {
  teams: Team[];
  selectedAId: number | null;
  selectedBId: number | null;
}

export function CompareSelectorClient({ teams, selectedAId, selectedBId }: CompareSelectorClientProps) {
  const router = useRouter();
  
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  const filteredA = teams.filter((t) => t.name?.toLowerCase().includes(searchA.toLowerCase()));
  const filteredB = teams.filter((t) => t.name?.toLowerCase().includes(searchB.toLowerCase()));

  const teamA = teams.find((t) => t.id === selectedAId);
  const teamB = teams.find((t) => t.id === selectedBId);

  const handleSelect = (side: "A" | "B", teamId: number) => {
    let nextA = side === "A" ? teamId : selectedAId;
    let nextB = side === "B" ? teamId : selectedBId;

    // Evitar que A y B sean el mismo
    if (nextA === nextB) {
      if (side === "A") nextB = null;
      else nextA = null;
    }

    if (side === "A") setOpenA(false);
    else setOpenB(false);

    if (!nextA && !nextB) {
      router.push("/compare");
    } else if (nextA && !nextB) {
      router.push(`/compare?a=${nextA}`);
    } else if (!nextA && nextB) {
      router.push(`/compare?b=${nextB}`);
    } else {
      router.push(`/compare?a=${nextA}&b=${nextB}`);
    }
  };

  return (
    <div className="relative mx-auto max-w-4xl w-full mb-10">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6 rounded-3xl backdrop-blur-md shadow-xl relative z-20">
        
        {/* Lado A */}
        <div className="relative">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block border-l-2 border-emerald-500 pl-2">Equipo A</label>
          <button
            onClick={() => {
              setOpenA(!openA);
              setOpenB(false);
              setSearchA("");
            }}
            className={cn(
              "w-full flex items-center justify-between gap-3 bg-zinc-950 border transition-colors px-3 py-2 sm:px-4 sm:py-3 rounded-xl focus:outline-none",
              openA ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "border-zinc-800 hover:border-zinc-700"
            )}
          >
            {teamA ? (
              <div className="flex items-center gap-3">
                <div className="relative h-6 w-6 sm:h-8 sm:w-8 shrink-0">
                    <Image src={teamA.crest ?? "/placeholder.png"} alt={teamA.name ?? ""} fill sizes="(max-width: 640px) 24px, 32px" className="object-contain" />
                </div>
                <span className="font-semibold text-zinc-100 text-sm sm:text-base truncate">{teamA.name}</span>
              </div>
            ) : (
              <span className="text-zinc-500 text-sm italic">Seleccionar equipo...</span>
            )}
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>

          {/* Menú Desplegable A */}
          {openA && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-[120%] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-2 border-b border-zinc-800 bg-zinc-950 flex items-center gap-2">
                <Search className="w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Buscar país..." 
                  value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-zinc-200 w-full"
                />
              </div>
              <ul className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                {filteredA.length === 0 && <li className="p-3 text-center text-sm text-zinc-500">No hay resultados</li>}
                {filteredA.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => handleSelect("A", t.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-6 w-6 shrink-0">
                          <Image src={t.crest ?? "/"} alt={t.name ?? ""} fill sizes="24px" className="object-contain" />
                        </div>
                        <span className="text-sm font-medium text-zinc-300">{t.name}</span>
                      </div>
                      {teamA?.id === t.id && <Check className="w-4 h-4 text-emerald-500" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* VS Bubble */}
        <div className="flex shrink-0 items-center justify-center -mt-6 sm:-mt-8">
          <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10">
            <span className="font-display text-[10px] sm:text-xs font-black italic text-zinc-400">VS</span>
            <div className="absolute -inset-2 -z-10 rounded-full bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-md pointer-events-none" />
          </div>
        </div>

        {/* Lado B */}
        <div className="relative">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block border-r-2 border-blue-500 pr-2 text-right">Equipo B</label>
          <button
            onClick={() => {
              setOpenB(!openB);
              setOpenA(false);
              setSearchB("");
            }}
            className={cn(
              "w-full flex items-center justify-between gap-3 bg-zinc-950 border transition-colors px-3 py-2 sm:px-4 sm:py-3 rounded-xl focus:outline-none flex-row-reverse",
              openB ? "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "border-zinc-800 hover:border-zinc-700"
            )}
          >
              {teamB ? (
              <div className="flex items-center gap-3 flex-row-reverse text-right">
                <div className="relative h-6 w-6 sm:h-8 sm:w-8 shrink-0">
                  <Image src={teamB.crest ?? "/"} alt={teamB.name ?? ""} fill sizes="(max-width: 640px) 24px, 32px" className="object-contain" />
                </div>
                <span className="font-semibold text-zinc-100 text-sm sm:text-base truncate">{teamB.name}</span>
              </div>
            ) : (
              <span className="text-zinc-500 text-sm italic">Seleccionar equipo...</span>
            )}
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>

          {/* Menú Desplegable B */}
          {openB && (
            <div className="absolute top-full right-0 mt-2 w-full sm:w-[120%] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-2 border-b border-zinc-800 bg-zinc-950 flex items-center gap-2">
                <Search className="w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Buscar país..." 
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-zinc-200 w-full"
                />
              </div>
              <ul className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                {filteredB.length === 0 && <li className="p-3 text-center text-sm text-zinc-500">No hay resultados</li>}
                {filteredB.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => handleSelect("B", t.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-6 w-6 shrink-0">
                          <Image src={t.crest ?? "/"} alt={t.name ?? ""} fill sizes="24px" className="object-contain" />
                        </div>
                        <span className="text-sm font-medium text-zinc-300">{t.name}</span>
                      </div>
                      {teamB?.id === t.id && <Check className="w-4 h-4 text-blue-500" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Background Dim for Menus overlay */}
      {(openA || openB) && (
        <div className="fixed inset-0 z-10" onClick={() => { setOpenA(false); setOpenB(false); }} />
      )}
    </div>
  );
}