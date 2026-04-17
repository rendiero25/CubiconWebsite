import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import clsx from 'clsx'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FeaturesHero from './features/FeaturesHero'
import FeaturesGrid from './features/FeaturesGrid'
import FeaturesCTA from './features/FeaturesCTA'

const PAGES = ['Overview', 'All Features', 'Get Started']

export default function Features() {
  const [idx, setIdx] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const goTo = (next: number) => {
    if (next < 0 || next >= PAGES.length) return
    setIdx(next)
    gsap.to(trackRef.current, {
      x: `-${next * (100 / PAGES.length)}%`,
      duration: 0.65,
      ease: 'power3.inOut',
    })
  }

  return (
    <div className="flex flex-col bg-near-black min-h-screen lg:h-screen lg:overflow-hidden">
      <Navbar noBorder />

      {/* Mobile: vertical scroll */}
      <div className="lg:hidden bg-off-white">
        <FeaturesHero />
        <FeaturesGrid />
        <FeaturesCTA />
        <Footer />
      </div>

      {/* Desktop: full-height horizontal pagination */}
      <div className="hidden lg:flex flex-1 min-h-0 flex-col">
        {/* Slide track */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <div
            ref={trackRef}
            className="flex h-full"
            style={{ width: `${PAGES.length * 100}%` }}
          >
            <div className="h-full overflow-y-auto bg-off-white" style={{ width: `${100 / PAGES.length}%` }}>
              <FeaturesHero />
            </div>
            <div className="h-full overflow-y-auto bg-near-black" style={{ width: `${100 / PAGES.length}%` }}>
              <FeaturesGrid />
            </div>
            <div className="h-full overflow-y-auto bg-electric-yellow flex items-center justify-center" style={{ width: `${100 / PAGES.length}%` }}>
              <FeaturesCTA />
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="shrink-0 flex items-center justify-between px-6 py-2.5 bg-near-black border-t border-white/10">
          <button
            onClick={() => goTo(idx - 1)}
            disabled={idx === 0}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded border border-white/20 text-white/60 hover:bg-electric-yellow hover:text-near-black hover:border-electric-yellow transition-colors disabled:opacity-25"
          >
            <ChevronLeft size={13} />
          </button>

          <div className="flex items-center gap-3">
            {PAGES.map((label, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={clsx(
                  'cursor-pointer font-body text-xs font-semibold transition-all px-3 py-1 rounded',
                  i === idx ? 'bg-electric-yellow text-near-black' : 'text-white/40 hover:text-white/80',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => goTo(idx + 1)}
            disabled={idx === PAGES.length - 1}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded border border-white/20 text-white/60 hover:bg-electric-yellow hover:text-near-black hover:border-electric-yellow transition-colors disabled:opacity-25"
          >
            <ChevronRight size={13} />
          </button>
        </div>

        <Footer noBorder />
      </div>
    </div>
  )
}
