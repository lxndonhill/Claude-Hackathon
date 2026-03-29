import { ShieldCheck } from 'lucide-react'

export function Disclaimer() {
  return (
    <div className="flex items-start gap-2 border-b border-amber-200/60 bg-amber-50/70 px-4 py-2 text-xs text-amber-800">
      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
      <span>
        <strong>Educational tool only:</strong> Lumio is not a medical or clinical service. AI-generated plans are starting points — always use your professional judgement. Child names are never sent to AI services.
      </span>
    </div>
  )
}
