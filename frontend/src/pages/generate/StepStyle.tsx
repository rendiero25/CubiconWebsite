import clsx from 'clsx'
import type { IconStyle } from './types'

const STYLES: { value: IconStyle; label: string; icon: string }[] = [
  { value: 'clay_pastel', label: 'Clay Pastel', icon: '🏺' },
  { value: 'studio_float', label: 'Studio Float', icon: '📸' },
  { value: 'frosted_glass', label: 'Frosted Glass', icon: '🧊' },
  { value: 'obsidian', label: 'Obsidian', icon: '⚫' },
  { value: 'holographic', label: 'Holographic', icon: '🌈' },
  { value: 'soft_render', label: 'Soft Render', icon: '🎯' },
]

interface Props {
  value: IconStyle
  onChange: (style: IconStyle) => void
}

export default function StepStyle({ value, onChange }: Props) {
  return (
    <div>
      <p className="font-body text-sm font-medium text-near-black mb-2">Icon Style</p>
      <div className="flex flex-wrap gap-2">
        {STYLES.map((s) => (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            className={clsx(
              'cursor-pointer flex flex-col items-center gap-1 border-2 border-near-black rounded-md px-3 py-2 font-body text-xs font-medium transition-all',
              value === s.value
                ? 'bg-electric-yellow text-near-black shadow-[3px_3px_0px_near-black]'
                : 'bg-off-white text-near-black shadow-[2px_2px_0px_near-black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
            )}
          >
            <span className="text-lg">{s.icon}</span>
            <span className="whitespace-nowrap">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
