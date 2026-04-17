import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ImageOff } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FilterBar from './explore/FilterBar'
import IconCard from './explore/IconCard'
import ExploreCTA from './explore/ExploreCTA'
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

const INITIAL_FILTERS: Filters = { search: '', style: '', resolution: '', sort: 'latest' }
const PAGE_SIZE = 20

export default function Explore() {
  const { user } = useAuth()
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

  const handleToggleVisibility = async (id: string) => {
    // Optimistic: remove from explore list immediately (making private)
    setIcons((prev) => prev.filter((ic) => ic.id !== id))
    try {
      await supabase.from('icons').update({ is_public: false }).eq('id', id)
    } catch {
      // On failure, re-fetch to restore correct state
      fetchIcons(filters, 0, false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      {/* Header */}
      <section className="py-12 md:py-16 border-b-2 border-near-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 ">
          <span className="inline-block bg-light-green border-2 border-near-black px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider mb-4">
            Community
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-near-black">
            Explore the gallery
          </h1>
          <p className="font-body text-base text-near-black/60 mt-3 max-w-lg">
            Browse icons created by the community. Click any icon to generate something similar.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <section className="py-4 border-b-2 border-near-black bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 ">
          <FilterBar
            search={filters.search}
            style={filters.style}
            resolution={filters.resolution}
            sort={filters.sort}
            onChange={handleFilterChange}
          />
        </div>
      </section>

      {/* Grid */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 ">
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-14 h-14 bg-red-50 border-2 border-near-black rounded-md flex items-center justify-center shadow-[4px_4px_0_near-black]">
                <ImageOff size={22} className="text-red-400" />
              </div>
              <p className="font-body text-sm text-near-black/60">{error}</p>
            </div>
          ) : isLoading && icons.length === 0 ? (
            /* Skeleton */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="border-2 border-near-black rounded-md bg-white shadow-[4px_4px_0_near-black] overflow-hidden animate-pulse">
                  <div className="aspect-square bg-light-green/50" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-near-black/10 rounded w-3/4" />
                    <div className="h-3 bg-near-black/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : icons.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 gap-5">
              <div className="w-20 h-20 bg-light-green border-2 border-near-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_near-black]">
                <Sparkles size={32} className="text-electric-yellow" />
              </div>
              <div className="text-center">
                <p className="font-display font-semibold text-lg text-near-black">No icons yet</p>
                <p className="font-body text-sm text-near-black/60 mt-1 max-w-sm">
                  {filters.search || filters.style || filters.resolution
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {icons.map((icon) => (
                  <IconCard
                    key={icon.id}
                    icon={icon}
                    isOwner={icon.user_id === user?.id}
                    onToggleVisibility={handleToggleVisibility}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="border-2 border-near-black font-display font-bold px-8 py-3 rounded-md bg-white shadow-[4px_4px_0_near-black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <ExploreCTA />
      <Footer />
    </div>
  )
}
