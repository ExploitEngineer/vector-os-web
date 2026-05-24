"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type MonthPoint = { label: string; posts: number };
export type StatusPoint = { status: string; value: number; fill: string };

type TipProps = {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ value?: number | string; name?: string }>;
};

function ChartTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 font-mono text-[11px] shadow-lg">
      {label ? <p className="mb-0.5 text-muted-foreground">{label}</p> : null}
      <p className="text-foreground">
        <span className="text-primary">{payload[0].value}</span>{" "}
        {payload[0].name ?? ""}
      </p>
    </div>
  );
}

const axisTick = {
  fill: "#8b8b8b",
  fontSize: 10,
  fontFamily: "var(--font-mono, monospace)",
};

export default function DashboardCharts({
  postsPerMonth,
  projectsByStatus,
}: {
  postsPerMonth: MonthPoint[];
  projectsByStatus: StatusPoint[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-sm uppercase tracking-[0.12em]">
            Posts published
          </CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={postsPerMonth}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="label"
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip
                  cursor={{ stroke: "rgba(0,229,255,0.3)" }}
                  content={<ChartTooltip />}
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  name="posts"
                  stroke="#00e5ff"
                  strokeWidth={2}
                  fill="url(#fillPosts)"
                  dot={{ fill: "#00e5ff", r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-sm uppercase tracking-[0.12em]">
            Projects by status
          </CardTitle>
          <CardDescription>Current portfolio breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectsByStatus}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="status"
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  content={<ChartTooltip />}
                />
                <Bar dataKey="value" name="projects" radius={[4, 4, 0, 0]}>
                  {projectsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
