import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Scorer } from "@/server/services/football/types";

interface TopScorersProps {
  scorers: Scorer[];
}

function toFlagEmoji(teamCode?: string): string {
  if (!teamCode || teamCode.length < 2) {
    return "🏳️";
  }

  const normalized = teamCode.slice(0, 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return "🏳️";
  }

  const [first, second] = normalized;
  const base = 0x1f1e6;
  const firstCodePoint = base + first.charCodeAt(0) - 65;
  const secondCodePoint = base + second.charCodeAt(0) - 65;

  return String.fromCodePoint(firstCodePoint, secondCodePoint);
}

export default function TopScorers({ scorers }: TopScorersProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bandera</TableHead>
          <TableHead>Jugador</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead className="text-right">Goles</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scorers.map((scorer, index) => (
          <TableRow key={`${scorer.player.name}-${index}`}>
            <TableCell className="text-xl">{toFlagEmoji(scorer.team.tla)}</TableCell>
            <TableCell className="font-medium text-slate-900">{scorer.player.name}</TableCell>
            <TableCell>{scorer.team.name}</TableCell>
            <TableCell className="text-right font-semibold">{scorer.goals}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
