import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface OutOfCreditsProps {
  onClose: () => void
}

export function OutOfCreditsModal({ onClose }: OutOfCreditsProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#FFFCF2] border-2 border-[#0A1628] rounded-md shadow-[8px_8px_0px_#0A1628] w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#0A1628]">
          <h2 className="font-display font-bold text-lg text-[#0A1628]">Out of credits ⚡</h2>
          <button onClick={onClose} className="cursor-pointer p-1 hover:bg-light-green rounded transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4">
          <p className="font-body text-sm text-[#0A1628]/70">
            You've used all your credits. Top up to keep generating icons.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 font-body font-medium text-sm py-2.5 border-2 border-[#0A1628] rounded-md bg-white hover:bg-light-green transition-colors"
            >
              Cancel
            </button>
            <Link
              to="/pricing"
              className="cursor-pointer flex-1 font-display font-bold text-sm py-2.5 bg-[#FFC300] text-[#0A1628] border-2 border-[#0A1628] rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-center"
            >
              Buy Credits
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FreeTierLockProps {
  resolution: string
  onClose: () => void
}

export function FreeTierLockModal({ resolution, onClose }: FreeTierLockProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#FFFCF2] border-2 border-[#0A1628] rounded-md shadow-[8px_8px_0px_#0A1628] w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#0A1628]">
          <h2 className="font-display font-bold text-lg text-[#0A1628]">
            🔒 {resolution} Locked
          </h2>
          <button onClick={onClose} className="cursor-pointer p-1 hover:bg-light-green rounded transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4">
          <p className="font-body text-sm text-[#0A1628]/70">
            {resolution} resolution is only available on paid plans. Upgrade to unlock higher
            quality exports.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 font-body font-medium text-sm py-2.5 border-2 border-[#0A1628] rounded-md bg-white hover:bg-light-green transition-colors"
            >
              Stay on 1K
            </button>
            <Link
              to="/pricing"
              className="cursor-pointer flex-1 font-display font-bold text-sm py-2.5 bg-[#FFC300] text-[#0A1628] border-2 border-[#0A1628] rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-center"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
