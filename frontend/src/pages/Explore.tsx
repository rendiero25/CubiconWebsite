import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ImageOff } from 'lucide-react'
import gsap from 'gsap'
import Navbar, { type NavColors } from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FilterBar from './explore/FilterBar'
import IconCard from './explore/IconCard'
import { getPublicIcons } from '../api/icons'
import type { PublicIcon } from '../api/icons'
import { supabase } from '../api/supabase'
import { useAuth } from '../hooks/useAuth'

interface Filters {
  search: string
  style: string
  resolution: string
  sort: string
}

// ─── EXPLORE PAGE — NAVBAR COLOR OVERRIDE ────────────────────────────────────
const EXPLORE_NAV_COLORS: Partial<NavColors> = {
  bg:                'bg-near-black',
  logo:              'text-electric-yellow',
  logoHover:         'hover:text-light-green',
  link:              'text-off-white/70',
  linkHover:         'hover:text-electric-yellow',
  linkActive:        'text-electric-yellow',
  creditBadgeBg:     'bg-light-green',
  creditBadgeBorder: 'border-near-black',
  creditBadgeText:   'text-near-black',
  creditBadgeIcon:   'text-electric-yellow',
  dashboardBg:       'bg-electric-yellow',
  dashboardText:     'text-near-black',
  dashboardBorder:   'border-near-black',
  dashboardShadow:   'shadow-[3px_3px_0px_var(--color-light-green)]',
  loginText:         'text-electric-yellow',
  loginHover:        'hover:text-off-white',
  startFreeBg:       'bg-electric-yellow',
  startFreeText:     'text-near-black',
  startFreeBorder:   'border-near-black',
  startFreeShadow:   'shadow-[3px_3px_0px_var(--color-light-green)]',
  mobileBg:          'bg-off-white',
  mobileLinkColor:   'text-near-black',
  mobileToggle:      'border-electric-yellow text-electric-yellow',
}
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_FILTERS: Filters = { search: '', style: '', resolution: '', sort: 'latest' }
const PAGE_SIZE = 21 // multiple of 3 → fills columns evenly

export default function Explore() {
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const [icons, setIcons] = useState<PublicIcon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)

  const fetchIcons = useCallback(async (f: Filters, p: number, append = false) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getPublicIcons({
        search: f.search || undefined,
        style: f.style || undefined,
        resolution: f.resolution || undefined,
        sort: f.sort as 'latest' | 'trending',
        page: p,
        limit: PAGE_SIZE,
      })
      setIcons((prev) => (append ? [...prev, ...data] : data))
      setHasMore(data.length === PAGE_SIZE)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load icons')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(0)
    fetchIcons(filters, 0, false)
  }, [filters, fetchIcons])

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    fetchIcons(filters, next, true)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // GSAP: stagger entrance per column (column-flow order), then subtle float on middle row
  useEffect(() => {
    if (isLoading || icons.length === 0) return
    const container = iconsRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll<HTMLElement>('.icon-card-item')
      if (!cards.length) return

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.88 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: { each: 0.05, from: 'start' },
          ease: 'power3.out',
          clearProps: 'scale,y',
          onComplete() {
            // Only float the middle row (index % 3 === 1) — safe from clip boundaries
            cards.forEach((card, i) => {
              if (i % 3 !== 1) return
              gsap.to(card, {
                y: -6,
                duration: 2 + (i % 5) * 0.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: (i % 7) * 0.2,
              })
            })
          },
        }
      )
    }, container)

    return () => ctx.revert()
  }, [isLoading])

  const handleToggleVisibility = async (id: string) => {
    setIcons((prev) => prev.filter((ic) => ic.id !== id))
    try {
      await supabase.from('icons').update({ is_public: false }).eq('id', id)
    } catch {
      fetchIcons(filters, 0, false)
    }
  }

  const GRID_CLS = 'grid grid-rows-3 2xl:grid-rows-4 3xl:grid-rows-5 grid-flow-col auto-cols-[180px] gap-3'

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-off-white">
      <div className="shrink-0">
        <Navbar colors={EXPLORE_NAV_COLORS} />
      </div>

      {/* Filter bar */}
      <div className="shrink-0 p-4 bg-off-white">
        <div className="max-w-7xl mx-auto">
          <FilterBar
            style={filters.style}
            sort={filters.sort}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Icons — 3-row column-flow grid, horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex-1 flex overflow-x-auto overflow-y-hidden px-8 py-4 gap-6 scrollbar-hide"
      >
        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 bg-red-50 border-2 border-near-black rounded-md flex items-center justify-center shadow-[4px_4px_0_near-black]">
              <ImageOff size={22} className="text-red-400" />
            </div>
            <p className="font-body text-sm text-near-black/60">{error}</p>
          </div>
        ) : isLoading && icons.length === 0 ? (
          <div className={`${GRID_CLS} shrink-0`}>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="border-2 border-near-black rounded-md bg-off-white shadow-[4px_4px_0_#0A1628] overflow-hidden animate-pulse"
              >
                <div className="h-full bg-light-green/50" />
              </div>
            ))}
          </div>
        ) : icons.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <div className="w-20 h-20 bg-light-green border-2 border-near-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_near-black]">
              <Sparkles size={32} className="text-electric-yellow" />
            </div>
            <div className="text-center">
              <p className="font-display font-semibold text-lg text-near-black">No icons yet</p>
              <p className="font-body text-sm text-near-black/60 mt-1 max-w-sm">
                {filters.style
                  ? 'No icons match your filters. Try adjusting your search.'
                  : 'Be the first to share an icon with the community!'}
              </p>
            </div>
            <Link
              to="/app"
              className="cursor-pointer flex items-center gap-2 bg-electric-yellow text-near-black border-2 border-near-black font-display font-bold px-5 py-2.5 rounded-md shadow-[4px_4px_0_near-black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <Sparkles size={14} /> Generate First Icon
            </Link>
          </div>
        ) : (
          <>
            {/* Grid: top→bottom per column, then wraps to next column */}
            <div ref={iconsRef} className={`${GRID_CLS} shrink-0`}>
              {icons.map((icon) => (
                <div
                  key={icon.id}
                  className="icon-card-item group overflow-hidden hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  <IconCard
                    icon={icon}
                    isOwner={icon.user_id === user?.id}
                    onToggleVisibility={handleToggleVisibility}
                  />
                </div>
              ))}
            </div>

            {/* Load More — lives outside the grid as a flex sibling */}
            {hasMore && (
              <div className="shrink-0 self-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="border-2 border-near-black font-display font-bold px-5 py-3 rounded-md bg-off-white shadow-[4px_4px_0_near-black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  {isLoading ? 'Loading...' : 'Load More →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  )
}
