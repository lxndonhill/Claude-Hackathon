import { ProgressEntry, RATING_LABELS } from '@/types/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  goalDescription: string
  entries: ProgressEntry[]
}

function getRatingColor(rating: number) {
  if (rating >= 4) return 'bg-green-500'
  if (rating >= 3) return 'bg-yellow-500'
  if (rating >= 2) return 'bg-orange-500'
  return 'bg-red-500'
}

function getTrend(entries: ProgressEntry[]) {
  const recent = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
  if (recent.length < 2) return 'stable'
  const avg = recent.slice(0, Math.floor(recent.length / 2)).reduce((s, e) => s + e.rating, 0)
  const older = recent.slice(Math.floor(recent.length / 2)).reduce((s, e) => s + e.rating, 0)
  if (avg > older) return 'up'
  if (avg < older) return 'down'
  return 'stable'
}

export function GoalCard({ goalDescription, entries }: Props) {
  const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const latest = sorted[0]
  const trend = getTrend(sorted)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 leading-snug">
          {goalDescription}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((r) => (
                <div
                  key={r}
                  className={`h-3 w-3 rounded-sm ${
                    latest && r <= latest.rating ? getRatingColor(latest.rating) : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            {latest && (
              <span className="text-xs text-gray-500">
                {RATING_LABELS[latest.rating]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
            {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
            {trend === 'stable' && <Minus className="h-4 w-4 text-gray-400" />}
            <span className="text-gray-400">{entries.length} entries</span>
          </div>
        </div>
        {latest && (
          <p className="mt-1 text-xs text-gray-400">
            Last: {new Date(latest.date).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
