import { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
  action?: { label: string; onClick: () => void }
}

export default function Toast({ message, type, onDismiss, action }: Props) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 4500)
    return () => clearTimeout(id)
  }, [onDismiss])

  return (
    <div
      className={clsx(
        'fixed bottom-6 right-4 z-50 flex items-start gap-3 border-2 border-black rounded-md px-4 py-3 shadow-[4px_4px_0px_#000] max-w-xs w-full',
        type === 'error' ? 'bg-red-50' : 'bg-[#E8EDFF]',
      )}
    >
      {type === 'error' ? (
        <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
      ) : (
        <CheckCircle size={18} className="text-[#3B5BDB] mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-[#1A1A1A]">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="font-body text-xs font-medium text-[#3B5BDB] mt-1 underline"
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors mt-0.5"
      >
        <X size={16} />
      </button>
    </div>
  )
}
