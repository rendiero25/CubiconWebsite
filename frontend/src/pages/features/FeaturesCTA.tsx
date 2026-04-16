import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function FeaturesCTA() {
  return (
    <section className="py-16 md:py-24 bg-electric-yellow">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/30 px-3 py-1 rounded-md mb-6">
          <Sparkles size={14} className="text-white" />
          <span className="font-body text-xs font-semibold text-white uppercase tracking-wider">
            Ready to start?
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight">
          Create your first 3D icon
          <br />
          <span className="text-light-green">completely free.</span>
        </h2>

        <p className="font-body text-base text-white/70 mt-4 max-w-md mx-auto">
          No credit card required. 2 free icons to try. Takes 30 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            to="/app"
            className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white text-electric-yellow border-2 border-[#0A1628] font-display font-bold px-6 py-3 rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Start Free <ArrowRight size={16} />
          </Link>
          <Link
            to="/pricing"
            className="cursor-pointer inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/40 font-display font-semibold px-6 py-3 rounded-md hover:bg-white/10 transition-all"
          >
            See Pricing
          </Link>
        </div>
      </div>
    </section>
  )
}
