import Link from 'next/link'
import { BookOpen, Brain, Calendar, BarChart3, CheckCircle, Sparkles, Shield, Heart } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { TryDemoButton } from '@/components/auth/TryDemoButton'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Section 1: Header + Hero (warm gradient) ── */}
      <div className="bg-warm-gradient">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold text-foreground">Lumio</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }), 'font-semibold')}>
              Sign in
            </Link>
            <Link href="/register" className={cn(buttonVariants(), 'font-semibold shadow-sm')}>
              Get started free
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          {/* Decorative background orbs */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute right-1/4 top-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="animate-fade-up-1 mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Powered by Lumen AI
          </div>
          <h1 className="animate-fade-up-2 mb-6 text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
            Every child deserves a{' '}
            <span className="text-primary">personalized</span> path to learning
          </h1>
          <p className="animate-fade-up-3 mb-10 text-xl leading-relaxed text-muted-foreground">
            Lumio helps teachers and parents of children with diverse learning needs, ages 5–18,
            create AI-powered learning plans, build visual schedules, and track meaningful progress.
          </p>
          <div className="animate-fade-up-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className={cn(buttonVariants({ size: 'lg' }), 'px-8 text-base font-bold shadow-md hover:shadow-lg')}>
              Start for free
            </Link>
            <TryDemoButton />
          </div>
          <p className="animate-fade-up-4 mt-4 text-sm text-muted-foreground">
            Demo account: <span className="font-mono font-semibold text-foreground">demo@lumio.app</span> / <span className="font-mono font-semibold text-foreground">demo1234</span>
          </p>
        </section>
      </div>

      {/* ── Section 2: Feature cards (violet tint) ── */}
      <div className="bg-section-violet">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card-hover rounded-2xl border bg-card p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">AI Learning Plans</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate personalized, evidence-based learning plans in seconds using each child&apos;s
                unique profile — strengths, interests, sensory preferences, and communication style.
              </p>
            </div>
            <div className="card-hover rounded-2xl border bg-card p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">Visual Schedules</h3>
              <p className="text-muted-foreground leading-relaxed">
                Build structured daily and weekly visual schedules with icons and color-coding.
                Print them for classroom walls or home use.
              </p>
            </div>
            <div className="card-hover rounded-2xl border bg-card p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">Progress Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Log progress toward goals and visualize growth over time with charts.
                Celebrate milestones and share reports at IEP meetings.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Section 3: Features list + Trust badges (default bg) ── */}
      <div className="bg-background">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-10 text-center">
            <h2 className="mb-6 text-2xl font-extrabold text-foreground">Built for educators and families</h2>
            <div className="mx-auto grid max-w-2xl gap-3 text-left">
              {[
                'Evidence-based strategies grounded in autism education research',
                'Adapts to each child\'s support level — Building Independence, Growing with Support, or Thriving with Guidance',
                'Leverages special interests to boost engagement and motivation',
                'Sensory-informed scheduling and environment accommodations',
                'Print-ready plans and schedules for classroom or home use',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border bg-card p-5">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
              <div>
                <p className="font-bold text-foreground text-sm">Privacy First</p>
                <p className="text-xs text-muted-foreground mt-0.5">Child names are never sent to AI services. Your data stays private.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border bg-card p-5">
              <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
              <div>
                <p className="font-bold text-foreground text-sm">Strengths-Based</p>
                <p className="text-xs text-muted-foreground mt-0.5">Every plan celebrates what a child can do, not just challenges.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border bg-card p-5">
              <Brain className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="font-bold text-foreground text-sm">Educator Control</p>
                <p className="text-xs text-muted-foreground mt-0.5">Every AI suggestion can be reviewed, modified, or rejected.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Section 4: Testimonial (warm muted bg) ── */}
      <div className="bg-section-warm">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
            <div className="mb-5 text-4xl">✨</div>
            <blockquote className="mb-5 text-lg font-medium leading-relaxed text-foreground">
              &ldquo;In minutes, Lumio generated a plan that referenced Marcus&apos;s love of trains to
              teach counting sequences. His engagement jumped immediately — it felt like it was
              made just for him.&rdquo;
            </blockquote>
            <p className="text-sm font-semibold text-muted-foreground">— Special Education Teacher, Grade 2</p>
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t bg-card/60 backdrop-blur-sm px-6 py-8 text-center">
        <div className="mx-auto max-w-2xl space-y-2">
          <p className="text-sm font-semibold text-foreground">
            Built with care for the 2026 Hackathon · Powered by Claude
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Educational tool only:</strong> Lumio does not provide medical diagnoses, clinical assessments, or therapeutic services. Always consult qualified professionals for medical or clinical advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
