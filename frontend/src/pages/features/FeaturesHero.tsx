import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function FeaturesHero() {
  return (
    <section className="h-full flex items-center max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-light-green border-2 border-near-black px-3 py-1.5 rounded-md w-fit shadow-[2px_2px_0px_var(--color-near-black)]">
          <Sparkles size={13} className="text-near-black" />
          <span className="font-body text-xs font-semibold text-near-black">Built for creators</span>
        </div>

        <h1 className="font-display font-bold text-4xl md:text-5xl 2xl:text-6xl text-near-black leading-tight">
          Everything you need to{' '}
          <span className="text-electric-yellow">create perfect icons</span>
        </h1>

        <p className="font-body text-base 2xl:text-lg text-near-black/60 leading-relaxed">
          From prompt to production-ready 3D isometric icon in seconds. No design skills required — just describe what you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/app"
            className="cursor-pointer inline-flex items-center justify-center gap-2 bg-electric-yellow text-near-black border-2 border-near-black font-display font-bold px-6 py-3 rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Try Free <ArrowRight size={15} />
          </Link>
          <Link
            to="/pricing"
            className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white text-near-black border-2 border-near-black font-display font-semibold px-6 py-3 rounded-md hover:bg-off-white transition-all"
          >
            See Pricing
          </Link>
        </div>
      </div>
    </section>
  )
}
