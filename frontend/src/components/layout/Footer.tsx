import { Link } from 'react-router-dom'
import { Globe, MessageCircle, Code } from 'lucide-react'

const PRODUCT_LINKS = [
  { label: 'Generate', href: '/app' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Explore', href: '/explore' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
]

const SOCIAL_LINKS = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: MessageCircle, href: '#', label: 'Community' },
  { icon: Code, href: '#', label: 'GitHub' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="font-display font-extrabold text-2xl text-white tracking-tight w-fit"
            >
              cubicon
            </Link>
            <p className="font-body text-sm text-white/60 max-w-xs leading-relaxed">
              AI-powered 3D isometric icons. Describe it, generate it, download it.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border-2 border-white/30 rounded-md hover:border-white hover:bg-white hover:text-[#1A1A1A] transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm text-white/40 uppercase tracking-widest">
              Product
            </h4>
            {PRODUCT_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-sm text-white/70 hover:text-white transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal + Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm text-white/40 uppercase tracking-widest">
              Company
            </h4>
            {LEGAL_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-sm text-white/70 hover:text-white transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:hello@cubicon.app"
              className="font-body text-sm text-white/70 hover:text-white transition-colors w-fit mt-1"
            >
              hello@cubicon.app
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/40">
            © {new Date().getFullYear()} Cubicon. All rights reserved.
          </p>
          <p className="font-body text-xs text-white/40">
            Made with ❤️ for creators everywhere.
          </p>
        </div>
      </div>
    </footer>
  )
}
