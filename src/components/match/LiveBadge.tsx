export function LiveBadge({ minute }: { minute?: number | null }) {
  return (
    <span className="inline-flex items-center gap-[5px] font-mono text-[10px] font-medium tracking-[.08em] text-[var(--live)]">
      <span
        className="w-[5px] h-[5px] rounded-full bg-[var(--live)]"
        style={{ animation: "blink 1.4s ease-in-out infinite" }}
      />
      {minute ? `LIVE · ${minute}'` : "LIVE"}
    </span>
  );
}
