import clsx from 'clsx'
import type { GenerateMode } from './types'

interface Props {
  value: GenerateMode
  onChange: (mode: GenerateMode) => void
}

export default function StepMode({ value, onChange }: Props) {
  return (
    <div>
      <p className="font-body text-sm font-medium text-[#0A1628] mb-2">Mode</p>
      <div className="inline-flex border-2 border-[#0A1628] rounded-md overflow-hidden">
        {(['single', 'batch'] as GenerateMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={clsx(
              'cursor-pointer px-6 py-2 font-body font-medium text-sm capitalize transition-colors',
              value === mode
                ? 'bg-[#FFC300] text-[#0A1628]'
                : 'bg-white text-[#0A1628] hover:bg-[#FFF5CC]',
              mode === 'single' ? 'border-r-2 border-[#0A1628]' : '',
            )}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  )
}
