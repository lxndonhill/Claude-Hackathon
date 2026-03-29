'use client'

import { BookOpen } from 'lucide-react'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Loading…' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulse ring */}
          <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-primary/20" />
          {/* Inner icon container */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <BookOpen className="h-8 w-8 animate-bounce text-primary-foreground" style={{ animationDuration: '1.2s' }} />
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-extrabold text-foreground tracking-tight">Lumio</span>
          <span className="text-sm text-muted-foreground">{message}</span>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-primary/60"
              style={{
                animation: 'loadingDot 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
