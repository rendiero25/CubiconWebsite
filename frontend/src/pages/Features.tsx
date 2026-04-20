import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar, { type NavColors } from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Wand2, Box, ImageDown, Eraser, Zap, FileImage, History, CreditCard } from 'lucide-react'

const FEATURES = [
  { icon: Wand2,      title: 'AI Generation',      description: 'Generate icons from text in seconds. Powered by Google Gemini.' },
  { icon: Box,        title: '3D Isometric Style',  description: 'Consistent, clean 3D isometric look. Production-ready, every time.' },
  { icon: ImageDown,  title: 'Multi Resolution',    description: 'Export at 1K, 2K, or 4K. Perfect for any screen density.' },
  { icon: Eraser,     title: 'Remove Background',   description: 'Auto-transparent PNG background. Drop straight into your design.' },
  { icon: Zap,        title: 'Fast Render',          description: 'Results in seconds, not minutes. Iterate without waiting.' },
  { icon: FileImage,  title: 'PNG Export',           description: 'Universal PNG format. Works in Figma, Sketch, web, and print.' },
  { icon: History,    title: 'Generation History',   description: 'Every icon you generate is saved in your dashboard forever.' },
  { icon: CreditCard, title: 'Credit System',        description: 'Pay only for what you use. No subscriptions, no expiry traps.' },
]

gsap.registerPlugin(ScrollTrigger)

// ─── FEATURES PAGE — NAVBAR COLOR OVERRIDE ───────────────────────────────────
const FEATURES_NAV_COLORS: Partial<NavColors> = {
  bg:                'bg-electric-yellow',
  logo:              'text-near-black',
  logoHover:         'hover:text-off-white',
  link:              'text-near-black',
  linkHover:         'hover:text-off-white',
  linkActive:        'text-off-white',
  creditBadgeBg:     'bg-near-black',
  creditBadgeBorder: 'border-near-black',
  creditBadgeText:   'text-off-white',
  creditBadgeIcon:   'text-electric-yellow',
  dashboardBg:       'bg-near-black',
  dashboardText:     'text-electric-yellow',
  dashboardBorder:   'border-near-black',
  dashboardShadow:   'shadow-[3px_3px_0px_var(--color-off-white)]',
  loginText:         'text-near-black',
  loginHover:        'hover:text-off-white',
  startFreeBg:       'bg-near-black',
  startFreeText:     'text-electric-yellow',
  startFreeBorder:   'border-near-black',
  startFreeShadow:   'shadow-[3px_3px_0px_var(--color-off-white)]',
  mobileBg:          'bg-electric-yellow',
  mobileLinkColor:   'text-near-black',
  mobileToggle:      'border-near-black text-near-black',
}
// ─────────────────────────────────────────────────────────────────────────────

const PANELS = 3

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth < 1280) return

    const ctx = gsap.context(() => {
      const travelDistance = trackRef.current!.scrollWidth - window.innerWidth

      gsap.to(trackRef.current, {
        x: -travelDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: `+=${travelDistance}`,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-near-black">
      <div ref={containerRef} className="xl:h-screen xl:flex xl:flex-col">
        <Navbar noBorder colors={FEATURES_NAV_COLORS} />

        <div className="xl:flex-1 xl:min-h-0 xl:overflow-hidden">
          <div
            ref={trackRef}
            className="flex flex-col xl:flex-row xl:items-center xl:h-full"
          >
            {/* HERO */}
            <div className="xl:shrink-0 xl:w-[42vw] xl:h-full flex items-center px-4 md:px-8 lg:px-16 py-16">
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 bg-off-white/10 border-2 border-white/30 px-3 py-1.5 rounded-md w-fit">
                  <Sparkles size={13} className="text-off-white" />
                  <span className="font-body text-xs font-semibold text-off-white">Built for creators</span>
                </div>
                <h1 className="font-display font-extrabold text-4xl md:text-4xl 2xl:text-6xl text-off-white leading-tight">
                  Everything you need to{' '}
                  <span className="text-electric-yellow">create perfect icons</span>
                </h1>
                <p className="font-body text-base md:text-lg text-off-white leading-relaxed max-w-lg">
                  From prompt to production-ready 3D isometric icon in seconds. No design skills required — just describe what you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/app"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 bg-electric-yellow text-near-black border-2 border-near-black font-display font-bold px-6 py-3 rounded-md shadow-[4px_4px_0px_var(--color-off-white)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    Try Free <ArrowRight size={15} />
                  </Link>
                  <Link
                    to="/pricing"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 bg-transparent text-off-white border-2 border-white/40 font-display font-semibold px-6 py-3 rounded-md hover:bg-off-white/10 transition-all"
                  >
                    See Pricing
                  </Link>
                </div>
              </div>
            </div>

            {/* FEATURES */}
            <div className="xl:shrink-0 xl:w-[96vw] xl:h-full xl:overflow-y-auto flex items-center py-16">
              <div className="px-4 md:px-8 lg:px-16 w-full">
                <div className="mb-8 md:mb-10">
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-electric-yellow">
                    Packed with everything you need
                  </h2>
                  <p className="font-body text-base text-off-white mt-2">
                    No plugins, no extra tools. It's all here.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {FEATURES.map(({ icon: Icon, title, description }) => (
                    <div
                      key={title}
                      className="border-2 border-near-black rounded-md p-5 bg-light-green shadow-[4px_4px_0px_var(--color-electric-yellow)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex flex-col items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-[#0A1628]">
                        <Icon size={18} className="text-light-green" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-sm md:text-base text-near-black">{title}</p>
                        <p className="font-body text-xs text-near-black/70 mt-1.5 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="xl:shrink-0 xl:w-[42vw] xl:h-full flex items-center px-4 md:px-8 lg:px-16 py-16">
              <div className="w-full xl:flex xl:flex-col xl:items-end">
                <div className="inline-flex items-center gap-2 bg-off-white/10 border-2 border-white/30 px-3 py-1 rounded-md mb-6 w-fit">
                  <Sparkles size={14} className="text-off-white" />
                  <span className="font-body text-xs font-semibold text-off-white uppercase tracking-wider">
                    Ready to start?
                  </span>
                </div>
                <h2 className="font-display font-bold text-3xl md:text-4xl 2xl:text-5xl text-off-white leading-tight xl:text-end">
                  Create your first 3D icon
                  <br />
                  <span className="text-light-green">completely free.</span>
                </h2>
                <p className="font-body text-base text-off-white mt-4 xl:text-end max-w-md">
                  No credit card required. 2 free icons to try. Takes 30 seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Link
                    to="/app"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 bg-electric-yellow text-near-black border-2 border-near-black font-display font-bold px-6 py-3 rounded-md shadow-[4px_4px_0px_var(--color-off-white)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    Start Free <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/pricing"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 bg-transparent text-off-white border-2 border-white/40 font-display font-semibold px-6 py-3 rounded-md hover:bg-off-white/10 transition-all"
                  >
                    See Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  )
}
