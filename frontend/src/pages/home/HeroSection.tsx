import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import gsap from 'gsap'

const ICON_CARDS = [
  { emoji: '🛒', label: 'Shopping Cart', color: '#FFF5CC', rotate: '-6deg' },
  { emoji: '☁️', label: 'Cloud Storage', color: '#FFF3E0', rotate: '4deg' },
  { emoji: '📊', label: 'Analytics', color: '#F3E8FF', rotate: '-3deg' },
  { emoji: '🔒', label: 'Security', color: '#E8F5E9', rotate: '6deg' },
  { emoji: '💬', label: 'Chat', color: '#FDE8E8', rotate: '-5deg' },
  { emoji: '🚀', label: 'Launch', color: '#E8F0FF', rotate: '3deg' },
]

export default function HeroSection() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()
  const iconsRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline entrance
      gsap.from(headlineRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Icon cards staggered entrance + floating loop
      const cards = iconsRef.current?.querySelectorAll('.icon-card')
      if (!cards) return

      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
      })

      cards.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -12 : 12,
          duration: 2 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        })
      })
    })

    return () => ctx.revert()
  }, [])

  const handleGenerate = () => {
    if (!prompt.trim()) return
    navigate(`/app?prompt=${encodeURIComponent(prompt.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate()
  }

  return (
    <section className="min-h-[90vh] flex flex-col lg:flex-row items-center gap-12 lg:gap-0 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
      {/* Left — Text + Prompt */}
      <div ref={headlineRef} className="flex-1 flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 bg-light-green border-2 border-[#0A1628] px-3 py-1.5 rounded-md w-fit shadow-[2px_2px_0px_#0A1628]">
          <Sparkles size={14} className="text-[#FFC300]" />
          <span className="font-body text-xs font-medium text-[#FFC300]">AI-Powered Icon Generator</span>
        </div>

        <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-[#0A1628] leading-tight">
          Icons that{' '}
          <span className="relative inline-block">
            <span className="text-[#FFC300]">actually</span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#FFC300] rounded-sm" />
          </span>
          {' '}look 3D.
        </h1>

        <p className="font-body text-base md:text-lg text-[#0A1628]/70 max-w-md leading-relaxed">
          Type what you need. Our AI renders a stunning 3D isometric icon in seconds.
          Download PNG — transparent, crisp, ready to use.
        </p>

        {/* Mini Prompt Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Shopping cart, cloud storage, analytics..."
            className="flex-1 font-body text-sm border-2 border-[#0A1628] rounded-md px-4 py-3 bg-white focus:outline-none focus:border-[#FFC300] shadow-[4px_4px_0px_#0A1628] placeholder:text-[#0A1628]/40 transition-shadow"
          />
          <button
            onClick={handleGenerate}
            className="cursor-pointer font-display font-bold text-sm bg-[#FFC300] text-[#0A1628] border-2 border-[#0A1628] px-6 py-3 rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 whitespace-nowrap"
          >
            Generate
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4 mt-1">
          <button
            onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-body text-sm font-medium text-[#0A1628]/60 underline underline-offset-4 hover:text-[#FFC300] transition-colors"
          >
            See Examples
          </button>
          <span className="font-body text-xs text-[#0A1628]/40">2 free icons on signup · No credit card needed</span>
        </div>
      </div>

      {/* Right — Animated Icon Showcase */}
      <div ref={iconsRef} className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-sm h-80 md:h-96">
          {ICON_CARDS.map((card, i) => (
            <div
              key={card.label}
              className="icon-card absolute border-2 border-[#0A1628] rounded-md shadow-[4px_4px_0px_#0A1628] flex flex-col items-center justify-center gap-1 cursor-default"
              style={{
                backgroundColor: card.color,
                transform: `rotate(${card.rotate})`,
                width: 88,
                height: 88,
                top: `${[10, 5, 45, 50, 15, 55][i]}%`,
                left: `${[5, 50, 65, 15, 30, 45][i]}%`,
              }}
            >
              <span className="text-3xl">{card.emoji}</span>
              <span className="font-body text-[10px] font-medium text-[#0A1628]/60 text-center px-1 leading-tight">{card.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
