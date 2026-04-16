import { useState, useEffect, useRef } from 'react'
import { Plus, Minus } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

const FAQ_ITEMS = [
  {
    question: 'Apa itu credit?',
    answer:
      'Credit adalah satuan penggunaan di Cubicon. Setiap kali kamu generate icon, credit terpotong sesuai resolusi yang dipilih: 1K = 1 credit, 2K = 2 credits, 4K = 3 credits. Credit yang kamu beli tidak punya batas waktu pemakaian.',
  },
  {
    question: 'Format file apa saja yang tersedia?',
    answer:
      'Saat ini Cubicon mendukung export format PNG dengan background transparan. Format lain (SVG, WebP) sedang dalam pengembangan dan akan tersedia dalam waktu dekat.',
  },
  {
    question: 'Bisa remove background secara otomatis?',
    answer:
      'Ya! Jika kamu memilih opsi "Transparent" saat generate, background icon akan otomatis dihapus — tidak perlu alat tambahan. Untuk icon dengan solid/gradient background, tombol Remove BG tersedia di panel result.',
  },
  {
    question: 'Apakah bisa refund?',
    answer:
      'Kami tidak menawarkan refund untuk credit yang sudah digunakan. Namun jika kamu mengalami masalah teknis yang menyebabkan credit terpotong tanpa hasil, hubungi tim kami di hello@cubicon.app dan kami akan menindaklanjuti dalam 24 jam.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i))

  return (
    <section ref={sectionRef} className="bg-[#FFFCF2] py-16 md:py-24 border-t-2 border-[#0A1628]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-[#0A1628]">
            Frequently asked
          </h2>
          <p className="font-body text-sm text-[#0A1628]/60 mt-2">
            Masih ada pertanyaan?{' '}
            <a href="/contact" className="text-[#FFC300] underline underline-offset-4">
              Hubungi kami
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="faq-item border-2 border-[#0A1628] rounded-md bg-white shadow-[4px_4px_0px_#0A1628] overflow-hidden"
            >
              <button
              className="cursor-pointer w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display font-semibold text-sm md:text-base text-[#0A1628]">
                  {item.question}
                </span>
                <span className={clsx(
                  'shrink-0 w-7 h-7 flex items-center justify-center border-2 border-[#0A1628] rounded-md transition-colors',
                  openIndex === i ? 'bg-[#FFC300] text-[#0A1628]' : 'bg-white text-[#0A1628]'
                )}>
                  {openIndex === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              {openIndex === i && (
                <div className="px-5 pb-5 border-t-2 border-[#0A1628]/10">
                  <p className="font-body text-sm text-[#0A1628]/70 leading-relaxed pt-4">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
