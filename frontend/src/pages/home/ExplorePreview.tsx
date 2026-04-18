import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = ['All', 'App', 'Finance', 'Nature', 'Tech', 'Social']

const MOCK_ICONS = [
  { emoji: '🛒', label: 'Shopping Cart', category: 'App', user: 'designr_io', color: '#FFF5CC' },
  { emoji: '💳', label: 'Credit Card', category: 'Finance', user: 'ui_labs', color: '#FFF3E0' },
  { emoji: '🌿', label: 'Leaf', category: 'Nature', user: 'ecodesign', color: '#E8F5E9' },
  { emoji: '⚙️', label: 'Settings', category: 'Tech', user: 'techcraft', color: '#F3E8FF' },
  { emoji: '📱', label: 'Mobile App', category: 'App', user: 'appstudio', color: '#FDE8E8' },
  { emoji: '📈', label: 'Analytics', category: 'Finance', user: 'dataviz', color: '#E8F0FF' },
  { emoji: '🔔', label: 'Notification', category: 'App', user: 'notifyco', color: '#FFF9E0' },
  { emoji: '🌐', label: 'Global', category: 'Tech', user: 'webstudio', color: '#FFF5CC' },
]

export default function ExplorePreview() {
  const [activeCategory, setActiveCategory] = useState('All')
  const sectionRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  const filtered = activeCategory === 'All'
    ? MOCK_ICONS
    : MOCK_ICONS.filter(icon => icon.category === activeCategory)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.explore-heading', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="explore" className="bg-light-green border-y-2 border-near-black py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="explore-heading flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display font-semibold text-2xl md:text-3xl text-near-black">
              Made by the community
            </h2>
            <p className="font-body text-sm text-near-black/60 mt-1">
              Icons generated and shared by Cubicon users.
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="cursor-pointer font-display font-bold text-sm bg-off-white border-2 border-near-black px-4 py-2 rounded-md shadow-[4px_4px_0px_near-black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 whitespace-nowrap"
          >
            View All
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                'font-body text-xs font-medium border-2 border-near-black px-3 py-1.5 rounded-md transition-all',
                activeCategory === cat
                  ? 'bg-electric-yellow text-near-black shadow-[2px_2px_0px_near-black]'
                  : 'bg-off-white text-near-black hover:bg-electric-yellow hover:text-near-black'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map(icon => (
            <div
              key={icon.label}
              className="group relative border-2 border-near-black rounded-md bg-off-white shadow-[4px_4px_0px_near-black] overflow-hidden cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <div
                className="h-32 flex items-center justify-center text-5xl"
                style={{ backgroundColor: icon.color }}
              >
                {icon.emoji}
              </div>
              <div className="p-3">
                <p className="font-display font-semibold text-sm text-near-black">{icon.label}</p>
                <p className="font-body text-xs text-near-black/50 mt-0.5">@{icon.user}</p>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-electric-yellow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => navigate(`/app?prompt=${encodeURIComponent(icon.label)}`)}
                  className="cursor-pointer font-display font-bold text-xs text-near-black border-2 border-near-black px-3 py-2 rounded-md flex items-center gap-1.5 hover:bg-near-black hover:text-electric-yellow transition-colors"
                >
                  <RefreshCw size={12} />
                  Generate Similar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
