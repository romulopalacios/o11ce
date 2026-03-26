import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import type { MatchDetailResponse } from "@/server/services/football/types";

interface EventTimelineProps {
  match: MatchDetailResponse;
}

interface TimelineEvent {
  id: string;
  minute: number;
  type: "goal" | "YELLOW_CARD" | "RED_CARD" | "substitution";
  playerName: string;
  detail: string;
  teamCode: string;
}

function buildTimeline(match: MatchDetailResponse): TimelineEvent[] {
  const goalEvents: TimelineEvent[] = match.goals.map((goal, index) => ({
    id: `goal-${goal.minute}-${goal.team.id}-${goal.scorer.name}-${index}`,
    minute: goal.minute,
    type: "goal",
    playerName: goal.scorer.name,
    detail: goal.assist?.name ? `Asistencia: ${goal.assist.name}` : "Tipo: regular",
    teamCode: goal.team.tla,
  }));

  const bookingEvents: TimelineEvent[] = match.bookings.map((booking, index) => ({
    id: `booking-${booking.minute}-${booking.team.id}-${booking.player.name}-${index}`,
    minute: booking.minute,
    type: booking.card === "RED_CARD" || booking.card === "YELLOW_RED_CARD" ? "RED_CARD" : "YELLOW_CARD",
    playerName: booking.player.name,
    detail: booking.card === "YELLOW_CARD" ? "Tipo: amarilla" : "Tipo: roja",
    teamCode: booking.team.tla,
  }));

  const substitutionEvents: TimelineEvent[] = match.substitutions.map((substitution, index) => ({
    id: `sub-${substitution.minute}-${substitution.team.id}-${substitution.playerOut.name}-${substitution.playerIn.name}-${index}`,
    minute: substitution.minute,
    type: "substitution",
    playerName: substitution.playerIn.name,
    detail: `Sale: ${substitution.playerOut.name}`,
    teamCode: substitution.team.tla,
  }));

  return [...goalEvents, ...bookingEvents, ...substitutionEvents].sort((a, b) => b.minute - a.minute);
}

const iconConfig = {
  goal: { bg: "bg-[#22c55e15]", text: "text-[#22c55e]", symbol: "⚽" },
  YELLOW_CARD: { bg: "bg-[#eab30815]", text: "text-[#eab308]", symbol: "▪" },
  RED_CARD: { bg: "bg-[#ef444415]", text: "text-[#ef4444]", symbol: "▪" },
  substitution: { bg: "bg-[#3b82f615]", text: "text-[#3b82f6]", symbol: "↕" },
} as const;

function getEventIcon(type: string) {
  return iconConfig[type as keyof typeof iconConfig] ?? iconConfig.goal;
}

export default function EventTimeline({ match }: EventTimelineProps) {
  const events = buildTimeline(match);

  return (
    <div className="rounded-b-2xl border border-t-0 border-white/10 bg-white/[0.03] px-4 pb-3 pt-[2px]">
      {events.length === 0 ? (
        <EmptyState message="sin eventos disponibles" className="border-0 py-4" />
      ) : (
        <ul>
          {events.map((event, i) => {
            const icon = getEventIcon(event.type);

            return (
              <li
                key={event.id}
                className="animate-slide-left flex items-center gap-3 border-b border-white/10 py-[9px] last:border-0"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="w-6 shrink-0 text-right font-mono text-label text-[var(--text3)]">{event.minute}'</span>

                <div
                  className={cn(
                    "w-[20px] h-[20px] rounded-[4px] shrink-0",
                    "flex items-center justify-center text-[11px]",
                    icon.bg,
                    icon.text,
                  )}
                >
                  {icon.symbol}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate font-sans text-body font-medium text-[var(--text)]">{event.playerName ?? "—"}</p>
                  {event.detail ? <p className="mt-[1px] font-mono text-label text-[var(--text2)]">{event.detail}</p> : null}
                </div>

                <span className="shrink-0 font-mono text-label text-[var(--text3)]">{event.teamCode}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
