import { useState } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import type { FormState } from './types'
import { calcCost, getBatchLines } from './types'

const STYLE_LABELS: Record<string, string> = {
  'clay-pastel': '🏺 Clay Pastel',
  'realistic-dark': '🖤 Realistic Dark',
  'neon-flat': '🌈 Neon Flat',
  'matte-minimal': '🤍 Matte Minimal',
  'glass-morphism': '🔮 Glass Morphism',
}

interface Props {
  form: FormState
  credits: number
  isAdmin?: boolean
  onCancel: () => void
  onConfirm: (withVariation: boolean) => void
}

export default function ConfirmModal({ form, credits, isAdmin, onCancel, onConfirm }: Props) {
  const [variation, setVariation] = useState(false)

  const baseCost = calcCost({ ...form, variation: false })
  const totalCost = variation ? baseCost * 3 : baseCost
  const canAfford = isAdmin || credits >= totalCost

  const batchLines = getBatchLines(form.batchText)
  const promptPreview =
    form.mode === 'batch'
      ? batchLines[0] + (batchLines.length > 1 ? ` +${batchLines.length - 1} more` : '')
      : form.prompt

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-off-white border-2 border-[#0A1628] rounded-md shadow-[8px_8px_0px_#0A1628] w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#0A1628]">
          <h2 className="font-display font-bold text-lg text-near-black">Ready to generate?</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-light-blue rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Summary */}
          <div className="bg-white border-2 border-[#0A1628] rounded-md p-3 flex flex-col gap-1">
            <p className="font-body text-sm font-medium text-near-black">📦 {promptPreview}</p>
            <p className="font-body text-sm text-near-black/60">
              {STYLE_LABELS[form.style]} · {form.resolution} · {form.background}
            </p>
          </div>

          {/* Variation toggle */}
          <div className="border-2 border-[#0A1628] rounded-md p-3 bg-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-body text-sm font-medium text-near-black">✨ Variations ×3</p>
                <p className="font-body text-xs text-near-black/50">
                  Generate 3 variations of your icon
                </p>
              </div>
              <button
                onClick={() => setVariation((p) => !p)}
                className={clsx(
                  'relative w-12 h-6 rounded-full border-2 border-[#0A1628] transition-colors shrink-0',
                  variation ? 'bg-electric-yellow' : 'bg-white',
                )}
              >
                <span
                  className={clsx(
                    'absolute top-0.5 w-4 h-4 bg-white border-2 border-[#0A1628] rounded-full transition-all',
                    variation ? 'left-6' : 'left-0.5',
                  )}
                />
              </button>
            </div>
          </div>

          {/* Cost row */}
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-near-black/60">💳 Total cost</p>
            <div className="text-right">
              <p className="font-display font-bold text-base text-near-black">
                {totalCost} credit{totalCost !== 1 ? 's' : ''}
              </p>
              {variation && (
                <p className="font-body text-xs text-near-black/40">×3 variation</p>
              )}
            </div>
          </div>

          {!canAfford && (
            <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              Not enough credits. Turn off variations or upgrade your plan.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer flex-1 font-body font-medium text-sm py-2.5 border-2 border-[#0A1628] rounded-md bg-white hover:bg-light-blue transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => canAfford && onConfirm(variation)}
            disabled={!canAfford}
            className={clsx(
              'cursor-pointer flex-1 font-display font-bold text-sm py-2.5 border-2 border-[#0A1628] rounded-md transition-all',
              canAfford
                ? 'bg-electric-yellow text-[#0A1628] shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                : 'bg-electric-yellow/40 text-[#0A1628] cursor-not-allowed',
            )}
          >
            Generate Now ✨
          </button>
        </div>
      </div>
    </div>
  )
}
