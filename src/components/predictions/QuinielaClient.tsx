"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { trpcClient } from "@/lib/trpcClient";
import PredictionCard from "./PredictionCard";
import type { ScheduledMatchPrediction } from "@/server/services/predictions/predictionService";
import { Trophy, Save, UserCircle2 } from "lucide-react";

interface QuinielaClientProps {
  predictions: ScheduledMatchPrediction[];
}

export default function QuinielaClient({ predictions }: QuinielaClientProps) {
  const [username, setUsername] = useState("");
  const [activeUser, setActiveUser] = useState("");
  const [isSaving, setIsSaving] = useState<number | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("quiniela_user");
    if (savedUser) {
      setActiveUser(savedUser);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 3) {
      setActiveUser(username.trim());
      localStorage.setItem("quiniela_user", username.trim());
    }
  };

  const handleLogout = () => {
    setActiveUser("");
    setUsername("");
    localStorage.removeItem("quiniela_user");
  };

  const fetcher = async () => {
    if (!activeUser) return [];
    return await trpcClient.quiniela.getUserPredictions.query({ username: activeUser });
  };

  const { data: userPredictions, mutate } = useSWR(
    activeUser ? `/api/quiniela/${activeUser}` : null,
    fetcher
  );

  const handlePredict = async (matchId: number, predicted: "HOME" | "DRAW" | "AWAY") => {
    setIsSaving(matchId);
    try {
      await trpcClient.quiniela.savePrediction.mutate({
        username: activeUser,
        matchId,
        predicted,
      });
      await mutate();
    } catch (e) {
      console.error("Error saving prediction", e);
    } finally {
      setIsSaving(null);
    }
  };

  const getPredictionActive = (matchId: number) => {
    return userPredictions?.find((p: any) => p.matchId === matchId)?.predicted || null;
  };

  if (!activeUser) {
    return (
      <div className="my-8 flex flex-col items-center justify-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
        <UserCircle2 className="w-12 h-12 text-zinc-500 mb-4" />
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Participa en la Quiniela</h2>
        <p className="text-zinc-400 text-center mb-6 max-w-sm text-sm">
          Guarda un alias para predecir los resultados de los partidos. Compite en el ranking global de aciertos.
        </p>
        <form onSubmit={handleLogin} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <input 
            type="text" 
            placeholder="Escribe tu alias..." 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2 outline-none focus:border-zinc-500"
            required
            minLength={3}
          />
          <button type="submit" className="bg-zinc-100 px-6 py-2 font-semibold text-zinc-950 transition-colors hover:bg-zinc-300 sm:rounded-lg">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Quiniela Activa</p>
          <p className="text-lg font-bold text-zinc-100">Jugando como <span className="text-blue-400">{activeUser}</span></p>
        </div>
        <button onClick={handleLogout} className="text-xs text-zinc-400 hover:text-zinc-200 uppercase tracking-wider font-semibold underline underline-offset-2">
          Cambiar
        </button>
      </div>

      <div className="grid gap-4">
        {predictions.map((p, index) => {
          const predictionValue = getPredictionActive(p.matchId);
          const isPending = isSaving === p.matchId;

          return (
            <div key={p.matchId} className="relative group">
              <PredictionCard prediction={p} animationDelayMs={index * 50} />
              
              {/* Olay Interaction for Quiniela */}
              <div className="mt-2 grid grid-cols-3 gap-2 px-2 sm:px-4 mb-4">
                <button 
                  disabled={isPending}
                  onClick={() => handlePredict(p.matchId, 'HOME')}
                  className={`py-2 rounded-lg font-bold text-sm transition-all border ${
                    predictionValue === 'HOME' 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  Local
                </button>
                <button 
                  disabled={isPending}
                  onClick={() => handlePredict(p.matchId, 'DRAW')}
                  className={`py-2 rounded-lg font-bold text-sm transition-all border ${
                    predictionValue === 'DRAW' 
                      ? 'bg-zinc-500/20 border-zinc-400 text-zinc-300' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  Empate
                </button>
                <button 
                  disabled={isPending}
                  onClick={() => handlePredict(p.matchId, 'AWAY')}
                  className={`py-2 rounded-lg font-bold text-sm transition-all border ${
                    predictionValue === 'AWAY' 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  Visitante
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}