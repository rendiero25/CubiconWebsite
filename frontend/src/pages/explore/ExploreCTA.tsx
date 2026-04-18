import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function ExploreCTA() {
  return (
    <section className="py-16 bg-near-black border-t-2 border-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-body text-xs font-semibold text-off-white/40 uppercase tracking-wider mb-2">
            Your turn
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-off-white">
            Ready to see your icon here?
          </h2>
          <p className="font-body text-sm text-off-white/60 mt-1">
            Generate 3D isometric icons from any description. Free to start.
          </p>
        </div>
        <Link
          to="/app"
          className="cursor-pointer shrink-0 flex items-center gap-2 bg-off-white text-near-black border-2 border-white font-display font-bold px-6 py-3 rounded-md shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <Sparkles size={16} />
          Start Generating Free
        </Link>
      </div>
    </section>
  )
}
