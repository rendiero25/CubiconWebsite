import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const TIERS = [
  {
    name: 'Starter',
    credits: 30,
    price: 'Rp39.000',
    badge: null,
    features: ['30 credits', '1K & 2K resolution', 'Transparent background', 'PNG export', 'Basic history (7 days)'],
    cta: 'Get Starter',
    highlight: false,
  },
  {
    name: 'Basic',
    credits: 100,
    price: 'Rp129.000',
    badge: null,
    features: ['100 credits', 'All resolutions (1K–4K)', 'Transparent + Solid + Gradient BG', 'PNG export', 'History 30 days', 'Share to Explore'],
    cta: 'Get Basic',
    highlight: false,
  },
  {
    name: 'Pro',
    credits: 300,
    price: 'Rp399.000',
    badge: '🔥 Popular',
    features: ['300 credits', 'All resolutions', 'All background types', 'Batch generation up to 10', 'Style reference upload', 'Priority render queue', 'Variations ×3', 'Unlimited history'],
    cta: 'Get Pro',
    highlight: true,
  },
  {
    name: 'Studio',
    credits: 1000,
    price: 'Rp1.299.000',
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

// Credit cost per icon
const CREDIT_COST = { '1K': 1, '2K': 2, '4K': 3 }

export default function Pricing() {
  const [iconCount, setIconCount] = useState(10)
  const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('2K')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const totalCost = iconCount * CREDIT_COST[resolution]
  const recommended = TIERS.find((t) => t.credits >= totalCost) ?? TIERS[TIERS.length - 1]

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      {/* Header */}
      <section className="py-12 md:py-20 border-b-2 border-near-black bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 ">
          <span className="inline-block bg-light-green border-2 border-near-black px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider mb-4">
            Pricing
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-near-black">
            Bayar sesuai kebutuhan.
          </h1>
          <p className="font-body text-base text-near-black/60 mt-3 max-w-md mx-auto">
            Tidak ada subscription bulanan. Beli credit sekali, pakai selamanya.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={clsx(
                  'relative border-2 border-near-black rounded-md flex flex-col',
                  tier.highlight
                    ? 'bg-electric-yellow text-near-black shadow-[6px_6px_0_near-black]'
                    : 'bg-white text-near-black shadow-[4px_4px_0_near-black]'
                )}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-near-black text-white font-display font-bold text-xs px-3 py-1 rounded-full border-2 border-near-black">
                    {tier.badge}
                  </div>
                )}

                <div className={clsx('p-6 border-b-2', tier.highlight ? 'border-white/30' : 'border-near-black')}>
                  <p className="font-display font-bold text-lg">{tier.name}</p>
                  <p className={clsx('font-display font-extrabold text-3xl mt-1', tier.highlight ? 'text-white' : 'text-near-black')}>
                    {tier.price}
                  </p>
                  <div className={clsx('flex items-center gap-1.5 mt-2', tier.highlight ? 'text-white/80' : 'text-near-black/60')}>
                    <Zap size={13} />
                    <span className="font-body text-sm">{tier.credits} credits</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-3 flex-1">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check size={14} className={clsx('mt-0.5 shrink-0', tier.highlight ? 'text-near-black' : 'text-electric-yellow')} />
                      <span className={clsx('font-body text-sm', tier.highlight ? 'text-white/90' : 'text-near-black/80')}>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/app"
                    className={clsx(
                      'block text-center font-display font-bold px-4 py-3 border-2 border-near-black rounded-md transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
                      tier.highlight
                        ? 'bg-white text-electric-yellow shadow-[3px_3px_0_near-black]'
                        : 'bg-electric-yellow text-near-black shadow-[3px_3px_0_near-black]'
                    )}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Calculator */}
      <section className="py-14 bg-white border-t-2 border-b-2 border-near-black">
        <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-8">
            <h2 className="font-display font-semibold text-2xl md:text-3xl text-near-black">
              Berapa icon yang kamu butuhkan?
            </h2>
            <p className="font-body text-sm text-near-black/60 mt-2">
              Masukkan estimasi, kami rekomendasikan paket terbaik.
            </p>
          </div>

          <div className="border-2 border-near-black rounded-md bg-off-white p-6 shadow-[4px_4px_0_near-black] flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-body text-xs font-medium text-near-black">Jumlah icon</label>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={iconCount}
                  onChange={(e) => setIconCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="border-2 border-near-black rounded-md px-3 py-2.5 font-body text-sm bg-white outline-none focus:border-electric-yellow transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-body text-xs font-medium text-near-black">Resolusi</label>
                <div className="flex gap-2">
                  {(['1K', '2K', '4K'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={clsx(
                        'cursor-pointer flex-1 py-2.5 border-2 border-near-black rounded-md font-display font-bold text-sm transition-all',
                        resolution === r
                          ? 'bg-near-black text-white'
                          : 'bg-white text-near-black hover:bg-light-green'
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-2 border-near-black rounded-md bg-white p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-body text-xs text-near-black/60">Estimasi credit dibutuhkan</p>
                <p className="font-display font-extrabold text-2xl text-near-black mt-0.5">
                  {totalCost} <span className="text-base font-semibold text-near-black/60">credits</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-body text-xs text-near-black/60">Rekomendasi paket</p>
                <p className={clsx('font-display font-bold text-lg', recommended.highlight ? 'text-electric-yellow' : 'text-near-black')}>
                  {recommended.name}
                  <span className="font-body font-normal text-sm text-near-black/60 ml-1.5">{recommended.price}</span>
                </p>
              </div>
            </div>

            <Link
              to="/app"
              className="text-center cursor-pointer bg-electric-yellow text-near-black font-display font-bold px-6 py-3 border-2 border-near-black rounded-md shadow-[4px_4px_0_near-black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Mulai dengan {recommended.name}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14">
        <div className="max-w-2xl mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="font-display font-semibold text-2xl text-near-black text-center mb-8">
            Pertanyaan umum
          </h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((item, i) => (
              <div key={i} className="border-2 border-near-black rounded-md bg-white shadow-[3px_3px_0_near-black] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="cursor-pointer w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-display font-semibold text-sm text-near-black">{item.q}</span>
                  {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t-2 border-near-black pt-3">
                    <p className="font-body text-sm text-near-black/70 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-near-black border-t-2 border-near-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16  flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
              Mulai gratis, upgrade kapanpun.
            </h2>
            <p className="font-body text-sm text-white/60 mt-1">
              2 icon gratis untuk semua user baru. Tidak perlu kartu kredit.
            </p>
          </div>
          <Link
            to="/signup"
            className="shrink-0 cursor-pointer bg-white text-near-black font-display font-bold px-6 py-3 border-2 border-white rounded-md shadow-[4px_4px_0_rgba(255,255,255,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Daftar Gratis →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
