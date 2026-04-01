export function LiveBadge({ minute }: { minute?: number | null }) {
  return (
    <span className="inline-flex items-center gap-[6px] rounded-[6px] border border-[var(--live)]/40 bg-[var(--live)]/10 px-2 py-[2px] font-mono text-[10px] font-semibold tracking-[.1em] text-[var(--live)]">
      <span
        className="h-[6px] w-[6px] rounded-full bg-[var(--live)] broadcast-dot"
      />
      {minute ? `LIVE · ${minute}'` : "LIVE"}
    </span>
  );
}
