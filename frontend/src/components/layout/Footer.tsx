import { Link } from 'react-router-dom'
import clsx from 'clsx'

const COMPANY_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer({ noBorder }: { noBorder?: boolean; compact?: boolean } = {}) {
  return (
    <footer className={clsx('bg-near-black text-white shrink-0', !noBorder && 'border-t border-white/10')}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-3">
        <Link to="/" className="font-display font-extrabold text-base text-white tracking-tight">
          cubicon
        </Link>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {COMPANY_LINKS.map(link => (
            <Link key={link.href} to={link.href}
              className="font-body text-xs text-white/40 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="font-body text-xs text-white/30">
          © {new Date().getFullYear()} Cubicon. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
