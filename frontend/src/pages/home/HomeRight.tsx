import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft, ChevronRight, Check, Zap,
  PenLine, Box, ImageDown, Eraser, FileImage, History, CreditCard,
  Mail, ArrowRight, Sparkles, Star,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import gsap from 'gsap'

/* ─── DATA ──────────────────────────────────────────────── */
const STEPS = [
  { step: '01', Icon: PenLine, title: 'Describe', desc: 'Type the icon you want in plain words. Be specific or keep it simple — Cubicon understands either way.', color: '#FFF5CC' },
  { step: '02', Icon: Zap,     title: 'Generate', desc: 'Hit generate. Cubicon renders a crisp fantastic 3D icon in seconds, not minutes!', color: '#FFF9E0' },
  { step: '03', Icon: Box,     title: 'Download', desc: 'Download as transparent PNG and ready to drop into any app, deck, or design file.', color: '#FFF5CC' },
]

const PLANS = [
  { name: 'Starter', price: 'Rp 39.000',    credits: 30,   features: ['30 icons mixed', 'All 7 styles', 'Batch generation', 'Variations x3', 'High Res'], badge: undefined },
  { name: 'Basic',   price: 'Rp 129.000',   credits: 100,  features: ['100 icons mixed', 'All 7 styles', 'Batch generation', 'Variations x3', 'High Res'], badge: undefined },
  { name: 'Pro',     price: 'Rp 399.000',   credits: 300,  features: ['300 icons mixed', 'All 7 styles', 'Batch generation', 'Variations x3', 'High Res'], badge: 'Popular' },
  { name: 'Studio',  price: 'Rp 1.299.000', credits: 1000, features: ['1000 icons mixed', 'All 7 styles', 'Batch generation', 'Variations x3', 'High Res'], badge: 'Best Value' },
]

const ALL_FEATURES = [
  { Icon: PenLine,    title: 'AI Generation',    desc: 'Generate from text in seconds via Gemini.' },
  { Icon: Box,        title: '3D Isometric',     desc: 'Consistent clean look, every single time.' },
  { Icon: ImageDown,  title: 'Multi Resolution', desc: '1K, 2K, or 4K — perfect for any screen.' },
  { Icon: Eraser,     title: 'Remove BG',        desc: 'Auto-transparent PNG, no extra tools.' },
  { Icon: Zap,        title: 'Fast Render',      desc: 'Results in seconds, not minutes.' },
  { Icon: FileImage,  title: 'PNG Export',       desc: 'Works in Figma, Sketch, web, and print.' },
  { Icon: History,    title: 'History',          desc: 'All icons saved in your dashboard.' },
  { Icon: CreditCard, title: 'Credit System',    desc: 'Pay only for what you use.' },
]
// 1 feature per page, slide 4 = "see all"
const FEATURE_PAGES = ALL_FEATURES.slice(0, 3)
const FEATURE_TOTAL = FEATURE_PAGES.length + 1

const REVIEWS = [
  { name: 'Andi S.',  role: 'UI Designer',     text: 'Cubicon saved me hours. The 3D icons are consistent and download-ready instantly.', rating: 5 },
  { name: 'Rina P.',  role: 'Startup Founder', text: 'We use Cubicon for all our product icons. The quality is insane for the price.', rating: 5 },
  { name: 'Budi K.',  role: 'Freelance Dev',   text: 'Transparent PNG export works perfectly. No Photoshop needed at all.', rating: 5 },
  { name: 'Sari M.',  role: 'Product Manager', text: 'Style consistency across all icons is what I love most. Team is happy!', rating: 4 },
]

const UPDATES = [
  { tag: 'New', text: 'Batch generation — generate up to 10 icons at once.' },
  { tag: 'New', text: 'Reference image support — upload a style reference.' },
  { tag: 'Fix', text: 'Faster background removal, now 40% quicker.' },
]

/* ─── PAGINATION DOTS ────────────────────────────────────── */
function PaginationDots({ total, idx, setIdx, isDark = false }: {
  total: number; idx: number; setIdx: (i: number) => void; isDark?: boolean
}) {
  return (
    <div className="flex gap-1.5 shrink-0">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => setIdx(i)}
          className={clsx(
            'rounded-full transition-all cursor-pointer',
            i === idx
              ? 'bg-[#FFC300] flex-[3] h-[5px]'
              : clsx('flex-1 h-[3px]', isDark ? 'bg-white/20' : 'bg-[#0A1628]/15'),
          )} />
      ))}
    </div>
  )
}

/* ─── NAV ARROWS ─────────────────────────────────────────── */
function NavArrows({ idx, total, setIdx, isDark = false }: {
  idx: number; total: number; setIdx: (i: number) => void; isDark?: boolean
}) {
  return (
    <div className="flex gap-1">
      <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
        className={clsx(
          'cursor-pointer w-6 h-6 flex items-center justify-center rounded disabled:opacity-25 hover:bg-[#FFC300] transition-colors border',
          isDark ? 'border-white/20 text-white/60' : 'border-[#0A1628]/20',
        )}>
        <ChevronLeft size={11} />
      </button>
      <button onClick={() => setIdx(Math.min(total - 1, idx + 1))} disabled={idx === total - 1}
        className={clsx(
          'cursor-pointer w-6 h-6 flex items-center justify-center rounded disabled:opacity-25 hover:bg-[#FFC300] transition-colors border',
          isDark ? 'border-white/20 text-white/60' : 'border-[#0A1628]/20',
        )}>
        <ChevronRight size={11} />
      </button>
    </div>
  )
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function HomeRight() {
  const [stepIdx,   setStepIdx]   = useState(0)
  const [planIdx,   setPlanIdx]   = useState(0)
  const [featIdx,   setFeatIdx]   = useState(0)
  const [reviewIdx, setReviewIdx] = useState(0)
  const navigate = useNavigate()

  const step   = STEPS[stepIdx]
  const plan   = PLANS[planIdx]
  const review = REVIEWS[reviewIdx]
  const isSeeAll = featIdx === FEATURE_PAGES.length
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.children
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out', clearProps: 'transform' }
    )
  }, [])

  return (
    <div className="flex-1 overflow-y-auto lg:overflow-hidden pb-2 pl-1.5 pr-1">
      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-2 gap-3 lg:h-full lg:grid-rows-3">

        {/* ── HOW IT WORKS ── */}
        <div className="bg-white border-2 border-[#0A1628] rounded-md p-3 sm:p-4 flex flex-col gap-2 shadow-[3px_3px_0px_#FFC300] overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[10px] font-bold text-near-black uppercase">How It Works</span>
            <NavArrows idx={stepIdx} total={STEPS.length} setIdx={setStepIdx} />
          </div>
          <div className="flex items-start gap-3 lg:flex-1 lg:min-h-0 overflow-hidden">
            <div className="w-9 h-9 shrink-0 border-2 border-[#0A1628] rounded-md flex items-center justify-center shadow-[2px_2px_0px_#0A1628]"
              style={{ backgroundColor: step.color }}>
              <step.Icon size={16} className="text-[#0A1628]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="font-display font-extrabold text-4xl text-near-black/20 leading-none shrink-0">{step.step}</span>
                <h3 className="font-display font-bold text-base text-near-black">{step.title}</h3>
              </div>
              <p className="font-body text-xs sm:text-sm text-near-black leading-relaxed line-clamp-3">{step.desc}</p>
            </div>
          </div>
          <PaginationDots total={STEPS.length} idx={stepIdx} setIdx={setStepIdx} />
        </div>

        {/* ── PRICING ── */}
        <div className="bg-light-green border-2 border-[#0A1628] rounded-md p-3 sm:p-4 flex flex-col gap-2 shadow-[3px_3px_0px_#FFFCF2] overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[10px] font-bold text-near-black uppercase">Pricing</span>
            <NavArrows idx={planIdx} total={PLANS.length} setIdx={setPlanIdx} />
          </div>
          <div className="flex flex-col gap-1.5 lg:flex-1 lg:min-h-0 overflow-hidden pr-0.5">
            <div className=''>
              <div className="flex items-center gap-2">
                <p className="font-display font-bold text-base text-[#0A1628] leading-tight">{plan.name}</p>
                {plan.badge && (
                  <span className="font-body text-[9px] font-semibold bg-[#FFC300] text-[#0A1628] border border-[#0A1628] px-1.5 py-0.5 rounded-full shrink-0">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="font-display font-extrabold text-lg text-[#0A1628]">{plan.price}</p>
              <div className="flex items-center gap-1">
                <Zap size={10} className="text-[#FFC300]" />
                <span className="font-body text-[10px] text-near-black">{plan.credits} credits</span>
              </div>
            </div>
            <ul className="flex flex-col gap-1 lg:flex-1 lg:min-h-0 overflow-hidden">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-1.5 shrink-0">
                  <Check size={10} className="text-near-black shrink-0" />
                  <span className="font-body text-xs text-near-black truncate">{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/signup')}
              className="cursor-pointer w-full font-display font-bold text-xs bg-[#FFC300] text-[#0A1628] border-2 border-[#0A1628] py-1.5 mb-1 rounded-md shadow-[2px_2px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all shrink-0">
              Get {plan.name}
            </button>
          </div>
          <PaginationDots total={PLANS.length} idx={planIdx} setIdx={setPlanIdx} />
        </div>

        {/* ── FEATURES ── */}
        <div className="bg-near-black border-2 border-[#FFC300]/50 rounded-md shadow-[3px_3px_0px_#FFC300] p-3 sm:p-4 flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[10px] font-bold text-[#FFC300] uppercase">Features</span>
            <NavArrows idx={featIdx} total={FEATURE_TOTAL} setIdx={setFeatIdx} isDark />
          </div>
          {/* min-h fallback for mobile (no fixed card height); lg:flex-1 takes over on desktop */}
          <div className="min-h-[90px] sm:min-h-[100px] lg:flex-1 lg:min-h-0 overflow-hidden">
            {isSeeAll ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <p className="font-body text-xs text-white leading-relaxed">
                  8 powerful features to supercharge your icon workflow.
                </p>
                <Link to="/features"
                  className="flex items-center gap-1.5 bg-[#FFC300] text-[#0A1628] border-2 border-[#FFC300] font-display font-bold text-xs px-4 py-2 rounded-md hover:bg-white transition-colors">
                  See All <ArrowRight size={10} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 h-full justify-center">
                {(() => { const { Icon: FIcon, title, desc } = FEATURE_PAGES[featIdx]; return (
                  <>
                    <div className="w-10 h-10 shrink-0 border border-[#FFC300]/30 rounded-md flex items-center justify-center bg-white/5">
                      <FIcon size={18} className="text-[#FFC300]" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-base text-white">{title}</p>
                      <p className="font-body text-xs text-electric-yellow leading-relaxed mt-1">{desc}</p>
                    </div>
                  </>
                )})()}
              </div>
            )}
          </div>
          <PaginationDots total={FEATURE_TOTAL} idx={featIdx} setIdx={setFeatIdx} isDark />
        </div>

        {/* ── REVIEWS ── */}
        <div className="bg-off-white border-2 border-[#0A1628] rounded-md p-3 sm:p-4 flex flex-col gap-2 shadow-[3px_3px_0px_#FFC300] overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[10px] font-bold text-near-black uppercase">User Reviews</span>
            <NavArrows idx={reviewIdx} total={REVIEWS.length} setIdx={setReviewIdx} />
          </div>
          <div className="flex flex-col gap-1.5 lg:flex-1 lg:min-h-0 overflow-hidden">
            <div className="flex gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11}
                  className={clsx(i < review.rating ? 'text-[#FFC300] fill-[#FFC300]' : 'text-[#0A1628]/15 fill-[#0A1628]/10')} />
              ))}
            </div>
            <p className="font-body text-xs sm:text-sm text-near-black leading-relaxed line-clamp-3">"{review.text}"</p>
            <div className="shrink-0 mt-auto">
              <p className="font-display font-bold text-sm text-[#0A1628]">{review.name}</p>
              <p className="font-body text-[10px] text-navy-muted">{review.role}</p>
            </div>
          </div>
          <PaginationDots total={REVIEWS.length} idx={reviewIdx} setIdx={setReviewIdx} />
        </div>

        {/* ── UPDATES ── */}
        <div className="shadow-[3px_3px_0px_#FFFCF2] bg-light-green border-2 border-[#0A1628] rounded-md p-3 sm:p-4 flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles size={11} className="text-[#0A1628]" />
            <span className="font-body text-[10px] font-bold text-near-black uppercase">What is New</span>
          </div>
          <div className="flex flex-col gap-2 lg:flex-1 lg:min-h-0 overflow-hidden">
            {UPDATES.map(({ tag, text }) => (
              <div key={text} className="flex items-start gap-2">
                <span className={clsx(
                  'font-body text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5',
                  tag === 'New' ? 'bg-[#FFC300] text-near-black' : 'bg-[#0A1628]/10 text-[#0A1628]/60',
                )}>{tag}</span>
                <p className="font-body text-xs text-[#0A1628]/70 leading-relaxed line-clamp-2">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div className="bg-[#FFC300] border-2 border-[#0A1628] rounded-md p-3 sm:p-4 flex flex-col gap-2 shadow-[3px_3px_0px_#FFF5CC] overflow-hidden">
          <span className="font-body text-[10px] font-bold text-near-black uppercase shrink-0">Contact</span>
          <div className="lg:flex-1 lg:min-h-0 overflow-hidden flex flex-col gap-1">
            <p className="font-display font-bold text-base text-[#0A1628]">Get in touch</p>
            <p className="font-body text-xs text-near-black">Questions, feedback, or partnership?</p>
            <a href="mailto:hello@cubicon.app" className="flex items-center gap-1.5 font-body text-sm font-medium text-[#0A1628] underline underline-offset-2 hover:no-underline mt-2 lg:mt-auto">
              <Mail size={15} /> hello@cubicon.app
            </a>
          </div>
          <Link to="/contact"
            className="cursor-pointer w-full text-center font-display font-bold text-xs bg-[#0A1628] text-white border-2 border-[#0A1628] py-1.5 rounded-md hover:bg-white hover:text-[#0A1628] transition-colors flex items-center justify-center gap-1 shrink-0">
            Contact Us <ArrowRight size={10} />
          </Link>
        </div>

      </div>
    </div>
  )
}
