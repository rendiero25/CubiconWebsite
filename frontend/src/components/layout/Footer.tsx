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
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-3">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {COMPANY_LINKS.map(link => (
            <Link key={link.href} to={link.href}
              className="font-body text-xs text-white/70 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="font-body text-xs text-white/70">
          © {new Date().getFullYear()} Cubicon. All rights reserved. Powered by <a href="https://rendiero.site" target="_blank" rel="noopener noreferrer" className="text-off-white hover:text-electric-yellow">rendiero.</a>
        </p>
      </div>
    </footer>
  )
}
