import { useState } from 'react'
import type { RefObject } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap, LayoutDashboard } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../hooks/useAuth'
import { useCredits } from '../../hooks/useCredits'

const NAV_LINKS = [
  { label: 'Generate', href: '/app' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Explore', href: '/explore' },
]

interface NavbarProps {
  creditBadgeRef?: RefObject<HTMLSpanElement | null>
  noBorder?: boolean
}

export default function Navbar({ creditBadgeRef, noBorder }: NavbarProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const { credits } = useCredits()
  const isLoggedIn = user !== null

  return (
    <nav className={clsx('sticky top-0 z-50 bg-near-black')}>
      <div className="mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-extrabold text-2xl text-electric-yellow tracking-tight hover:text-light-green transition-colors"
        >
          cubicon
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={clsx(
                'cursor-pointer font-body text-sm font-medium transition-colors',
                location.pathname === link.href
                  ? 'text-electric-yellow border-electric-yellow'
                  : 'text-off-white hover:text-electric-yellow'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span
                ref={creditBadgeRef}
                className="flex items-center gap-1.5 border-2 border-[#0A1628] rounded-md px-3 py-1.5 bg-light-green font-body font-medium text-sm text-near-black"
              >
                <Zap size={14} className="text-electric-yellow" />
                {credits ?? '—'} credits
              </span>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 font-body text-sm font-medium text-near-black border-2 border-[#0A1628] px-3 py-1.5 rounded-md bg-electric-yellow  shadow-[3px_3px_0px_#FFF5CC] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="cursor-pointer font-body text-sm font-medium text-electric-yellow hover:text-off-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="font-display font-bold text-sm bg-electric-yellow text-[#0A1628] border-2 border-[#0A1628] px-4 py-2 rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="cursor-pointer md:hidden p-2 border-2 border-[#0A1628] rounded-md"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-[#0A1628] bg-off-white">
          <div className="px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'font-body text-sm font-medium border-b-2 pb-1 transition-colors',
                  location.pathname === link.href
                    ? 'text-electric-yellow border-electric-yellow'
                    : 'text-near-black border-transparent hover:text-electric-yellow'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-[#0A1628]/20">
              {isLoggedIn ? (
                <>
                  <span className="flex items-center gap-1.5 border-2 border-[#0A1628] rounded-md px-3 py-1.5 bg-light-green font-body font-medium text-sm">
                    <Zap size={14} className="text-electric-yellow" />
                    {credits ?? '—'} credits
                  </span>
                  <Link
                    to="/dashboard"
                    className="cursor-pointer flex items-center gap-1.5 font-body text-sm font-medium text-near-black border-2 border-[#0A1628] px-3 py-1.5 rounded-md bg-electric-yellow flex-1 justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="cursor-pointer font-body text-sm font-medium text-near-black"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="cursor-pointer font-display font-bold text-sm bg-electric-yellow text-[#0A1628] border-2 border-[#0A1628] px-4 py-2 rounded-md shadow-[4px_4px_0px_#0A1628] text-center flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
