import { useEffect, useRef } from 'react'
import { PenLine, Zap, Download } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    step: '01',
    icon: PenLine,
    title: 'Describe',
    description: 'Type the icon you want in plain words. Be specific or keep it simple — our AI gets it either way.',
    color: '#FFF5CC',
  },
  {
    step: '02',
    icon: Zap,
    title: 'Generate',
    description: 'Hit generate. Our AI renders a crisp 3D isometric icon in seconds, not minutes.',
    color: '#FFF3E0',
  },
  {
    step: '03',
    icon: Download,
    title: 'Download',
    description: 'Export as transparent PNG, ready to drop into your app, deck, or design file.',
    color: '#E8F5E9',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.step-card', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
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
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h2 className="font-display font-semibold text-2xl md:text-3xl text-[#0A1628]">
          How it works
        </h2>
        <p className="font-body text-base text-[#0A1628]/60 mt-2">
          From idea to icon in 3 steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map(({ step, icon: Icon, title, description, color }) => (
          <div
            key={step}
            className="step-card border-2 border-[#0A1628] rounded-md p-6 shadow-[4px_4px_0px_#0A1628] bg-white flex flex-col gap-4 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 border-2 border-[#0A1628] rounded-md flex items-center justify-center shadow-[2px_2px_0px_#0A1628]"
                style={{ backgroundColor: color }}
              >
                <Icon size={22} className="text-[#0A1628]" />
              </div>
              <span className="font-display font-extrabold text-4xl text-[#0A1628]/10">
                {step}
              </span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[#0A1628]">{title}</h3>
              <p className="font-body text-sm text-[#0A1628]/60 mt-1 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
