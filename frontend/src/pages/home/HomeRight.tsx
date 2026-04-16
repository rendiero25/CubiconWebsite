import { useState } from 'react'
import {
  ChevronLeft, ChevronRight, Check, Zap,
  PenLine, Box, ImageDown, Eraser, FileImage, History, CreditCard,
  Mail, Globe, MessageCircle, Code, ArrowRight, Sparkles,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

/* ─── DATA ──────────────────────────────────────────────── */
const STEPS = [
  { step: '01', Icon: PenLine, title: 'Describe', desc: 'Type the icon you want in plain words. Be specific or keep it simple — our AI understands either way.', color: '#FFF5CC' },
  { step: '02', Icon: Zap,     title: 'Generate', desc: 'Hit generate. AI renders a crisp 3D isometric icon in seconds, not minutes.', color: '#FFF9E0' },
  { step: '03', Icon: Box,     title: 'Download', desc: 'Export as transparent PNG, ready to drop into any app, deck, or design file.', color: '#F0FFF4' },
]

const PLANS = [
  { name: 'Starter', price: 'Rp39.000',    credits: 30,   features: ['30 icons (1K res)', 'PNG transparent', 'All 5 styles'], badge: undefined, highlight: false },
  { name: 'Basic',   price: 'Rp129.000',   credits: 100,  features: ['100 icons mixed res', 'Remove BG', 'Email support'], badge: undefined, highlight: false },
  { name: 'Pro',     price: 'Rp399.000',   credits: 300,  features: ['300 icons mixed res', 'Variations x3', 'Priority support'], badge: 'Popular', highlight: true },
  { name: 'Studio',  price: 'Rp1.299.000', credits: 1000, features: ['1000 icons', 'Batch generation', 'Dedicated support'], badge: 'Best Value', highlight: false },
]

const FEATURES = [
  { Icon: PenLine,    title: 'AI Generation',    desc: 'Generate from text in seconds via Gemini.' },
  { Icon: Box,        title: '3D Isometric',     desc: 'Consistent clean look, every single time.' },
  { Icon: ImageDown,  title: 'Multi Resolution', desc: '1K, 2K, or 4K — perfect for any screen.' },
  { Icon: Eraser,     title: 'Remove BG',        desc: 'Auto-transparent PNG, no extra tools.' },
  { Icon: Zap,        title: 'Fast Render',      desc: 'Results in seconds, not minutes.' },
  { Icon: FileImage,  title: 'PNG Export',       desc: 'Works in Figma, Sketch, web, and print.' },
  { Icon: History,    title: 'History',          desc: 'All icons saved in your dashboard.' },
  { Icon: CreditCard, title: 'Credit System',    desc: 'Pay only for what you use.' },
]

const FAQS = [
  { q: 'Apa itu credit?',                  a: '1K = 1 credit, 2K = 2 credits, 4K = 3 credits. Credit tidak punya batas waktu pemakaian — beli sekali, pakai kapan saja.' },
  { q: 'Format file apa yang tersedia?',   a: 'PNG dengan background transparan. Format lain (SVG, WebP) sedang dalam pengembangan dan akan segera tersedia.' },
  { q: 'Bisa auto remove background?',    a: 'Ya! Pilih "Transparent" saat generate — background otomatis dihapus tanpa alat tambahan.' },
  { q: 'Apakah bisa refund?',             a: 'Tidak untuk credit terpakai. Masalah teknis? Hubungi hello@cubicon.app — kami balas dalam 24 jam.' },
]

const SOCIALS = [
  { Icon: Globe,         label: 'Website',   href: '#' },
  { Icon: MessageCircle, label: 'Community', href: '#' },
  { Icon: Code,          label: 'GitHub',    href: '#' },
]

const UPDATES = [
  { tag: 'New', text: 'Batch generation — generate up to 10 icons at once.' },
  { tag: 'New', text: 'Reference image support — upload a style reference.' },
  { tag: 'Fix', text: 'Faster background removal, now 40% quicker.' },
]

/* ─── PAGINATED CARD WRAPPER ─────────────────────────────── */
function PagedCard({ title, total, idx, setIdx, children, className = '' }: {
  title: string; total: number; idx: number
  setIdx: (i: number) => void; children: React.ReactNode; className?: string
}) {
  return (
    <div className={clsx('bg-[#FFFCF2] border-2 border-[#0A1628] rounded-md p-4 flex flex-col gap-3 shadow-[3px_3px_0px_#FFC300] h-full', className)}>
      <div className="flex items-center justify-between shrink-0">
        <span className="font-body text-[10px] font-bold text-[#0A1628]/40 uppercase tracking-widest">{title}</span>
        <div className="flex gap-1">
          <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
            className="cursor-pointer w-6 h-6 flex items-center justify-center border border-[#0A1628]/20 rounded disabled:opacity-25 hover:bg-[#FFC300] transition-colors">
            <ChevronLeft size={11} />
          </button>
          <button onClick={() => setIdx(Math.min(total - 1, idx + 1))} disabled={idx === total - 1}
            className="cursor-pointer w-6 h-6 flex items-center justify-center border border-[#0A1628]/20 rounded disabled:opacity-25 hover:bg-[#FFC300] transition-colors">
            <ChevronRight size={11} />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
      <div className="flex gap-1.5 shrink-0">
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={clsx('h-[4px] rounded-full transition-all cursor-pointer', i === idx ? 'bg-[#FFC300] flex-[3]' : 'bg-[#0A1628]/15 flex-1')} />
        ))}
      </div>
    </div>
  )
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function HomeRight() {
  const [stepIdx, setStepIdx] = useState(0)
  const [planIdx, setPlanIdx] = useState(0)
  const [faqIdx,  setFaqIdx]  = useState(0)
  const navigate = useNavigate()

  const step = STEPS[stepIdx]
  const plan = PLANS[planIdx]
  const faq  = FAQS[faqIdx]

  return (
    <div className="flex-1 bg-[#0A1628] rounded-3xl lg:overflow-hidden lg:h-full overflow-y-auto">
      <div className="grid grid-cols-2 gap-5 lg:h-full lg:auto-rows-fr">

        {/* HOW IT WORKS */}
        <PagedCard title="How It Works" total={STEPS.length} idx={stepIdx} setIdx={setStepIdx} className="col-span-2">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 shrink-0 border-2 border-[#0A1628] rounded-md flex items-center justify-center shadow-[2px_2px_0px_#0A1628]"
              style={{ backgroundColor: step.color }}>
              <step.Icon size={19} className="text-[#0A1628]" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2.5 mb-1">
                <span className="font-display font-extrabold text-5xl text-[#0A1628]/8 leading-none">{step.step}</span>
                <h3 className="font-display font-bold text-xl text-[#0A1628]">{step.title}</h3>
              </div>
              <p className="font-body text-sm text-[#0A1628]/60 leading-relaxed max-w-sm">{step.desc}</p>
            </div>
          </div>
        </PagedCard>

        {/* PRICING */}
        <PagedCard title="Pricing" total={PLANS.length} idx={planIdx} setIdx={setPlanIdx}>
          <div className="flex flex-col gap-2 h-full">
            {plan.badge && (
              <span className="self-start font-body text-[10px] font-semibold bg-[#FFC300] text-[#0A1628] border border-[#0A1628] px-2 py-0.5 rounded-full">
                {plan.badge}
              </span>
            )}
            <div>
              <p className="font-display font-bold text-lg text-[#0A1628] leading-tight">{plan.name}</p>
              <p className="font-display font-extrabold text-xl text-[#0A1628]">{plan.price}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Zap size={10} className="text-[#FFC300]" />
                <span className="font-body text-[11px] text-[#0A1628]/55">{plan.credits} credits</span>
              </div>
            </div>
            <ul className="flex flex-col gap-1 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-1.5">
                  <Check size={10} className="text-[#FFC300] shrink-0" />
                  <span className="font-body text-xs text-[#0A1628]/70">{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/signup')}
              className="cursor-pointer w-full font-display font-bold text-xs bg-[#FFC300] text-[#0A1628] border-2 border-[#0A1628] py-2 rounded-md shadow-[2px_2px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all mt-1">
              Get {plan.name}
            </button>
          </div>
        </PagedCard>

        {/* FEATURES — no pagination, 3 items + See All */}
        <div className="bg-[#0A1628] border-2 border-[#FFC300]/40 rounded-md p-4 flex flex-col gap-3 shadow-[3px_3px_0px_rgba(255,195,0,0.25)] h-full">
          <span className="font-body text-[10px] font-bold text-[#FFC300]/60 uppercase tracking-widest shrink-0">Features</span>
          <div className="flex flex-col gap-2.5 flex-1 min-h-0">
            {FEATURES.slice(0, 3).map(({ Icon: FIcon, title, desc }) => (
              <div key={title} className="flex items-start gap-2.5">
                <div className="w-7 h-7 shrink-0 border border-[#FFC300]/30 rounded-md flex items-center justify-center bg-[#FFF5CC]/5">
                  <FIcon size={13} className="text-[#FFC300]" />
                </div>
                <div>
                  <p className="font-display font-semibold text-xs text-white">{title}</p>
                  <p className="font-body text-[10px] text-white/45 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
            <Link to="/features"
              className="mt-auto flex items-center justify-center gap-1.5 border border-[#FFC300]/40 rounded-md py-2 text-[#FFC300] hover:bg-[#FFC300] hover:text-[#0A1628] font-display font-bold text-xs transition-all">
              See All Features <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <PagedCard title="FAQ" total={FAQS.length} idx={faqIdx} setIdx={setFaqIdx} className="col-span-2">
          <div className="h-full flex flex-col">
            <p className="font-display font-semibold text-sm text-[#0A1628] leading-snug">{faq.q}</p>
            <p className="font-body text-xs text-[#0A1628]/60 mt-2 leading-relaxed flex-1">{faq.a}</p>
            <Link to="/contact" className="font-body text-xs font-medium text-[#FFC300] underline underline-offset-2 mt-2 inline-block hover:no-underline">
              More questions? Contact us
            </Link>
          </div>
        </PagedCard>

        {/* UPDATES */}
        <div className="col-span-2 bg-[#0A1628] border-2 border-[#FFC300]/30 rounded-md p-4 flex flex-col gap-3 h-full">
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles size={11} className="text-[#FFC300]" />
            <span className="font-body text-[10px] font-bold text-[#FFC300]/60 uppercase tracking-widest">What is New</span>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            {UPDATES.map(({ tag, text }) => (
              <div key={text} className="flex items-start gap-2.5">
                <span className={clsx(
                  'font-body text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5',
                  tag === 'New' ? 'bg-[#FFC300] text-[#0A1628]' : 'bg-white/10 text-white/60'
                )}>{tag}</span>
                <p className="font-body text-xs text-white/70 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div className="bg-[#FFC300] border-2 border-[#0A1628] rounded-md p-4 flex flex-col gap-2 shadow-[3px_3px_0px_rgba(255,255,255,0.15)] h-full">
          <span className="font-body text-[10px] font-bold text-[#0A1628]/55 uppercase tracking-widest">Contact</span>
          <p className="font-display font-bold text-base text-[#0A1628]">Get in touch</p>
          <p className="font-body text-xs text-[#0A1628]/70 flex-1">Questions, feedback, or partnership?</p>
          <a href="mailto:hello@cubicon.app" className="flex items-center gap-1.5 font-body text-xs font-medium text-[#0A1628] underline underline-offset-2 hover:no-underline">
            <Mail size={11} /> hello@cubicon.app
          </a>
          <Link to="/contact"
            className="cursor-pointer w-full text-center font-display font-bold text-xs bg-[#0A1628] text-white border-2 border-[#0A1628] py-2 rounded-md hover:bg-white hover:text-[#0A1628] transition-colors flex items-center justify-center gap-1 mt-1">
            Contact Us <ArrowRight size={10} />
          </Link>
        </div>

        {/* SOCIAL */}
        <div className="bg-[#FFFCF2] border-2 border-[#0A1628] rounded-md p-4 flex flex-col gap-3 shadow-[3px_3px_0px_#FFC300] h-full">
          <span className="font-body text-[10px] font-bold text-[#0A1628]/40 uppercase tracking-widest">Follow Us</span>
          <div className="flex flex-col gap-2 flex-1">
            {SOCIALS.map(({ Icon: SIcon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 border border-[#0A1628]/10 rounded-md px-3 py-2 hover:bg-[#FFF5CC] hover:border-[#0A1628] transition-all group">
                <SIcon size={14} className="text-[#0A1628]/40 group-hover:text-[#0A1628] transition-colors" />
                <span className="font-body text-sm text-[#0A1628]/65 group-hover:text-[#0A1628] transition-colors">{label}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}