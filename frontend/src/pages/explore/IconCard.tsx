import { Link } from 'react-router-dom'
import { Wand2, Lock } from 'lucide-react'
import type { PublicIcon } from '../../api/icons'

interface IconCardProps {
  icon: PublicIcon
  isOwner?: boolean
  onToggleVisibility?: (id: string) => void
}

export default function IconCard({ icon, isOwner, onToggleVisibility }: IconCardProps) {
  const encoded = encodeURIComponent(icon.prompt)

  return (
    <div className="h-full w-full overflow-hidden">
      {/* Image — fills the grid cell */}
      <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
        <img
          src={icon.url}
          alt={icon.prompt}
          className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-near-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <Link
            to={`/app?prompt=${encoded}`}
            className="cursor-pointer flex items-center gap-1.5 bg-off-white text-near-black font-display font-bold text-xs px-3 py-2 border-2 border-[#0A1628] rounded-md shadow-[2px_2px_0px_#0A1628] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Wand2 size={12} /> Generate Similar
          </Link>
          {isOwner && onToggleVisibility && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleVisibility(icon.id) }}
              className="cursor-pointer flex items-center gap-1.5 bg-off-white/90 text-near-black font-display font-bold text-xs px-3 py-2 border-2 border-[#0A1628] rounded-md shadow-[2px_2px_0px_#0A1628] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Lock size={12} /> Make Private
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
