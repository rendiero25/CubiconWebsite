import clsx from 'clsx'
import type { Angle } from './types'

const ANGLES: { value: Angle; label: string; icon: string }[] = [
  { value: 'isometric', label: 'Isometric', icon: '◈' },
  { value: 'front_34', label: 'Front 3/4', icon: '⬡' },
  { value: 'top_down', label: 'Top-Down', icon: '⊙' },
  { value: 'cinematic', label: 'Cinematic', icon: '◉' },
  { value: 'floating_sym', label: 'Floating Sym', icon: '⊛' },
]

interface Props {
  value: Angle
  onChange: (angle: Angle) => void
}

export default function StepAngle({ value, onChange }: Props) {
  return (
    <div>
      <p className="font-body text-sm font-medium text-near-black mb-2">Angle</p>
      <div className="flex flex-wrap gap-2">
        {ANGLES.map((a) => (
          <button
            key={a.value}
            onClick={() => onChange(a.value)}
            className={clsx(
              'cursor-pointer flex flex-col items-center gap-1 border-2 border-near-black rounded-md px-3 py-2 font-body text-xs font-medium transition-all',
              value === a.value
                ? 'bg-electric-yellow text-near-black shadow-[3px_3px_0px_near-black]'
                : 'bg-off-white text-near-black shadow-[2px_2px_0px_near-black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
            )}
          >
            <span className="text-lg">{a.icon}</span>
            <span className="whitespace-nowrap">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
