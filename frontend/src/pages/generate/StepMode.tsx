import clsx from 'clsx'
import type { GenerateMode } from './types'

interface Props {
  value: GenerateMode
  onChange: (mode: GenerateMode) => void
}

export default function StepMode({ value, onChange }: Props) {
  return (
    <div>
      <p className="font-body text-sm font-medium text-[#1A1A1A] mb-2">Mode</p>
      <div className="inline-flex border-2 border-black rounded-md overflow-hidden">
        {(['single', 'batch'] as GenerateMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={clsx(
              'cursor-pointer px-6 py-2 font-body font-medium text-sm capitalize transition-colors',
              value === mode
                ? 'bg-[#3B5BDB] text-white'
                : 'bg-white text-[#1A1A1A] hover:bg-[#E8EDFF]',
              mode === 'single' ? 'border-r-2 border-black' : '',
            )}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  )
}
