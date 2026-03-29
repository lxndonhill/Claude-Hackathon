import Link from 'next/link'
import { ChildProfile } from '@/types/child'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, BarChart3 } from 'lucide-react'

const SUPPORT_LABELS: Record<string, string> = {
  LEVEL_1: 'Level 1',
  LEVEL_2: 'Level 2',
  LEVEL_3: 'Level 3',
}

const SUPPORT_COLORS: Record<string, string> = {
  LEVEL_1: 'bg-green-100 text-green-700',
  LEVEL_2: 'bg-amber-100 text-amber-700',
  LEVEL_3: 'bg-orange-100 text-orange-700',
}

function calculateAge(dob: string) {
  const birth = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--
  return age
}

export function ChildCard({ child }: { child: ChildProfile }) {
  const age = calculateAge(child.dateOfBirth)

  return (
    <Link href={`/dashboard/children/${child.id}`}>
      <Card className="card-hover cursor-pointer border-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base font-bold">{child.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{age} years old</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SUPPORT_COLORS[child.supportLevel]}`}
            >
              {SUPPORT_LABELS[child.supportLevel]}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {child.interests.slice(0, 3).map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs font-medium">
                {interest}
              </Badge>
            ))}
            {child.interests.length > 3 && (
              <Badge variant="secondary" className="text-xs font-medium">
                +{child.interests.length - 3} more
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> Plans
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Schedules
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" /> Progress
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
