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

// ─── NAVBAR COLOR CONFIG ──────────────────────────────────────────────────────
// Pass a `colors` prop to override any of these per-page.
// All values are Tailwind classes.
export interface NavColors {
  /** Navbar background */
  bg: string
  /** Logo default color */
  logo: string
  /** Logo hover color */
  logoHover: string
  /** Nav link default color */
  link: string
  /** Nav link hover color */
  linkHover: string
  /** Active nav link color */
  linkActive: string
  /** Credit badge: bg, border, text, icon */
  creditBadgeBg: string
  creditBadgeBorder: string
  creditBadgeText: string
  creditBadgeIcon: string
  /** Dashboard button: bg, text, border, shadow */
  dashboardBg: string
  dashboardText: string
  dashboardBorder: string
  dashboardShadow: string
  /** Login link color */
  loginText: string
  loginHover: string
  /** Start Free button: bg, text, border, shadow */
  startFreeBg: string
  startFreeText: string
  startFreeBorder: string
  startFreeShadow: string
  /** Mobile menu background */
  mobileBg: string
  /** Mobile menu link default color */
  mobileLinkColor: string
  /** Mobile toggle button color */
  mobileToggle: string
}

export const NAV_COLORS_DEFAULT: NavColors = {
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
// ─────────────────────────────────────────────────────────────────────────────

interface NavbarProps {
  creditBadgeRef?: RefObject<HTMLSpanElement | null>
  noBorder?: boolean
  colors?: Partial<NavColors>
}

export default function Navbar({ creditBadgeRef, noBorder, colors }: NavbarProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const { credits } = useCredits()
  const isLoggedIn = user !== null

  const c: NavColors = { ...NAV_COLORS_DEFAULT, ...colors }

  return (
    <nav className={clsx('sticky top-0 z-50', c.bg)}>
      <div className="mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          to="/"
          className={clsx('font-display font-extrabold text-2xl tracking-tight transition-colors', c.logo, c.logoHover)}
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
                  ? c.linkActive
                  : clsx(c.link, c.linkHover)
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
                className={clsx('flex items-center gap-1.5 border-2 rounded-md px-3 py-1.5 font-body font-medium text-sm', c.creditBadgeBg, c.creditBadgeBorder, c.creditBadgeText)}
              >
                <Zap size={14} className={c.creditBadgeIcon} />
                {credits ?? '—'} credits
              </span>
              <Link
                to="/dashboard"
                className={clsx('flex items-center gap-2 font-body text-sm font-medium border-2 px-3 py-1.5 rounded-md hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all', c.dashboardBg, c.dashboardText, c.dashboardBorder, c.dashboardShadow)}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={clsx('cursor-pointer font-body text-sm font-medium transition-colors', c.loginText, c.loginHover)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={clsx('font-display font-bold text-sm border-2 px-4 py-2 rounded-md hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all', c.startFreeBg, c.startFreeText, c.startFreeBorder, c.startFreeShadow)}
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={clsx('cursor-pointer md:hidden p-2 border-2 rounded-md', c.mobileToggle)}
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={clsx('md:hidden border-t-2 border-near-black', c.mobileBg)}>
          <div className="px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'font-body text-sm font-medium border-b-2 pb-1 transition-colors',
                  location.pathname === link.href
                    ? clsx(c.linkActive, 'border-current')
                    : clsx(c.mobileLinkColor, 'border-transparent', c.linkHover)
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-near-black/20">
              {isLoggedIn ? (
                <>
                  <span className={clsx('flex items-center gap-1.5 border-2 rounded-md px-3 py-1.5 font-body font-medium text-sm', c.creditBadgeBg, c.creditBadgeBorder, c.creditBadgeText)}>
                    <Zap size={14} className={c.creditBadgeIcon} />
                    {credits ?? '—'} credits
                  </span>
                  <Link
                    to="/dashboard"
                    className={clsx('cursor-pointer flex items-center gap-1.5 font-body text-sm font-medium border-2 px-3 py-1.5 rounded-md flex-1 justify-center transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none', c.dashboardBg, c.dashboardText, c.dashboardBorder)}
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
                    className={clsx('cursor-pointer font-body text-sm font-medium transition-colors', c.loginText, c.loginHover)}
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={clsx('cursor-pointer font-display font-bold text-sm border-2 px-4 py-2 rounded-md text-center flex-1', c.startFreeBg, c.startFreeText, c.startFreeBorder, c.startFreeShadow)}
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
