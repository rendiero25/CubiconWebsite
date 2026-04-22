import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Zap, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import Navbar, { type NavColors } from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const TIERS = [
  {
    name: 'Starter',
    credits: 30,
    price: 'Rp 39.000',
    badge: null,
    features: ['30 credits', '1K & 2K resolution', 'Transparent background', 'PNG export', 'Basic history (7 days)'],
    cta: 'Get Starter',
    highlight: false,
  },
  {
    name: 'Basic',
    credits: 100,
    price: 'Rp 129.000',
    badge: null,
    features: ['100 credits', 'All resolutions (1K–4K)', 'Transparent + Solid + Gradient BG', 'PNG export', 'History 30 days', 'Share to Explore'],
    cta: 'Get Basic',
    highlight: false,
  },
  {
    name: 'Pro',
    credits: 300,
    price: 'Rp 399.000',
    badge: '🔥 Popular',
    features: ['300 credits', 'All resolutions', 'All background types', 'Batch generation up to 10', 'Style reference upload', 'Priority render queue', 'Variations ×3', 'Unlimited history'],
    cta: 'Get Pro',
    highlight: true,
  },
  {
    name: 'Studio',
    credits: 1000,
    price: 'Rp 1.299.000',
    badge: '💎 Best Value',
    features: ['1000 credits', 'All Pro features', 'Batch up to 50 icons', 'Dedicated support', 'Commercial license', 'API access (coming soon)'],
    cta: 'Get Studio',
    highlight: false,
  },
]

const FAQ = [
  { q: 'Apakah credit expired?', a: 'Tidak. Credit yang kamu beli tidak akan expired. Gunakan kapanpun sesuai kebutuhanmu.' },
  { q: 'Bisa top-up kapanpun?', a: 'Ya! Kamu bisa membeli paket kapanpun tanpa harus menunggu kredit habis. Saldo akan ditambahkan ke saldo yang ada.' },
  { q: 'Metode pembayaran apa yang tersedia?', a: 'Kami mendukung transfer bank, QRIS, e-wallet (GoPay, OVO, Dana), dan kartu kredit/debit melalui Mayar.id.' },
]

const PRICING_NAV_COLORS: Partial<NavColors> = {
  bg:                'bg-near-black',
  logo:              'text-electric-yellow',
  logoHover:         'hover:text-light-green',
  link:              'text-off-white',
  linkHover:         'hover:text-electric-yellow',
  linkActive:        'text-electric-yellow',
  creditBadgeBg:     'bg-light-green',
  creditBadgeBorder: 'border-near-black',
  creditBadgeText:   'text-near-black',
  creditBadgeIcon:   'text-electric-yellow',
  dashboardBg:       'bg-electric-yellow',
  dashboardText:     'text-near-black',
  dashboardBorder:   'border-near-black',
  dashboardShadow:   'shadow-[3px_3px_0px_var(--color-light-green)]',
  loginText:         'text-electric-yellow',
  loginHover:        'hover:text-off-white',
  startFreeBg:       'bg-electric-yellow',
  startFreeText:     'text-near-black',
  startFreeBorder:   'border-near-black',
  startFreeShadow:   'shadow-[3px_3px_0px_var(--color-light-green)]',
  mobileBg:          'bg-off-white',
  mobileLinkColor:   'text-near-black',
  mobileToggle:      'border-electric-yellow text-electric-yellow',
}

const CREDIT_COST = { '1K': 1, '2K': 2, '4K': 3 }

export default function Pricing() {
  const [iconCount, setIconCount] = useState(10)
  const [resolutions, setResolutions] = useState<Set<'1K' | '2K' | '4K'>>(new Set(['2K']))
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [openFeatureTier, setOpenFeatureTier] = useState<string | null>(null)

  const toggleResolution = (r: '1K' | '2K' | '4K') => {
    setResolutions(prev => {
      if (prev.has(r) && prev.size === 1) return prev
      const next = new Set(prev)
      next.has(r) ? next.delete(r) : next.add(r)
      return next
    })
  }

  const costPerIcon = (['1K', '2K', '4K'] as const).reduce(
    (sum, r) => sum + (resolutions.has(r) ? CREDIT_COST[r] : 0), 0
  )
  const totalCost = iconCount * costPerIcon
  const recommended = TIERS.find((t) => t.credits >= totalCost) ?? TIERS[TIERS.length - 1]

  return (
    <div className="flex flex-col bg-near-black min-h-screen lg:h-screen lg:overflow-hidden" onClick={() => setOpenFeatureTier(null)}>
      <Navbar noBorder colors={PRICING_NAV_COLORS} />

      <div className="px-3 4xl:mx-auto flex-1 flex flex-col lg:flex-row lg:min-h-0 lg:overflow-hidden pb-3">

        {/* ── LEFT: Header + Pricing Cards ── */}
        <div className="w-full lg:w-[58%] shrink-0 flex flex-col pb-2 pr-0 lg:pr-1.5 mb-1 lg:mb-0">
          <div className="flex-1 py-7 sm:py-8 lg:py-10 2xl:py-14 flex flex-col gap-5 bg-off-white border-2 border-near-black rounded-md overflow-hidden shadow-[3px_3px_0px_var(--color-electric-yellow)] px-4 sm:px-6 md:px-8">

            {/* Header */}
            <div className="shrink-0">
              <span className="inline-block bg-light-green border-2 border-near-black px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_var(--color-near-black)]">
                Pricing
              </span>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl text-near-black leading-[1.1]">
                Bayar sesuai{' '}
                <span className="relative inline-block">
                  <span className="text-electric-yellow">kebutuhan.</span>
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.75 bg-electric-yellow rounded-sm" />
                </span>
              </h1>
              <p className="font-body text-sm text-near-black mt-2">
                Tidak ada subscription. Beli credit sekali, pakai selamanya.
              </p>
            </div>

            {/* Pricing Cards — 2×2 grid */}
            <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
              {TIERS.map((tier, tierIdx) => (
                <div
                  key={tier.name}
                  className={clsx(
                    'relative border-2 border-near-black rounded-md flex flex-col',
                    tier.highlight
                      ? 'bg-electric-yellow shadow-[3px_3px_0px_var(--color-near-black)]'
                      : 'bg-off-white shadow-[3px_3px_0px_var(--color-near-black)]',
                    openFeatureTier === tier.name ? 'z-50' : 'z-0'
                  )}
                >
                  {tier.badge && (
                    <div className="absolute -top-px left-0 right-0 flex justify-center">
                      <span className="bg-near-black text-off-white font-display font-bold text-[9px] px-2.5 py-1 rounded-b-md border-x-2 border-b-2 border-near-black whitespace-nowrap">
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div className={clsx('p-3 border-b-2 mt-0', tier.badge ? 'pt-5' : '', tier.highlight ? 'border-near-black/20' : 'border-near-black/10')}>
                    <p className="mt-2 sm:mt-0 font-display font-bold text-sm text-near-black">{tier.name}</p>
                    <p className="font-display font-extrabold text-xs xl:text-xl text-near-black mt-0.5">{tier.price}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={11} className={tier.highlight ? 'text-near-black' : 'text-electric-yellow'} />
                      <span className="font-body text-xs text-near-black">{tier.credits} credits</span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
                    {tier.features.map((f, idx) => (
                      <div key={f} className={clsx('flex items-start gap-1.5', idx <= 3 && 'lg:hidden 2xl:flex', idx >= 4 && 'lg:hidden 3xl:flex')}>
                        <Check size={11} className={clsx('mt-0.5 shrink-0', tier.highlight ? 'text-near-black' : 'text-electric-yellow')} />
                        <span className="font-body text-xs text-near-black leading-snug">{f}</span> 
                      </div>
                    ))}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenFeatureTier(openFeatureTier === tier.name ? null : tier.name)
                      }}
                      className="hidden lg:flex 3xl:hidden mt-auto pt-1.5 w-full items-center justify-start gap-1 font-body text-xs font-medium text-near-black hover:text-electric-yellow transition-colors cursor-pointer"
                    >
                      See features
                      <ChevronDown size={12} className={clsx('transition-transform', openFeatureTier === tier.name && 'rotate-180')} />
                    </button>
                  </div>

                  <div className="p-3 pt-0 shrink-0">
                    <Link
                      to="/app"
                      className={clsx(
                        'block text-center font-display font-bold text-xs px-3 py-2 border-2 border-near-black rounded-md transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
                        tier.highlight
                          ? 'bg-near-black text-off-white shadow-[2px_2px_0px_var(--color-light-green)]'
                          : 'bg-electric-yellow text-near-black shadow-[2px_2px_0px_var(--color-near-black)]'
                      )}
                    >
                      {tier.cta}
                    </Link>
                  </div>

                  {openFeatureTier === tier.name && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={clsx(
                        'hidden lg:block 3xl:hidden',
                        'absolute bottom-0 z-50 w-44',
                        'bg-off-white border-2 border-near-black rounded-md p-3',
                        'shadow-[3px_3px_0px_var(--color-near-black)] max-h-72 overflow-y-auto',
                        tierIdx % 2 === 0 ? 'left-full ml-2' : 'right-full mr-2'
                      )}
                    >
                      <p className="font-display font-bold text-xs text-near-black mb-2 pb-2 border-b border-near-black/10">{tier.name} — All Features</p>
                      <div className="flex flex-col gap-1.5">
                        {tier.features.map((f) => (
                          <div key={f} className="flex items-start gap-1.5">
                            <Check size={11} className={clsx('mt-0.5 shrink-0', tier.highlight ? 'text-near-black' : 'text-electric-yellow')} />
                            <span className="font-body text-xs text-near-black leading-snug">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── RIGHT: Credit Calculator + FAQ ── */}
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden pb-2 pl-1.5 pr-1">
          <div className="flex flex-col gap-2 lg:h-full">

            {/* Credit Calculator */}
            <div className="bg-light-green border-2 border-near-black rounded-md p-4 sm:p-5 flex flex-col gap-4 shadow-[3px_3px_0px_var(--color-off-white)]">
              <div>
                <span className="font-body text-[10px] font-bold text-near-black uppercase">Credit Calculator</span>
                <h2 className="font-display font-semibold text-lg md:text-xl 2xl:text-2xl text-near-black mt-1 leading-snug">
                  Berapa icon yang kamu butuhkan?
                </h2>
                <p className="font-body text-xs text-near-black mt-1">
                  Masukkan estimasi, kami rekomendasikan paket terbaik.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-medium text-near-black">Jumlah icon</label>
                  <input
                    type="number"
                    min={1}
                    max={9999}
                    value={iconCount}
                    onChange={(e) => setIconCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="border-2 border-near-black rounded-md px-3 py-2.5 font-body text-sm bg-off-white outline-none focus:border-electric-yellow transition-colors shadow-[2px_2px_0px_var(--color-near-black)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-medium text-near-black">Resolusi</label>
                  <div className="flex gap-2">
                    {(['1K', '2K', '4K'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => toggleResolution(r)}
                        className={clsx(
                          'cursor-pointer flex-1 py-2.5 border-2 border-near-black rounded-md font-display font-bold text-sm transition-all',
                          resolutions.has(r)
                            ? 'bg-near-black text-off-white'
                            : 'bg-off-white text-near-black hover:bg-electric-yellow'
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-2 border-near-black rounded-md bg-off-white shadow-[2px_2px_0px_var(--color-near-black)] overflow-hidden">
                {/* Per-resolution breakdown */}
                <div className="divide-y divide-near-black">
                  {(['1K', '2K', '4K'] as const).filter(r => resolutions.has(r)).map(r => (
                    <div key={r} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs bg-near-black text-off-white px-1.5 py-0.5 rounded">{r}</span>
                        <span className="font-body text-xs text-near-black">{iconCount} icon × {CREDIT_COST[r]} cr</span>
                      </div>
                      <span className="font-display font-bold text-sm text-near-black">{iconCount * CREDIT_COST[r]} cr</span>
                    </div>
                  ))}
                </div>
                {/* Total */}
                <div className="flex items-center justify-between gap-4 px-4 py-3 bg-near-black/5 border-t-2 border-near-black/10">
                  <div>
                    <p className="font-body text-xs text-near-black">Total estimasi</p>
                    <p className="font-display font-extrabold text-2xl text-near-black mt-0.5">
                      {totalCost} <span className="text-sm font-semibold text-near-black">credits</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-xs text-near-black">Total icon dihasilkan</p>
                    <p className="font-display font-extrabold text-2xl text-near-black mt-0.5">
                      {iconCount * resolutions.size}
                      <span className="text-sm font-semibold text-near-black ml-1">icon</span>
                    </p>
                    {resolutions.size > 1 && (
                      <p className="font-body text-[10px] text-near-black mt-0.5">
                        {iconCount} × {resolutions.size} resolusi
                      </p>
                    )}
                  </div>
                </div>
                {/* Recommendation */}
                <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-t border-near-black/10">
                  <p className="font-body text-xs text-near-black">Rekomendasi paket</p>
                  <p className={clsx('font-display font-bold text-base', recommended.highlight ? 'text-electric-yellow' : 'text-near-black')}>
                    {recommended.name}
                    <span className="font-body font-normal text-sm text-near-black ml-1.5">{recommended.price}</span>
                  </p>
                </div>
              </div>

              <Link
                to="/app"
                className="text-center cursor-pointer bg-electric-yellow text-near-black font-display font-bold px-6 py-3 border-2 border-near-black rounded-md shadow-[3px_3px_0px_var(--color-near-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-sm"
              >
                Mulai dengan {recommended.name}
              </Link>
            </div>

            {/* FAQ */}
            <div className="bg-near-black border-2 border-electric-yellow rounded-md p-4 sm:p-5 flex flex-col gap-3 shadow-[3px_3px_0px_var(--color-electric-yellow)] flex-1">
              <span className="font-body text-[10px] font-bold text-electric-yellow uppercase shrink-0">FAQ</span>

              <div className="flex flex-col gap-2">
                {FAQ.map((item, i) => (
                  <div key={i} className="border border-electric-yellow rounded-md overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="cursor-pointer w-full text-left flex items-center justify-between gap-3 p-3 transition-colors"
                    >
                      <span className="font-display font-semibold text-xs text-off-white hover:text-electric-yellow">{item.q}</span>
                      <ChevronDown
                        size={13}
                        className={clsx('shrink-0 text-electric-yellow transition-transform', openFaq === i && 'rotate-180')}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-3 pb-3">
                        <p className="font-body text-xs text-electric-yellow leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-2 border-t border-electric-yellow">
                <p className="font-body text-xs text-off-white">
                  Masih ada pertanyaan?{' '}
                  <a href="mailto:hello@cubicon.app" className="text-electric-yellow hover:underline">
                    hello@cubicon.app
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      <Footer noBorder />
    </div>
  )
}
