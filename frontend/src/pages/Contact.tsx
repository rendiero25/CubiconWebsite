import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Clock, Send, CheckCircle, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const SUBJECTS = ['General', 'Billing', 'Bug Report', 'Partnership']

const SOCIALS = [
  { label: 'Twitter / X', href: 'https://twitter.com/cubicon_id' },
  { label: 'Instagram', href: 'https://instagram.com/cubicon.id' },
  { label: 'GitHub', href: 'https://github.com/cubicon' },
]

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

const EMPTY_FORM: FormState = { name: '', email: '', subject: 'General', message: '' }

export default function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      // TODO: wire to Supabase or email provider
      await new Promise<void>((r) => setTimeout(r, 900))
      setSent(true)
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
  })

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      {/* Header */}
      <section className="py-12 md:py-16 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <span className="inline-block bg-light-blue border-2 border-black px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider mb-4">
            Contact
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-near-black">
            Ada pertanyaan?
          </h1>
          <p className="font-body text-base text-near-black/60 mt-3">
            Kami siap membantu. Kirim pesan dan kami akan membalas dalam 24 jam.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Form — 3 cols */}
          <div className="md:col-span-3">
            {sent ? (
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-10 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-green-50 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0_#000]">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <h2 className="font-display font-bold text-xl text-near-black">Pesan terkirim!</h2>
                <p className="font-body text-sm text-near-black/60 max-w-xs">
                  Terima kasih, <strong>{form.name}</strong>. Kami akan membalas ke{' '}
                  <strong>{form.email}</strong> dalam 24 jam.
                </p>
                <button
                  onClick={() => { setSent(false); setForm(EMPTY_FORM) }}
                  className="cursor-pointer font-body text-sm text-electric-blue hover:underline underline-offset-2"
                >
                  Kirim pesan lain
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 md:p-8 flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-xs font-medium text-near-black">
                      Nama <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...field('name')}
                      placeholder="Nama lengkap"
                      className="border-2 border-black rounded-md px-3 py-2.5 font-body text-sm outline-none focus:border-electric-blue transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-xs font-medium text-near-black">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...field('email')}
                      placeholder="email@kamu.com"
                      className="border-2 border-black rounded-md px-3 py-2.5 font-body text-sm outline-none focus:border-electric-blue transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-medium text-near-black">Subjek</label>
                  <select
                    {...field('subject')}
                    className="border-2 border-black rounded-md px-3 py-2.5 font-body text-sm outline-none focus:border-electric-blue transition-colors bg-white"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-medium text-near-black">
                    Pesan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...field('message')}
                    placeholder="Tulis pesanmu di sini..."
                    rows={5}
                    className="border-2 border-black rounded-md px-3 py-2.5 font-body text-sm outline-none focus:border-electric-blue transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="font-body text-xs text-red-500 border-2 border-red-300 bg-red-50 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={clsx(
                    'cursor-pointer flex items-center justify-center gap-2 border-2 border-black font-display font-bold px-6 py-3 rounded-md transition-all',
                    isLoading
                      ? 'bg-near-black/40 text-white cursor-not-allowed shadow-none'
                      : 'bg-electric-blue text-white shadow-[4px_4px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                  )}
                >
                  <Send size={15} />
                  {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar — 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Contact info */}
            <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-light-blue border-2 border-black rounded-md flex items-center justify-center shrink-0 shadow-[2px_2px_0_#000]">
                  <Mail size={16} className="text-near-black" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-near-black">Email</p>
                  <a
                    href="mailto:hello@cubicon.id"
                    className="font-body text-sm text-electric-blue hover:underline underline-offset-2"
                  >
                    hello@cubicon.id
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-light-blue border-2 border-black rounded-md flex items-center justify-center shrink-0 shadow-[2px_2px_0_#000]">
                  <Clock size={16} className="text-near-black" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-near-black">Response Time</p>
                  <p className="font-body text-sm text-near-black/60">We reply within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Social media */}
            <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6">
              <p className="font-display font-semibold text-sm text-near-black mb-3">Follow us</p>
              <div className="flex flex-col gap-2">
                {SOCIALS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border-2 border-black rounded-md px-3 py-2 bg-off-white hover:bg-light-blue transition-colors group"
                  >
                    <span className="font-body text-sm font-medium text-near-black">{label}</span>
                    <ExternalLink size={13} className="text-near-black/40 group-hover:text-near-black transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Billing hint */}
            <div className="border-2 border-black rounded-md bg-light-blue p-5">
              <p className="font-display font-semibold text-sm text-near-black mb-1">
                Looking for billing help?
              </p>
              <p className="font-body text-xs text-near-black/60 mb-3">
                For payment issues, select "Billing" as the subject above.
              </p>
              <Link
                to="/pricing"
                className="font-body text-xs font-semibold text-electric-blue hover:underline underline-offset-2"
              >
                View pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
