import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function FeaturesHero() {
  return (
    <section className="h-full bg-near-black overflow-y-auto flex items-center px-4 md:px-8 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-off-white/10 border-2 border-white/30 px-3 py-1.5 rounded-md w-fit">
            <Sparkles size={13} className="text-off-white" />
            <span className="font-body text-xs font-semibold text-off-white">Built for creators</span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl 2xl:text-6xl text-off-white leading-tight">
            Everything you need to{' '}
            <span className="text-electric-yellow">create perfect icons</span>
          </h1>

          <p className="font-body text-base 2xl:text-lg text-off-white/60 leading-relaxed">
            From prompt to production-ready 3D isometric icon in seconds. No design skills required — just describe what you need.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/app"
              className="cursor-pointer inline-flex items-center justify-center gap-2 bg-electric-yellow text-near-black border-2 border-electric-yellow font-display font-bold px-6 py-3 rounded-md shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
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
    </section>
  )
}
