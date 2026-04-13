import clsx from 'clsx'
import { Lock } from 'lucide-react'
import type { Resolution } from './types'
import { CREDIT_COST } from './types'

const RESOLUTIONS: Resolution[] = ['1K', '2K', '4K']

interface Props {
  value: Resolution
  onChange: (r: Resolution) => void
  isFreeUser: boolean
  onLocked: () => void
}

export default function StepResolution({ value, onChange, isFreeUser, onLocked }: Props) {
  return (
    <div>
      <p className="font-body text-sm font-medium text-[#1A1A1A] mb-2">Resolution</p>
      <div className="flex gap-3">
        {RESOLUTIONS.map((r) => {
          const locked = isFreeUser && r !== '1K'
          return (
            <button
              key={r}
              onClick={() => (locked ? onLocked() : onChange(r))}
              className={clsx(
                'cursor-pointer relative flex-1 border-2 border-black rounded-md py-3 flex flex-col items-center gap-1 transition-all',
                value === r
                  ? 'bg-[#3B5BDB] text-white shadow-[3px_3px_0px_#000]'
                  : locked
                    ? 'bg-white text-[#1A1A1A]/40 cursor-pointer hover:bg-[#E8EDFF]/50'
                    : 'bg-white text-[#1A1A1A] shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
              )}
            >
              {locked && (
                <span className="absolute top-1.5 right-1.5">
                  <Lock size={12} className="text-[#1A1A1A]/40" />
                </span>
              )}
              <span className="font-display font-bold text-base">{r}</span>
              <span className="font-body text-xs">{CREDIT_COST[r]} cr</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
