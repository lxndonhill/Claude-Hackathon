'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, X } from 'lucide-react'

export function Disclaimer() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(localStorage.getItem('lumio-disclaimer-dismissed') === 'true')
  }, [])

  if (dismissed) return null

  function dismiss() {
    localStorage.setItem('lumio-disclaimer-dismissed', 'true')
    setDismissed(true)
  }

  return (
    <div className="flex items-start gap-2 border-b border-amber-200/60 bg-amber-50/70 px-4 py-2 text-xs text-amber-800">
      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
      <span className="flex-1">
        <strong>Educational tool only:</strong> Lumio is not a medical or clinical service. AI-generated plans are starting points — always use your professional judgement. Child names are never sent to AI services.
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss disclaimer"
        className="ml-2 flex-shrink-0 rounded p-0.5 text-amber-600 hover:bg-amber-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
