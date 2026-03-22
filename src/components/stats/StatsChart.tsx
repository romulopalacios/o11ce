"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { GoalsByMatchday } from "@/server/services/football/statsService";

interface StatsChartProps {
  data: GoalsByMatchday[];
}

export default function StatsChart({ data }: StatsChartProps) {
  return (
    <div className="h-72 w-full [--chart-grid:theme(colors.slate.300)] [--chart-bar:theme(colors.slate.900)] dark:[--chart-grid:theme(colors.slate.700)] dark:[--chart-bar:theme(colors.slate.100)]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="matchday" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="goals" fill="var(--chart-bar)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
