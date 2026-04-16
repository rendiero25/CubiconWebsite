import { Search, X } from 'lucide-react'
import clsx from 'clsx'

const STYLES = ['Clay Pastel', 'Realistic Dark', 'Neon Flat', 'Matte Minimal', 'Glass Morphism']
const RESOLUTIONS = ['1K', '2K', '4K']
const SORTS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Trending', value: 'trending' },
]

interface FilterBarProps {
  search: string
  style: string
  resolution: string
  sort: string
  onChange: (key: string, value: string) => void
}

export default function FilterBar({ search, style, resolution, sort, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-near-black/40 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="Search icons by description..."
          className="w-full pl-9 pr-9 py-2.5 border-2 border-[#0A1628] rounded-md font-body text-sm bg-white outline-none focus:border-electric-yellow transition-colors"
        />
        {search && (
          <button
            onClick={() => onChange('search', '')}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-near-black/40 hover:text-near-black"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={style}
          onChange={(e) => onChange('style', e.target.value)}
          className={clsx(
            'cursor-pointer border-2 border-[#0A1628] rounded-md px-3 py-1.5 font-body text-xs font-medium bg-white outline-none transition-colors',
            style && 'bg-light-green'
          )}
        >
          <option value="">All Styles</option>
          {STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={resolution}
          onChange={(e) => onChange('resolution', e.target.value)}
          className={clsx(
            'cursor-pointer border-2 border-[#0A1628] rounded-md px-3 py-1.5 font-body text-xs font-medium bg-white outline-none transition-colors',
            resolution && 'bg-light-green'
          )}
        >
          <option value="">All Resolutions</option>
          {RESOLUTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Sort — pushed to right */}
        <div className="flex gap-1 ml-auto">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => onChange('sort', s.value)}
              className={clsx(
                'cursor-pointer border-2 border-[#0A1628] rounded-md px-3 py-1.5 font-body text-xs font-medium transition-all',
                sort === s.value
                  ? 'bg-near-black text-white'
                  : 'bg-white text-near-black hover:bg-light-green'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
