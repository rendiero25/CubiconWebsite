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

const USE_CASES = [
  {
    label: 'UI/UX Designer',
    tags: ['UI Design', 'Icon System', 'Figma', 'Design Token'],
    desc: 'Buat icon set yang konsisten untuk desain atau produk digital kamu.',
    cta: 'Lihat Contoh',
    to: '/explore',
  },
  {
    label: 'Marketing & Branding',
    tags: ['Social Media', 'Ads', 'Branding', 'Konten'],
    desc: 'Tingkatkan visual konten marketing dengan ikon 3D kelas dunia.',
    cta: 'Mulai Gratis',
    to: '/signup',
  },
  {
    label: 'Developer & Startup',
    tags: ['Web App', 'Mobile', 'Dokumentasi', 'Pitch Deck'],
    desc: 'Landing page hingga pitch deck, hasilkan ikon yang profesional.',
    cta: 'Coba Sekarang',
    to: '/signup',
  },
]

/* ─── PAGINATION DOTS ────────────────────────────────────── */
function PaginationDots({ total, idx, setIdx, isDark = false, isDarkDots = false }: {
  total: number; idx: number; setIdx: (i: number) => void; isDark?: boolean; isDarkDots?: boolean
}) {
  return (
    <div className="flex gap-1.5 shrink-0">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => setIdx(i)}
          className={clsx(
            'rounded-full transition-all cursor-pointer',
            i === idx
              ? clsx('flex-3 h-1.25', isDarkDots ? 'bg-near-black' : 'bg-electric-yellow')
              : clsx('flex-1 h-0.75', isDarkDots ? 'bg-near-black/30' : isDark ? 'bg-white/20' : 'bg-near-black/15'),
          )} />
      ))}
    </div>
  )
}

/* ─── NAV ARROWS ─────────────────────────────────────────── */
function NavArrows({ idx, total, setIdx, isDark = false, nextRef }: {
  idx: number; total: number; setIdx: (i: number) => void; isDark?: boolean; nextRef?: React.RefObject<HTMLButtonElement>
}) {
  return (
    <div className="flex gap-1">
      <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
        className={clsx(
          'cursor-pointer w-6 h-6 flex items-center justify-center rounded disabled:opacity-25 hover:bg-electric-yellow transition-colors border',
          isDark ? 'border-white/20 text-white/60' : 'border-near-black/20',
        )}>
        <ChevronLeft size={11} />
      </button>

      <button 
        ref={nextRef}
        onClick={() => setIdx(Math.min(total - 1, idx + 1))} disabled={idx === total - 1}
        className={clsx(
          'cursor-pointer w-6 h-6 flex items-center justify-center rounded disabled:opacity-25 hover:bg-electric-yellow transition-colors border',
          isDark ? 'border-white/20 text-white/60' : 'border-near-black/20',
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
  const [ucIdx,     setUcIdx]     = useState(0)
  const navigate = useNavigate()
  const ucNextRef = useRef<HTMLButtonElement>(null)

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

  // Auto-play all carousels
  useEffect(() => {
    const intervals = [
      setInterval(() => setStepIdx(prev => (prev + 1) % STEPS.length), 6000),
      setInterval(() => setPlanIdx(prev => (prev + 1) % PLANS.length), 7500),
      setInterval(() => setFeatIdx(prev => (prev + 1) % FEATURE_TOTAL), 6700),
      setInterval(() => setReviewIdx(prev => (prev + 1) % REVIEWS.length), 8000),
      setInterval(() => {
        setUcIdx(prev => (prev + 1) % USE_CASES.length)
        if (ucNextRef.current) {
          gsap.to(ucNextRef.current, { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' })
        }
      }, 7000),
    ]
    return () => intervals.forEach(clearInterval)
  }, [])

  return (
    <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden pb-2 pl-1.5 pr-1">
      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-2 2xl:gap-3 lg:h-full lg:grid-rows-3 2xl:grid-rows-4">

        {/* ── HOW IT WORKS ── */}
        <div className="bg-white border-2 border-near-black rounded-md p-3 sm:p-4 flex flex-col gap-2 shadow-[3px_3px_0px_var(--color-electric-yellow)] overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[10px] font-bold text-near-black uppercase">How It Works</span>
            <NavArrows idx={stepIdx} total={STEPS.length} setIdx={setStepIdx} />
          </div>

          <div className="flex items-start gap-3 lg:flex-1 lg:min-h-0 overflow-hidden">
            <div className="w-9 h-9 shrink-0 border-2 border-near-black rounded-md flex items-center justify-center shadow-[2px_2px_0px_var(--color-near-black)]"
              style={{ backgroundColor: step.color }}>
              <step.Icon size={16} className="text-near-black" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="font-display font-extrabold text-4xl  text-near-black/20 leading-none shrink-0">{step.step}</span>
                <h3 className="font-display font-bold text-base text-near-black">{step.title}</h3>
              </div>

              <p className="2xl:mt-3 font-body text-xs 2xl:text-sm 3xl:text-lg 4xl:text-3xl text-near-black leading-relaxed line-clamp-3">{step.desc}</p>
            </div>
          </div>

          <PaginationDots total={STEPS.length} idx={stepIdx} setIdx={setStepIdx} />
        </div>

        {/* ── PRICING ── */}
        <div className="bg-light-green border-2 border-near-black rounded-md p-3 sm:p-4 flex flex-col gap-2 shadow-[3px_3px_0px_var(--color-off-white)] overflow-hidden 2xl:row-span-2">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[10px] font-bold text-near-black uppercase">Pricing</span>
            <NavArrows idx={planIdx} total={PLANS.length} setIdx={setPlanIdx} />
          </div>
          <div className="flex flex-col gap-1.5 lg:flex-1 lg:min-h-0 overflow-hidden pr-0.5">
            <div className=''>
              <div className="flex flex-col items-start 2xl:gap-2">
                <p className="font-display font-bold text-base 2xl:text-2xl text-near-black leading-tight">{plan.name}</p>
                {plan.badge && (
                  <span className="font-body text-[9px] font-semibold bg-electric-yellow text-near-black border border-near-black px-1.5 py-0.5 rounded-full shrink-0">
                    {plan.badge}
                  </span>
                )}
                
                <p className="font-display font-extrabold text-lg 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl text-near-black">{plan.price}</p>
                
                <div className="flex items-center gap-1">
                  <Zap size={10} className="text-electric-yellow" />
                  <span className="font-body font-bold text-[10px] 2xl:text-sm text-near-black">{plan.credits} credits</span>
                </div>
              </div>
            </div>
            {/* Below 2xl: truncated horizontal */}
            <ul className="2xl:hidden flex flex-row gap-1 lg:flex-1 lg:min-h-0 overflow-hidden items-center">
              {plan.features.slice(0, 3).map(f => (
                <li key={f} className="flex items-center gap-1 shrink-0">
                  <Check size={10} className="text-near-black shrink-0" />
                  <span className="font-body text-[10px] text-near-black">{f}</span>
                </li>
              ))}
              <li className="font-body text-xs text-near-black/40 shrink-0">···</li>
            </ul>

            {/* 2xl+: full vertical list */}
            <ul className="hidden 2xl:flex flex-col gap-1.5 2xl:gap-0 flex-1 min-h-0 overflow-hidden">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-1.5 4xl:gap-3 4xl:mt-4 shrink-0">
                  <Check size={11} className="text-near-black shrink-0" />
                  <span className="font-body text-xs 2xl:text-lg 4xl:text-3xl text-near-black">{f}</span>
                </li>
              ))}
            </ul>

            <button onClick={() => navigate('/signup')}
              className="cursor-pointer w-full font-display font-bold text-xs bg-electric-yellow text-near-black border-2 border-near-black py-1.5 2xl:py-3 mb-1 rounded-md shadow-[2px_2px_0px_var(--color-near-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all shrink-0">
              Get {plan.name}
            </button>
          </div>
          <PaginationDots total={PLANS.length} idx={planIdx} setIdx={setPlanIdx} />
        </div>

        {/* ── USE CASES (2xl+) ── */}
        <div className="hidden 2xl:flex col-span-1 bg-electric-yellow border-2 border-near-black rounded-md p-4 flex-col gap-3 shadow-[3px_3px_0px_var(--color-off-white)] overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[9px] font-bold text-near-black uppercase">Made for</span>
            <NavArrows idx={ucIdx} total={USE_CASES.length} setIdx={setUcIdx} nextRef={ucNextRef} />
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-sm  text-near-black leading-snug">
                {USE_CASES[ucIdx].label}
              </h3>

              <div className="flex flex-wrap gap-2 mt-2">
                {USE_CASES[ucIdx].tags.map(tag => (
                  <span key={tag} className="font-body text-xs font-medium bg-light-green text-near-black px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-row justify-between items-center min-w-0 gap-4 h-full">
              <p className="font-body text-xs 2xl:text-sm 3xl:text-lg 4xl:text-3xl text-near-black leading-relaxed line-clamp-3">
                {USE_CASES[ucIdx].desc}
              </p>
              
              <Link to={USE_CASES[ucIdx].to}
                className="inline-flex items-center gap-1.5 mt-2 mr-1 bg-near-black text-white border-2 border-near-black font-display font-bold text-xs px-3 py-1.5 rounded-md shadow-[2px_2px_0px_var(--color-light-green)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all whitespace-nowrap">
                {USE_CASES[ucIdx].cta} <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          <PaginationDots total={USE_CASES.length} idx={ucIdx} setIdx={setUcIdx} isDarkDots />
        </div>

        {/* ── FEATURES ── */}
        <div className="bg-near-black border-2 border-electric-yellow/50 rounded-md shadow-[3px_3px_0px_var(--color-electric-yellow)] p-3 sm:p-4 flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[10px] font-bold text-electric-yellow uppercase">Features</span>
            <NavArrows idx={featIdx} total={FEATURE_TOTAL} setIdx={setFeatIdx} isDark />
          </div>
          
          {/* min-h fallback for mobile (no fixed card height); flex-1 takes over */}
          <div className="flex-1 min-h-22.5 lg:min-h-0 overflow-hidden">
            {isSeeAll ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <p className="font-body text-xs 2xl:text-xl 4xl:text-3xl text-white leading-relaxed">
                  8 powerful features to supercharge your icon workflow.
                </p>
                <Link to="/features"
                  className="flex items-center gap-1.5 bg-electric-yellow text-near-black border-2 border-electric-yellow font-display font-bold text-xs px-4 py-2 rounded-md hover:bg-white transition-colors">
                  See All <ArrowRight size={10} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 h-full">
                {(() => { const { Icon: FIcon, title, desc } = FEATURE_PAGES[featIdx]; return (
                  <>
                    <div className='flex flex-row items-center justify-start gap-4'>
                      <div className="w-10 h-10 shrink-0 border border-electric-yellow/30 rounded-md flex items-center justify-center bg-white/5">
                        <FIcon size={18} className="text-electric-yellow" />
                      </div>

                      <p className="font-display font-bold text-base text-white">{title}</p>
                    </div>
                      
                    <div>
                      <p className="font-body text-xs 2xl:text-lg 4xl:text-3xl text-electric-yellow leading-relaxed mt-1">{desc}</p>
                    </div>
                  </>
                )})()}
              </div>
            )}
          </div>
          <PaginationDots total={FEATURE_TOTAL} idx={featIdx} setIdx={setFeatIdx} isDark />
        </div>

        {/* ── REVIEWS ── */}
        <div className="bg-off-white border-2 border-near-black rounded-md p-3 sm:p-4 flex flex-col gap-2 shadow-[3px_3px_0px_var(--color-electric-yellow)] overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[10px] font-bold text-near-black uppercase">User Reviews</span>
            <NavArrows idx={reviewIdx} total={REVIEWS.length} setIdx={setReviewIdx} />
          </div>
          <div className="flex flex-col gap-1.5 lg:flex-1 lg:min-h-0 overflow-hidden">
            <div className="flex gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={10}
                  className={clsx(i < review.rating ? 'text-electric-yellow fill-electric-yellow' : 'text-near-black/15 fill-near-black/10')} />
              ))}
            </div>
            <p className="font-body text-xs 2xl:text-sm 3xl:text-lg 4xl:text-3xl text-near-black leading-relaxed line-clamp-3">"{review.text}"</p>
            <div className="shrink-0 mt-auto">
              <p className="font-display font-bold text-sm text-near-black">{review.name}</p>
              <p className="font-body text-[10px] text-navy-muted">{review.role}</p>
            </div>
          </div>
          <PaginationDots total={REVIEWS.length} idx={reviewIdx} setIdx={setReviewIdx} />
        </div>

        {/* ── UPDATES ── */}
        <div className="shadow-[3px_3px_0px_var(--color-off-white)] bg-light-green border-2 border-near-black rounded-md p-3 sm:p-4 flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles size={11} className="text-near-black" />
            <span className="font-body text-[10px] font-bold text-near-black uppercase">What is New</span>
          </div>

          <div className="flex flex-col gap-2 lg:flex-1 lg:min-h-0 overflow-hidden">
            {UPDATES.map(({ tag, text }) => (
              <div key={text} className="flex items-start gap-2">
                <span className={clsx(
                  'font-body text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5',
                  tag === 'New' ? 'bg-electric-yellow text-near-black' : 'bg-near-black/30 text-near-black/60',
                )}>{tag}</span>
                <p className="font-body text-xs 2xl:text-sm 3xl:text-md 4xl:text-xl text-near-black leading-relaxed line-clamp-2">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div className="bg-electric-yellow border-2 border-near-black rounded-md p-3 sm:p-4 flex flex-col gap-2 shadow-[3px_3px_0px_var(--color-off-white)] overflow-hidden">
          <span className="font-body text-[10px] font-bold text-near-black uppercase shrink-0">Contact</span>
          <div className="lg:flex-1 lg:min-h-0 overflow-hidden flex flex-col gap-1">
            <p className="font-display font-bold text-base text-near-black">Get in touch</p>
            <p className="font-body text-xs 2xl:text-sm 3xl:text-lg 4xl:text-3xl text-near-black">Questions, feedback, or partnership?</p>
            <a href="mailto:hello@cubicon.app" className="flex items-center gap-1.5 font-body text-sm 4xl:text-2xl font-medium text-near-black underline underline-offset-2 hover:no-underline mt-2 lg:mt-auto">
              <Mail size={15} /> hello@cubicon.app
            </a>
          </div>
          <Link to="/contact"
            className="cursor-pointer w-full text-center font-display font-bold text-xs bg-near-black text-white border-2 border-near-black py-1.5 2xl:py-3 rounded-md shadow-[2px_2px_0px_var(--color-light-green)]  transition-colors flex items-center justify-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none shrink-0">
            Contact Us <ArrowRight size={10} />
          </Link>
        </div>

        {/* ── FAQ (2xl+) ── */}
        {/* <div className="hidden 2xl:flex col-span-2 bg-white border-2 border-near-black rounded-md p-3 sm:p-4 flex-col gap-2 shadow-[3px_3px_0px_var(--color-electric-yellow)] overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <span className="font-body text-[10px] font-bold text-near-black uppercase">FAQ</span>
            <NavArrows idx={faqIdx} total={FAQ_HOME.length} setIdx={setFaqIdx} />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
            <div className="border-2 border-near-black/10 rounded-md p-3 bg-off-white">
              <p className="font-display font-semibold text-xs text-near-black">{FAQ_HOME[faqIdx].q}</p>
              <p className="font-body text-xs text-near-black/60 mt-1 leading-relaxed">{FAQ_HOME[faqIdx].a}</p>
            </div>
          </div>
          <PaginationDots total={FAQ_HOME.length} idx={faqIdx} setIdx={setFaqIdx} />
        </div> */}

      </div>
    </div>
  )
}
