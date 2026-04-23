import clsx from 'clsx'
import type { GenerateMode } from './types'

const MODES: { value: GenerateMode; label: string; desc: string }[] = [
  { value: 'preset', label: 'Preset', desc: 'Pick style & angle' },
  { value: 'free', label: 'Free Prompt', desc: 'Write anything' },
]

interface Props {
  value: GenerateMode
  onChange: (mode: GenerateMode) => void
}

export default function StepMode({ value, onChange }: Props) {
  return (
    <div>
      <p className="font-body text-sm font-medium text-[#0A1628] mb-2">Mode</p>
      <div className="flex border-2 border-[#0A1628] rounded-md overflow-hidden">
        {MODES.map((m, i) => (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={clsx(
              'cursor-pointer flex-1 px-4 py-2.5 font-body font-medium text-sm transition-colors text-left',
              value === m.value
                ? 'bg-[#FFC300] text-[#0A1628]'
                : 'bg-off-white text-[#0A1628] hover:bg-light-green',
              i < MODES.length - 1 ? 'border-r-2 border-[#0A1628]' : '',
            )}
          >
            <span className="block font-semibold">{m.label}</span>
            <span className="block text-xs opacity-60">{m.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
