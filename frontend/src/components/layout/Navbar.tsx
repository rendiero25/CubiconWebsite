import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'

const NAV_LINKS = [
  { label: 'Generate', href: '/app' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Explore', href: '/explore' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-[#F5F7FF] border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-extrabold text-2xl text-[#1A1A1A] tracking-tight"
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
                'font-body text-sm font-medium transition-colors',
                location.pathname === link.href
                  ? 'text-[#3B5BDB]'
                  : 'text-[#1A1A1A] hover:text-[#3B5BDB]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="font-body text-sm font-medium text-[#1A1A1A] hover:text-[#3B5BDB] transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="font-display font-bold text-sm bg-[#3B5BDB] text-white border-2 border-black px-4 py-2 rounded-md shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 border-2 border-black rounded-md"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-black bg-[#F5F7FF]">
          <div className="px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-sm font-medium text-[#1A1A1A]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-black/20">
              <Link
                to="/login"
                className="font-body text-sm font-medium text-[#1A1A1A]"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="font-display font-bold text-sm bg-[#3B5BDB] text-white border-2 border-black px-4 py-2 rounded-md shadow-[4px_4px_0px_#000] text-center flex-1"
                onClick={() => setMobileOpen(false)}
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
