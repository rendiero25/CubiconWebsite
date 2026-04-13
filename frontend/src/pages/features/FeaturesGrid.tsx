import { useEffect, useRef } from 'react'
import { Wand2, Box, ImageDown, Eraser, Zap, FileImage, History, CreditCard } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    icon: Wand2,
    title: 'AI Generation',
    description: 'Generate icons from text in seconds. Powered by Google Gemini.',
    color: '#E8EDFF',
  },
  {
    icon: Box,
    title: '3D Isometric Style',
    description: 'Consistent, clean 3D isometric look. Production-ready, every time.',
    color: '#FFF3E0',
  },
  {
    icon: ImageDown,
    title: 'Multi Resolution',
    description: 'Export at 1K, 2K, or 4K. Perfect for any screen density.',
    color: '#F3E8FF',
  },
  {
    icon: Eraser,
    title: 'Remove Background',
    description: 'Auto-transparent PNG background. Drop straight into your design.',
    color: '#E8F5E9',
  },
  {
    icon: Zap,
    title: 'Fast Render',
    description: 'Results in seconds, not minutes. Iterate without waiting.',
    color: '#FDE8E8',
  },
  {
    icon: FileImage,
    title: 'PNG Export',
    description: 'Universal PNG format. Works in Figma, Sketch, web, and print.',
    color: '#E8F0FF',
  },
  {
    icon: History,
    title: 'Generation History',
    description: 'Every icon you generate is saved in your dashboard forever.',
    color: '#FFF8E1',
  },
  {
    icon: CreditCard,
    title: 'Credit System',
    description: 'Pay only for what you use. No subscriptions, no expiry traps.',
    color: '#F0FFF4',
  },
]

export default function FeaturesGrid() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feat-card', {
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
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
    <section ref={sectionRef} className="bg-near-black py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-white">
            Packed with everything you need
          </h2>
          <p className="font-body text-base text-white/50 mt-2">
            No plugins, no extra tools. It's all here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="feat-card border-2 border-white/20 rounded-md p-5 bg-white/5 hover:bg-white/10 transition-colors flex flex-col gap-3"
            >
              <div
                className="w-10 h-10 rounded-md border-2 border-black flex items-center justify-center shrink-0"
                style={{ backgroundColor: color }}
              >
                <Icon size={18} className="text-near-black" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-white">{title}</p>
                <p className="font-body text-xs text-white/50 mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
