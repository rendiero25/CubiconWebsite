import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

const PLANS = [
  {
    name: 'Starter',
    credits: 30,
    price: 'Rp39.000',
    badge: null,
    features: ['30 icons (1K res)', 'PNG transparent', 'All 5 styles', 'Basic support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Basic',
    credits: 100,
    price: 'Rp129.000',
    badge: null,
    features: ['100 icons mixed res', 'PNG transparent', 'All 5 styles', 'Remove background', 'Email support'],
    cta: 'Get Basic',
    highlight: false,
  },
  {
    name: 'Pro',
    credits: 300,
    price: 'Rp399.000',
    badge: '🔥 Most Popular',
    features: ['300 icons mixed res', 'PNG transparent', 'All 5 styles', 'Remove background', 'Variations ×3', 'Priority support'],
    cta: 'Get Pro',
    highlight: true,
  },
  {
    name: 'Studio',
    credits: 1000,
    price: 'Rp1.299.000',
    badge: '💎 Best Value',
    features: ['1000 icons mixed res', 'All resolutions', 'All 5 styles', 'Remove background', 'Variations ×3', 'Batch generation', 'Dedicated support'],
    cta: 'Get Studio',
    highlight: false,
  },
]

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-card', {
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
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
      <div className="text-center mb-12">
        <h2 className="font-display font-semibold text-2xl md:text-3xl text-[#1A1A1A]">
          Simple, credit-based pricing
        </h2>
        <p className="font-body text-base text-[#1A1A1A]/60 mt-2">
          Buy once, use anytime. No subscriptions, no expiry traps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map(plan => (
          <div
            key={plan.name}
            className={clsx(
              'pricing-card relative border-2 border-black rounded-md flex flex-col gap-5 p-6 transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
              plan.highlight
                ? 'bg-[#3B5BDB] text-white shadow-[6px_6px_0px_#000]'
                : 'bg-white text-[#1A1A1A] shadow-[4px_4px_0px_#000]'
            )}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span
                  className={clsx(
                    'font-body text-xs font-medium border-2 border-black px-3 py-1 rounded-full whitespace-nowrap',
                    plan.highlight ? 'bg-white text-[#3B5BDB]' : 'bg-[#3B5BDB] text-white'
                  )}
                >
                  {plan.badge}
                </span>
              </div>
            )}

            <div>
              <h3 className={clsx('font-display font-semibold text-lg', plan.highlight ? 'text-white' : 'text-[#1A1A1A]')}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={clsx('font-display font-extrabold text-2xl', plan.highlight ? 'text-white' : 'text-[#1A1A1A]')}>
                  {plan.price}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Zap size={12} className={plan.highlight ? 'text-white/80' : 'text-[#3B5BDB]'} />
                <span className={clsx('font-body text-xs', plan.highlight ? 'text-white/80' : 'text-[#1A1A1A]/60')}>
                  {plan.credits} credits
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-2 flex-1">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-start gap-2">
                  <Check size={14} className={clsx('mt-0.5 shrink-0', plan.highlight ? 'text-white' : 'text-[#3B5BDB]')} />
                  <span className={clsx('font-body text-xs', plan.highlight ? 'text-white/90' : 'text-[#1A1A1A]/70')}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/signup')}
              className={clsx(
                'font-display font-bold text-sm border-2 border-black px-4 py-2.5 rounded-md transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
                plan.highlight
                  ? 'bg-white text-[#3B5BDB] shadow-[3px_3px_0px_#000]'
                  : 'bg-[#3B5BDB] text-white shadow-[3px_3px_0px_#000]'
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="font-body text-xs text-center text-[#1A1A1A]/40 mt-6">
        Credits never expire · Secure payment via Mayar.id · IDR pricing
      </p>
    </section>
  )
}
