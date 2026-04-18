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
    <div className="group hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all overflow-hidden">
      {/* Image */}
      <div className="aspect-square flex items-center justify-center relative overflow-hidden">
        <img
          src={icon.url}
          alt={icon.prompt}
          className="w-3/4 h-3/4 object-contain group-hover:scale-105 transition-transform duration-300"
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

      {/* Meta */}
      {/* <div className="p-3 flex flex-col gap-1.5">
        <p className="font-body text-sm font-medium text-near-black truncate">{icon.prompt}</p>
        <div className="flex gap-1.5 flex-wrap">
          <span className="font-body text-xs text-near-black/60 border border-[#0A1628]/20 rounded px-1.5 py-0.5 bg-off-white">
            {icon.style}
          </span>
          <span className="font-body text-xs font-semibold text-electric-yellow border border-electric-yellow/30 rounded px-1.5 py-0.5 bg-light-green">
            {icon.resolution}
          </span>
        </div>
      </div> */}
    </div>
  )
}
