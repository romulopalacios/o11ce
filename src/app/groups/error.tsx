"use client";

interface GroupsErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GroupsErrorPage({ error, reset }: GroupsErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-start justify-center gap-4 px-6 py-10 md:px-10">
      <div className="w-full rounded-3xl border border-[var(--b2)]/60 bg-[linear-gradient(132deg,rgba(255,77,66,.12),rgba(58,168,255,.1)_46%,rgba(9,16,31,.82))] p-7 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
      <h1 className="font-display text-[32px] leading-none tracking-[.02em] text-[var(--text)]">No pudimos cargar la tabla de grupos</h1>
      <p className="mt-3 text-sm text-[var(--text2)]">Ocurrio un error al obtener la informacion de posiciones.</p>
      <p className="mt-1 font-mono text-[11px] text-[var(--text3)]">Detalle: {error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full border border-[var(--b2)]/75 bg-[var(--s2)]/80 px-4 py-2 font-mono text-[11px] tracking-[.12em] uppercase text-[var(--text)] transition-colors hover:border-[var(--brand-cyan)]"
      >
        Reintentar
      </button>
      </div>
    </main>
  );
}
