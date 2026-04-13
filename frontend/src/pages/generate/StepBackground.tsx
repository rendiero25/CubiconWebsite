import clsx from 'clsx'
import type { BackgroundType } from './types'

const OPTIONS: { value: BackgroundType; label: string }[] = [
  { value: 'transparent', label: 'Transparent' },
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
]

interface Props {
  value: BackgroundType
  bgColor: string
  bgGradient: [string, string]
  onChange: (v: BackgroundType) => void
  onBgColorChange: (v: string) => void
  onBgGradientChange: (v: [string, string]) => void
}

export default function StepBackground({
  value,
  bgColor,
  bgGradient,
  onChange,
  onBgColorChange,
  onBgGradientChange,
}: Props) {
  return (
    <div>
      <p className="font-body text-sm font-medium text-[#1A1A1A] mb-2">Background</p>
      <div className="flex gap-2 mb-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'cursor-pointer flex-1 border-2 border-black rounded-md py-2 font-body text-xs font-medium transition-colors',
              value === opt.value
                ? 'bg-[#3B5BDB] text-white'
                : 'bg-white text-[#1A1A1A] hover:bg-[#E8EDFF]',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {value === 'solid' && (
        <div className="flex items-center gap-3">
          <label className="font-body text-xs text-[#1A1A1A]">Color</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onBgColorChange(e.target.value)}
            className="w-8 h-8 border-2 border-black rounded cursor-pointer"
          />
          <span className="font-body text-xs text-[#1A1A1A]/50">{bgColor}</span>
        </div>
      )}

      {value === 'gradient' && (
        <div className="flex items-center gap-3 flex-wrap">
          <label className="font-body text-xs text-[#1A1A1A]">From</label>
          <input
            type="color"
            value={bgGradient[0]}
            onChange={(e) => onBgGradientChange([e.target.value, bgGradient[1]])}
            className="w-8 h-8 border-2 border-black rounded cursor-pointer"
          />
          <label className="font-body text-xs text-[#1A1A1A]">To</label>
          <input
            type="color"
            value={bgGradient[1]}
            onChange={(e) => onBgGradientChange([bgGradient[0], e.target.value])}
            className="w-8 h-8 border-2 border-black rounded cursor-pointer"
          />
          <div
            className="h-6 w-16 rounded border border-black/20"
            style={{ background: `linear-gradient(to right, ${bgGradient[0]}, ${bgGradient[1]})` }}
          />
        </div>
      )}
    </div>
  )
}
