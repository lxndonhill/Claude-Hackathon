'use client'

import { useTextSize } from '@/components/providers/TextSizeProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Moon, Settings, Sun, SunMoon, Type } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

type TextSize = 'small' | 'medium' | 'large'

const SIZE_OPTIONS: { value: TextSize; label: string; description: string; preview: string }[] = [
  { value: 'small', label: 'Small', description: 'Compact — fits more on screen', preview: 'Aa' },
  { value: 'medium', label: 'Medium', description: 'Default size — balanced readability', preview: 'Aa' },
  { value: 'large', label: 'Large', description: 'Larger — easier to read', preview: 'Aa' },
]

const PREVIEW_FONT_SIZE: Record<TextSize, string> = {
  small: 'text-lg',
  medium: 'text-2xl',
  large: 'text-4xl',
}

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: SunMoon },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const

export default function SettingsPage() {
  const { textSize, setTextSize } = useTextSize()
  const { theme, setTheme } = useTheme()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSelect(size: TextSize) {
    setSaving(true)
    setSaved(false)
    await setTextSize(size)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Customize your Lumio experience</p>
      </div>

      {/* Dark Mode */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <SunMoon className="h-4 w-4 text-primary" />
            Appearance
          </CardTitle>
          <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
                  theme === value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'
                )}
              >
                <Icon className="h-6 w-6 text-foreground" />
                <span className="text-sm font-bold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Type className="h-4 w-4 text-primary" />
            Text Size
          </CardTitle>
          <p className="text-sm text-muted-foreground">Choose how large text appears across the app</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
                  textSize === opt.value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'
                )}
              >
                <span className={cn('font-extrabold text-foreground', PREVIEW_FONT_SIZE[opt.value])}>
                  {opt.preview}
                </span>
                <span className="text-sm font-bold text-foreground">{opt.label}</span>
                <span className="text-xs text-muted-foreground leading-tight">{opt.description}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 h-5">
            {saving && <p className="text-xs text-muted-foreground">Saving…</p>}
            {saved && <p className="text-xs text-green-600 font-semibold">Saved!</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
