'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ProgressEntry, RATING_LABELS } from '@/types/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

interface Props {
  entries: ProgressEntry[]
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export function ProgressChart({ entries }: Props) {
  // Group entries by goal
  const goalMap = new Map<string, ProgressEntry[]>()
  for (const entry of entries) {
    const key = entry.goalDescription
    if (!goalMap.has(key)) goalMap.set(key, [])
    goalMap.get(key)!.push(entry)
  }

  const goals = Array.from(goalMap.keys())

  // Build chart data: one row per unique date
  const dateSet = new Set(entries.map((e) => e.date.slice(0, 10)))
  const dates = Array.from(dateSet).sort()

  const chartData = dates.map((date) => {
    const row: Record<string, unknown> = { date }
    for (const goal of goals) {
      const entry = goalMap.get(goal)?.find((e) => e.date.slice(0, 10) === date)
      row[goal] = entry?.rating ?? null
    }
    return row
  })

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-gray-500">No progress data yet. Log entries to see charts.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          Progress Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(v) => RATING_LABELS[v]?.slice(0, 3) ?? v}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} — ${RATING_LABELS[value] ?? ''}`,
                name.length > 30 ? name.slice(0, 30) + '…' : name,
              ]}
            />
            <Legend
              formatter={(name: string) =>
                name.length > 25 ? name.slice(0, 25) + '…' : name
              }
            />
            {goals.slice(0, 6).map((goal, i) => (
              <Line
                key={goal}
                type="monotone"
                dataKey={goal}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
