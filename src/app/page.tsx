import Link from 'next/link'
import { BookOpen, Brain, Calendar, BarChart3, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Lumio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button>Get started free</Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            AI-Powered Learning
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900">
            Personalized learning plans for every child
          </h1>
          <p className="mb-10 text-xl leading-relaxed text-gray-600">
            Lumio helps teachers and parents of autistic children ages 5-18 create
            AI-powered learning plans, build visual schedules, and track meaningful progress.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8">Start for free</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">Sign in</Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">AI Learning Plans</h3>
              <p className="text-gray-600">
                Generate personalized, evidence-based learning plans in seconds using each child&apos;s
                unique profile — strengths, challenges, sensory preferences, and interests.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Visual Schedules</h3>
              <p className="text-gray-600">
                Build structured daily and weekly visual schedules with icons and color-coding.
                Print them for classroom walls or home use.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Progress Tracking</h3>
              <p className="text-gray-600">
                Log progress toward goals and visualize growth over time with charts.
                Celebrate milestones and share reports at IEP meetings.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-2xl bg-blue-50 p-10 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Built for educators and families</h2>
            <div className="mx-auto grid max-w-2xl gap-3 text-left">
              {[
                'Evidence-based strategies from autism specialists',
                'Adapts to DSM-5 support levels (1, 2, and 3)',
                'Leverages special interests to boost engagement',
                'Sensory-informed scheduling and accommodations',
                'Print-ready plans and schedules',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
