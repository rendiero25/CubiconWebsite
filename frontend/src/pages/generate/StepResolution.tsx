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
      <p className="font-body text-sm font-medium text-[#0A1628] mb-2">Resolution</p>
      <div className="flex gap-3">
        {RESOLUTIONS.map((r) => {
          const locked = isFreeUser && r !== '1K'
          return (
            <button
              key={r}
              onClick={() => (locked ? onLocked() : onChange(r))}
              className={clsx(
                'cursor-pointer relative flex-1 border-2 border-[#0A1628] rounded-md py-3 flex flex-col items-center gap-1 transition-all',
                value === r
                  ? 'bg-[#FFC300] text-[#0A1628] shadow-[3px_3px_0px_#0A1628]'
                  : locked
                    ? 'bg-off-white text-[#0A1628]/40 cursor-pointer hover:bg-light-green/50'
                    : 'bg-off-white text-[#0A1628] shadow-[2px_2px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
              )}
            >
              {locked && (
                <span className="absolute top-1.5 right-1.5">
                  <Lock size={12} className="text-[#0A1628]/40" />
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
