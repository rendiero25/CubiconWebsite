import { useState, useRef } from 'react'
import { ChevronDown, ChevronUp, Upload, X } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  file: File | null
  onChange: (f: File | null) => void
}

export default function StepReference({ file, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onChange(f)
  }

  return (
    <div className="border-2 border-[#0A1628] rounded-md overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="cursor-pointer w-full flex items-center justify-between px-4 py-3 bg-off-white hover:bg-light-green transition-colors"
      >
        <span className="font-body text-sm font-medium text-[#0A1628]">
          Upload style reference{' '}
          <span className="text-[#0A1628]/40 font-normal">(optional)</span>
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="border-t-2 border-[#0A1628] p-3 bg-off-white">
          {file ? (
            <div className="flex items-center justify-between border-2 border-[#0A1628] rounded-md px-3 py-2">
              <span className="font-body text-sm truncate">{file.name}</span>
              <button
                onClick={() => onChange(null)}
                className="ml-2 text-[#0A1628]/40 hover:text-[#0A1628] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              className={clsx(
                'cursor-pointer border-2 border-dashed border-[#0A1628] rounded-md p-6 flex flex-col items-center gap-2 transition-colors',
                dragging ? 'bg-light-green' : 'bg-off-white hover:bg-[#FFFCF2]',
              )}
            >
              <Upload size={20} className="text-[#0A1628]/40" />
              <p className="font-body text-xs text-[#0A1628]/60 text-center">
                Drag & drop or click to upload
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) onChange(e.target.files[0])
            }}
          />
        </div>
      )}
    </div>
  )
}
