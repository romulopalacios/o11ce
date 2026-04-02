import Image from "next/image";
import { Flag, MapPin, Hash, Trophy } from "lucide-react";
import type { TeamDetailResponse } from "@/server/services/football/types";

interface TeamProfileProps {
  team: TeamDetailResponse;
}

export default function TeamProfile({ team }: TeamProfileProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8 backdrop-blur-sm">
      {/* Decorative Glow */}
      <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-[60px]" />
      
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl">
          {team.crest ? (
            <div className="relative h-full w-full">
              <Image 
                src={team.crest} 
                alt={`Escudo de ${team.name}`} 
                fill 
                className="object-contain drop-shadow-md"
                sizes="128px"
              />
            </div>
          ) : (
            <Flag className="h-10 w-10 text-zinc-700" />
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-100 mb-2 drop-shadow-sm">
            {team.name}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
            <div className="flex items-center gap-1.5 rounded-full bg-zinc-950 border border-zinc-800 px-3 py-1.5">
              <Hash className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-mono text-xs font-bold text-zinc-300 uppercase">
                {team.shortName ?? team.tla ?? "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 rounded-full bg-zinc-950 border border-zinc-800 px-3 py-1.5">
              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-mono text-xs font-bold text-zinc-300">
                {team.area?.name ?? "Internacional"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-emerald-950/30 border border-emerald-500/20 px-3 py-1.5">
              <Trophy className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-mono text-xs font-bold text-emerald-400">
                Selección Nacional
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

