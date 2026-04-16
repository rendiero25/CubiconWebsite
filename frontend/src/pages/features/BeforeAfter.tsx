import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<'before' | 'after'>('before')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ba-col', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
      gsap.to(arrowRef.current, {
        x: 6,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: 'sine.inOut',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-light-blue border-2 border-[#0A1628] px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider mb-3">
            Before vs After
          </span>
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-near-black">
            See the difference
          </h2>
          <p className="font-body text-base text-near-black/60 mt-2">
            Same concept. Worlds apart in presentation.
          </p>
        </div>

        {/* Mobile toggle */}
        <div className="flex sm:hidden justify-center gap-2 mb-6">
          {(['before', 'after'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`cursor-pointer font-display font-semibold text-sm px-4 py-2 border-2 border-[#0A1628] rounded-md transition-all ${
                active === tab
                  ? 'bg-electric-yellow text-[#0A1628] shadow-[2px_2px_0_#0A1628]'
                  : 'bg-white text-near-black'
              }`}
            >
              {tab === 'before' ? 'Before' : 'After'}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-0 border-2 border-[#0A1628] rounded-md overflow-hidden shadow-[4px_4px_0px_#0A1628]">
          {/* Before */}
          <div
            className={`ba-col flex-1 bg-neutral-100 p-8 md:p-12 flex flex-col items-center justify-center gap-4 ${
              active === 'after' ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="text-7xl select-none">📦</div>
            <p className="font-body text-sm text-near-black/40 text-center">
              Generic flat icon from icon library
            </p>
            <span className="font-body text-xs font-semibold border border-neutral-300 text-neutral-400 px-2 py-0.5 rounded">
              BEFORE
            </span>
          </div>

          {/* Divider + Arrow */}
          <div className="hidden sm:flex flex-col items-center justify-center bg-near-black w-14 shrink-0">
            <div ref={arrowRef}>
              <ArrowRight size={22} className="text-white" />
            </div>
          </div>
          <div className="sm:hidden flex items-center justify-center bg-near-black h-10">
            <ArrowRight size={18} className="text-white rotate-90" />
          </div>

          {/* After */}
          <div
            className={`ba-col flex-1 bg-light-blue p-8 md:p-12 flex flex-col items-center justify-center gap-4 border-0 sm:border-l-2 border-[#0A1628] ${
              active === 'before' ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="relative">
              <div className="w-24 h-24 bg-electric-yellow border-2 border-[#0A1628] rounded-md shadow-[4px_4px_0px_#0A1628] flex items-center justify-center">
                <span className="text-4xl select-none">📦</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-electric-yellow border-2 border-[#0A1628] rounded-sm rotate-12" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-light-blue border-2 border-[#0A1628] rounded-sm -rotate-6" />
            </div>
            <p className="font-body text-sm text-near-black font-medium text-center">
              3D isometric icon from Cubicon
            </p>
            <span className="font-display text-xs font-bold bg-electric-yellow text-[#0A1628] border-2 border-[#0A1628] px-2 py-0.5 rounded shadow-[1px_1px_0_#0A1628]">
              CUBICON
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
