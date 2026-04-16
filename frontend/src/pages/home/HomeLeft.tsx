import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import IconMarquee from './IconMarquee'

export default function HomeLeft() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  const go = () => {
    if (!prompt.trim()) return
    navigate(`/app?prompt=${encodeURIComponent(prompt.trim())}`)
  }

  return (
    <div className="flex flex-col w-full lg:w-[42%] xl:w-[44%] shrink-0 rounded-2xl bg-off-white overflow-hidden">
      {/* Hero content */}
      <div className="flex-1 flex flex-col justify-center gap-5 px-6 md:px-10 py-8 min-h-0">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FFF5CC] border-2 border-[#0A1628] px-3 py-1.5 rounded-md w-fit shadow-[2px_2px_0px_#0A1628]">
          <Sparkles size={13} className="text-[#FFC300]" />
          <span className="font-body text-xs font-semibold text-[#0A1628]">AI-Powered 3D Icon Generator</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-4xl xl:text-6xl text-[#0A1628] leading-[1.1]">
          Icons that{' '}
          <span className="relative inline-block">
            <span className="text-[#FFC300]">actually</span>
            <span className="absolute -bottom-0.5 left-0 w-full h-[3px] bg-[#FFC300] rounded-sm" />
          </span>
          <br />look 3D.
        </h1>

        {/* Sub */}
        <p className="font-body text-sm md:text-base text-[#0A1628]/65 max-w-xs leading-relaxed">
          Type what you need. AI renders a crisp 3D isometric icon in seconds — transparent PNG, ready to use.
        </p>

        {/* Prompt bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go()}
            placeholder="Shopping cart, analytics, rocket..."
            className="flex-1 font-body text-sm border-2 border-[#0A1628] rounded-md px-4 py-3 bg-white focus:outline-none focus:border-[#FFC300] shadow-[4px_4px_0px_#0A1628] placeholder:text-[#0A1628]/30 transition-shadow"
          />
          <button
            onClick={go}
            className="cursor-pointer font-display font-bold text-sm bg-[#FFC300] text-[#0A1628] border-2 border-[#0A1628] px-5 py-3 rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 whitespace-nowrap"
          >
            Generate <ArrowRight size={15} />
          </button>
        </div>

        {/* Social proof + cta link */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className="fill-[#FFC300] text-[#FFC300]" />
            ))}
            <span className="font-body text-xs text-[#0A1628]/50 ml-1">2 free icons · No card</span>
          </div>
          <Link
            to="/explore"
            className="font-body text-xs font-medium text-[#0A1628]/50 hover:text-[#FFC300] transition-colors underline underline-offset-4"
          >
            See examples →
          </Link>
        </div>
      </div>

      {/* Scrolling icons marquee */}
      <IconMarquee />
    </div>
  )
}
