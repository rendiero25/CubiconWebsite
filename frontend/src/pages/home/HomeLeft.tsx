import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import gsap from 'gsap'
import IconMarquee from './IconMarquee'

export default function HomeLeft() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    const children = contentRef.current.children
    gsap.fromTo(
      children,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'transform' }
    )
  }, [])

  const go = () => {
    if (!prompt.trim()) return
    navigate(`/app?prompt=${encodeURIComponent(prompt.trim())}`)
  }

  return (
    <div className="w-full lg:w-[42%] xl:w-[44%] shrink-0 flex flex-col pb-2 pr-0 lg:pr-1.5 mb-1 lg:mb-0">
      <div className="flex-1 py-7 sm:py-8 lg:py-10 2xl:py-15 3xl:py-20 4xl:py-30 flex flex-col justify-between bg-off-white border-2 border-near-black overflow-hidden rounded-md shadow-[3px_3px_0px_var(--color-electric-yellow)]">
        {/* Hero content */}
        <div ref={contentRef} className="flex flex-col justify-center gap-4 sm:gap-5 px-4 sm:px-6 md:px-10 min-h-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-light-green border-2 border-near-black px-3 py-1.5 rounded-md w-fit shadow-[2px_2px_0px_var(--color-near-black)]">
            <Sparkles size={13} className="text-electric-yellow" />
            <span className="font-body text-xs font-semibold text-near-black">Type. Generate. Ship.</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-3xl 2xl:text-7xl 4xl:text-8xl text-near-black leading-[1.1]">
            Icons that{' '}
            <span className="relative inline-block">
              <span className="text-electric-yellow">actually</span>
              <span className="absolute -bottom-0.5 left-0 w-full h-0.75 bg-electric-yellow rounded-sm" />
            </span>
            <br />look 3D.
          </h1>

          {/* Sub */}
          <p className="font-body text-sm md:text-base 2xl:text-lg 3xl:text-2xl 4xl:text-3xl text-near-black max-w-md 2xl:max-w-lg 3xl:max-w-xl 4xl:max-w-4xl leading-relaxed">
            Type what you need. Cubicon renders a crisp 3D icon in seconds — transparent PNG, ready to use.
          </p>

          {/* Prompt bar */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && go()}
              placeholder="Shopping cart, analytics, rocket..."
              className="flex-1 font-body text-sm border-2 border-near-black rounded-md px-4 py-3 bg-white focus:outline-none focus:border-electric-yellow shadow-[4px_4px_0px_var(--color-near-black)] placeholder:text-near-black/50 transition-shadow"
            />
            <button
              onClick={go}
              className="cursor-pointer font-display font-bold text-sm bg-electric-yellow text-near-black border-2 border-near-black px-5 py-3 rounded-md shadow-[4px_4px_0px_var(--color-near-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Generate <ArrowRight size={15} />
            </button>
          </div>

          {/* Social proof + cta link */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-row items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-electric-yellow text-electric-yellow mb-1" />
              ))}

              <span className="font-body text-xs text-near-black ml-1">2 free icons · No card</span>
            </div>

            <Link
              to="/explore"
              className="font-body text-xs font-medium text-near-black hover:text-electric-yellow transition-colors underline underline-offset-4"
            >
              See examples →
            </Link>
          </div>
        </div>

        {/* Scrolling icons marquee */}
        <IconMarquee />
      </div>
    </div>
  )
}
