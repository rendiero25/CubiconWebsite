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
      <div className="bg-[#F5F7FF] border-2 border-black rounded-md shadow-[8px_8px_0px_#000] w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black">
          <h2 className="font-display font-bold text-lg text-[#1A1A1A]">Out of credits ⚡</h2>
          <button onClick={onClose} className="cursor-pointer p-1 hover:bg-[#E8EDFF] rounded transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4">
          <p className="font-body text-sm text-[#1A1A1A]/70">
            You've used all your credits. Top up to keep generating icons.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 font-body font-medium text-sm py-2.5 border-2 border-black rounded-md bg-white hover:bg-[#E8EDFF] transition-colors"
            >
              Cancel
            </button>
            <Link
              to="/pricing"
              className="cursor-pointer flex-1 font-display font-bold text-sm py-2.5 bg-[#3B5BDB] text-white border-2 border-black rounded-md shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-center"
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
      <div className="bg-[#F5F7FF] border-2 border-black rounded-md shadow-[8px_8px_0px_#000] w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black">
          <h2 className="font-display font-bold text-lg text-[#1A1A1A]">
            🔒 {resolution} Locked
          </h2>
          <button onClick={onClose} className="cursor-pointer p-1 hover:bg-[#E8EDFF] rounded transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4">
          <p className="font-body text-sm text-[#1A1A1A]/70">
            {resolution} resolution is only available on paid plans. Upgrade to unlock higher
            quality exports.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 font-body font-medium text-sm py-2.5 border-2 border-black rounded-md bg-white hover:bg-[#E8EDFF] transition-colors"
            >
              Stay on 1K
            </button>
            <Link
              to="/pricing"
              className="cursor-pointer flex-1 font-display font-bold text-sm py-2.5 bg-[#3B5BDB] text-white border-2 border-black rounded-md shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-center"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
