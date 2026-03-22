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
    <div className="bg-surface border border-border border-t-0 rounded-b-lg px-4 pb-3 pt-[2px]">
      {events.length === 0 ? (
        <EmptyState message="sin eventos disponibles" className="border-0 py-4" />
      ) : (
        <ul>
          {events.map((event, i) => {
            const icon = getEventIcon(event.type);

            return (
              <li
                key={event.id}
                className="flex items-center gap-3 py-[9px] border-b border-border last:border-0 animate-slide-left"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="font-mono text-label text-text3 w-6 text-right shrink-0">{event.minute}'</span>

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
                  <p className="font-sans text-body font-medium text-text truncate">{event.playerName ?? "—"}</p>
                  {event.detail && <p className="font-mono text-label text-text2 mt-[1px]">{event.detail}</p>}
                </div>

                <span className="font-mono text-label text-text3 shrink-0">{event.teamCode}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
