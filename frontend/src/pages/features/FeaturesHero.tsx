import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import gsap from 'gsap'

const DEMO_ICONS = [
  { emoji: '🛒', label: 'Shopping Cart', color: '#FFF5CC', rotate: '-5deg' },
  { emoji: '🔔', label: 'Notification', color: '#FFF3E0', rotate: '4deg' },
  { emoji: '📊', label: 'Analytics', color: '#F3E8FF', rotate: '-3deg' },
  { emoji: '🚀', label: 'Launch', color: '#E8F5E9', rotate: '6deg' },
  { emoji: '🔒', label: 'Security', color: '#FDE8E8', rotate: '-4deg' },
]

export default function FeaturesHero() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()
  const iconsRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
      const cards = iconsRef.current?.querySelectorAll('.feat-icon')
      if (!cards) return
      gsap.from(cards, { y: 60, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 })
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 2.2 + i * 0.25,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.15,
        })
      })
    })
    return () => ctx.revert()
  }, [])

  const handleTry = () => {
    const q = prompt.trim()
    navigate(q ? '/app?prompt=' + encodeURIComponent(q) : '/app')
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left */}
        <div ref={headlineRef} className="flex-1 flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 border-2 border-[#0A1628] rounded-full px-4 py-1.5 bg-light-blue font-body text-sm font-medium w-fit shadow-[2px_2px_0px_#0A1628]">
            <Sparkles size={14} className="text-electric-yellow" />
            AI-Powered Icon Generation
          </span>

          <h1 className="font-display font-bold text-4xl md:text-5xl text-near-black leading-tight">
            Everything you need to{' '}
            <span className="text-electric-yellow">create perfect icons</span>
          </h1>

          <p className="font-body text-base text-near-black/60 max-w-lg">
            From prompt to production-ready 3D isometric icon in seconds. No design skills required — just describe what you need.
          </p>

          <div className="flex gap-2 max-w-md">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleTry() }}
              placeholder="Try: Notification bell"
              className="flex-1 border-2 border-[#0A1628] rounded-md px-3 py-2.5 font-body text-sm outline-none focus:border-electric-yellow transition-colors bg-white"
            />
            <button
              onClick={handleTry}
              className="cursor-pointer flex items-center gap-2 font-display font-bold text-sm px-4 py-2.5 bg-electric-yellow text-[#0A1628] border-2 border-[#0A1628] rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all whitespace-nowrap"
            >
              Try it <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right — floating icons */}
        <div ref={iconsRef} className="flex-1 flex flex-wrap justify-center gap-4">
          {DEMO_ICONS.map((icon) => (
            <div
              key={icon.label}
              className="feat-icon border-2 border-[#0A1628] rounded-xl p-5 shadow-[4px_4px_0px_#0A1628] flex flex-col items-center gap-2 w-28"
              style={{ backgroundColor: icon.color, transform: `rotate(${icon.rotate})` }}
            >
              <span className="text-4xl">{icon.emoji}</span>
              <span className="font-body text-xs font-medium text-near-black text-center">{icon.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
