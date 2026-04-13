import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, CheckCircle, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { signIn, signInWithGoogle, sendPasswordReset } from '../api/auth'

const DEMO_ICONS = ['🛒', '📊', '🔔', '💳', '🌐', '🔒']

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shakeForm, setShakeForm] = useState(false)
  const [success, setSuccess] = useState(false)

  // Forgot password
  const [forgotOpen, setForgotOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  // Floating icons animation refs
  const iconsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let gsapCtx: { revert: () => void } | null = null
    import('gsap').then(({ gsap }) => {
      gsapCtx = gsap.context(() => {
        const cards = iconsRef.current?.querySelectorAll('.float-card')
        if (!cards) return
        cards.forEach((card, i) => {
          gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.12 })
          gsap.to(card, { y: -10, duration: 1.8 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.2 })
        })
      })
    })
    return () => { gsapCtx?.revert() }
  }, [])

  const triggerShake = () => {
    setShakeForm(true)
    setTimeout(() => setShakeForm(false), 500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      triggerShake()
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      await signIn(email, password)
      setSuccess(true)
      setTimeout(() => navigate('/app'), 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      triggerShake()
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim()) { setResetError('Enter your email.'); return }
    try {
      setResetLoading(true)
      setResetError(null)
      await sendPasswordReset(resetEmail)
      setResetSent(true)
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-20 max-w-xl w-full">
        {/* Logo */}
        <Link to="/" className="font-display font-extrabold text-2xl text-near-black tracking-tight mb-10">
          cubicon
        </Link>

        <h1 className="font-display font-bold text-3xl md:text-4xl text-near-black">
          Welcome back.
        </h1>
        <p className="font-body text-sm text-near-black/60 mt-2 mb-8">
          Sign in to continue creating icons.
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="w-16 h-16 bg-green-50 border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0_#000]">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <p className="font-display font-semibold text-lg text-near-black">Signed in!</p>
            <p className="font-body text-sm text-near-black/60">Redirecting you to the app...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={clsx('flex flex-col gap-4', shakeForm && 'animate-shake')}
          >
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={isLoading}
              className="cursor-pointer flex items-center justify-center gap-3 w-full border-2 border-black rounded-md py-3 bg-white font-body font-medium text-sm text-near-black shadow-[3px_3px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-black/10" />
              <span className="font-body text-xs text-near-black/40">or</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium text-near-black">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@kamu.com"
                className={clsx(
                  'border-2 rounded-md px-4 py-3 font-body text-sm outline-none transition-colors',
                  error ? 'border-red-400 focus:border-red-500' : 'border-black focus:border-electric-blue'
                )}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium text-near-black">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={clsx(
                    'w-full border-2 rounded-md px-4 py-3 pr-10 font-body text-sm outline-none transition-colors',
                    error ? 'border-red-400 focus:border-red-500' : 'border-black focus:border-electric-blue'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-near-black/40 hover:text-near-black"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-body text-sm text-near-black">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-black rounded accent-electric-blue"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => { setForgotOpen((v) => !v); setResetSent(false); setResetError(null) }}
                className="font-body text-sm text-electric-blue hover:underline underline-offset-2"
              >
                Forgot password?
              </button>
            </div>

            {/* Forgot password inline */}
            {forgotOpen && (
              <div className="border-2 border-black rounded-md p-4 bg-light-blue flex flex-col gap-3">
                {resetSent ? (
                  <div className="flex items-center gap-2 text-near-black">
                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                    <p className="font-body text-sm">Reset link sent! Check your inbox.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReset} className="flex flex-col gap-3">
                    <p className="font-body text-xs font-medium text-near-black">Enter your email to receive a reset link:</p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="email@kamu.com"
                        className="flex-1 border-2 border-black rounded-md px-3 py-2 font-body text-sm outline-none focus:border-electric-blue transition-colors bg-white"
                      />
                      <button
                        type="submit"
                        disabled={resetLoading}
                        className="border-2 border-black rounded-md px-3 py-2 bg-electric-blue text-white font-display font-bold text-xs shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-1"
                      >
                        {resetLoading ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
                        Send
                      </button>
                    </div>
                    {resetError && <p className="font-body text-xs text-red-500">{resetError}</p>}
                  </form>
                )}
              </div>
            )}

            {error && (
              <p className="font-body text-xs text-red-500 border-2 border-red-300 bg-red-50 rounded-md px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                'flex items-center justify-center gap-2 w-full border-2 border-black font-display font-bold py-3.5 rounded-md transition-all mt-1',
                isLoading
                  ? 'bg-near-black/40 text-white cursor-not-allowed'
                  : 'bg-electric-blue text-white shadow-[4px_4px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
              )}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              {isLoading ? 'Signing in...' : "Let's Create"}
            </button>

            <p className="font-body text-sm text-near-black/60 text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-electric-blue font-medium hover:underline underline-offset-2">
                Sign up free
              </Link>
            </p>
          </form>
        )}
      </div>

      {/* Right — Animated showcase (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-near-black border-l-2 border-black items-center justify-center relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div ref={iconsRef} className="relative z-10 grid grid-cols-3 gap-4 p-8">
          {DEMO_ICONS.map((emoji, i) => (
            <div
              key={i}
              className="float-card opacity-0 w-20 h-20 border-2 border-white/30 rounded-xl bg-white/10 flex flex-col items-center justify-center gap-1 shadow-[3px_3px_0_rgba(255,255,255,0.15)]"
            >
              <span className="text-3xl">{emoji}</span>
            </div>
          ))}
        </div>
        <p className="absolute bottom-8 font-body text-xs text-white/30 tracking-widest uppercase">
          AI-generated 3D icons
        </p>
      </div>
    </div>
  )
}
