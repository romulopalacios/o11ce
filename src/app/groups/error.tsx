"use client";

interface GroupsErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GroupsErrorPage({ error, reset }: GroupsErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-start justify-center gap-4 px-6 py-10 md:px-10">
      <h1 className="text-2xl font-bold text-slate-900">No pudimos cargar la tabla de grupos</h1>
      <p className="text-sm text-slate-600">Ocurrio un error al obtener la informacion de posiciones.</p>
      <p className="text-xs text-slate-500">Detalle: {error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Reintentar
      </button>
    </main>
  );
}
