import clsx from 'clsx'

const STYLES = [
  { value: 'clay-pastel',      label: 'Clay Pastel' },
  { value: 'realistic-dark',   label: 'Realistic Dark' },
  { value: 'neon-flat',        label: 'Neon Flat' },
  { value: 'matte-minimal',    label: 'Matte Minimal' },
  { value: 'glass-morphism',   label: 'Glass Morphism' },
]

interface FilterBarProps {
  style: string
  sort: string
  onChange: (key: string, value: string) => void
}

export default function FilterBar({ style, sort, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Style pills + Sort toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Style pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange('style', '')}
            className={clsx(
              'cursor-pointer border-2 border-[#0A1628] rounded-full px-4 py-1.5 font-body text-xs font-semibold transition-all',
              !style
                ? 'bg-near-black text-off-white shadow-[2px_2px_0px_#0A1628]'
                : 'bg-off-white text-near-black hover:bg-light-green'
            )}
          >
            All
          </button>
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => onChange('style', style === s.value ? '' : s.value)}
              className={clsx(
                'cursor-pointer border-2 border-[#0A1628] rounded-full px-4 py-1.5 font-body text-xs font-semibold transition-all',
                style === s.value
                  ? 'bg-near-black text-off-white shadow-[2px_2px_0px_#0A1628]'
                  : 'bg-off-white text-near-black hover:bg-light-green'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Latest / Trending toggle */}
        <div className="flex border-2 border-[#0A1628] rounded-md overflow-hidden shrink-0">
          {(['latest', 'trending'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onChange('sort', s)}
              className={clsx(
                'cursor-pointer px-4 py-1.5 font-body text-xs font-semibold capitalize transition-all',
                sort === s
                  ? 'bg-near-black text-off-white'
                  : 'bg-off-white text-near-black hover:bg-light-green',
                s === 'trending' && 'border-l-2 border-[#0A1628]'
              )}
            >
              {s === 'latest' ? 'Latest' : 'Trending'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
