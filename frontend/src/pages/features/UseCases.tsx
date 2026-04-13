import { useEffect, useRef } from 'react'
import { Terminal, Video, Rocket } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CASES = [
//   {
//     icon: Figma,
//     role: 'UI/UX Designer',
//     tagline: 'Consistent icon sets, instantly',
//     description:
//       'Stop hunting for icon packs. Generate custom 3D isometric icons that match your design system — in seconds.',
//     bg: '#E8EDFF',
//   },
  {
    icon: Terminal,
    role: 'Developer',
    tagline: 'Ship without a designer',
    description:
      'Need icons for your side project? Type a prompt, get a PNG. No Figma, no waiting on a designer.',
    bg: '#FFF3E0',
  },
  {
    icon: Video,
    role: 'Content Creator',
    tagline: 'Elevate thumbnails & decks',
    description:
      'Make your thumbnails, slide decks, and social posts stand out with professional 3D icons.',
    bg: '#F3E8FF',
  },
  {
    icon: Rocket,
    role: 'Startup / Product Team',
    tagline: 'Brand assets without the agency',
    description:
      'Build a cohesive visual identity fast. Create all the icons you need for your product on launch day.',
    bg: '#E8F5E9',
  },
]

export default function UseCases() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.uc-card', {
        y: 40,
        opacity: 0,
        duration: 0.55,
        stagger: 0.12,
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-light-blue border-2 border-black px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider mb-3">
            Use Cases
          </span>
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-near-black">
            Built for the people who build
          </h2>
          <p className="font-body text-base text-near-black/60 mt-2">
            Whoever you are, Cubicon saves you time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CASES.map(({ icon: Icon, role, tagline, description, bg }) => (
            <div
              key={role}
              className="uc-card border-2 border-black rounded-md p-6 bg-white shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex gap-4 items-start"
            >
              <div
                className="w-12 h-12 shrink-0 border-2 border-black rounded-md flex items-center justify-center shadow-[2px_2px_0_#000]"
                style={{ backgroundColor: bg }}
              >
                <Icon size={20} className="text-near-black" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-electric-blue uppercase tracking-wide">
                  {role}
                </p>
                <p className="font-display font-semibold text-base text-near-black mt-0.5">
                  {tagline}
                </p>
                <p className="font-body text-sm text-near-black/60 mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
