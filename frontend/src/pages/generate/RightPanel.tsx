import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import gsap from 'gsap'
import { Download, RefreshCw, Share2 } from 'lucide-react'
import JSZip from 'jszip'
import type { GenerateState, GenerateResult, FormState } from './types'

interface Props {
  generateState: GenerateState
  result: GenerateResult | null
  form: Pick<FormState, 'mode' | 'background'>
  onRegenerate: () => void
  onShareToExplore: () => void
}

export default function RightPanel({
  generateState,
  result,
  form,
  onRegenerate,
  onShareToExplore,
}: Props) {
  const cubeRef = useRef<HTMLDivElement>(null)
  const previewBg = form.background === 'transparent' ? 'bg-off-white' : 'bg-light-green'

  useEffect(() => {
    if (generateState !== 'loading' || !cubeRef.current) return
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(cubeRef.current, { rotateY: 360, duration: 1.5, ease: 'linear' })
    return () => {
      tl.kill()
    }
  }, [generateState])

  const handleDownloadAll = async () => {
    if (!result?.imageUrls?.length) return
    const zip = new JSZip()
    result.imageUrls.forEach((url, i) => {
      const b64 = url.split(',')[1]
      if (b64) zip.file(`icon-${i + 1}.png`, b64, { base64: true })
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'cubicon-batch.zip'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  /* ── Empty state ── */
  if (generateState === 'idle' && !result) {
    return (
      <div className="w-full h-full aspect-square border-2 border-dashed border-[#0A1628]/20 rounded-md flex flex-col items-center justify-center gap-4">
        <div className="w-28 h-28 border-2 border-dashed border-[#0A1628]/20 rounded-2xl flex items-center justify-center">
          <span className="text-5xl opacity-20">🎲</span>
        </div>
        <p className="font-body text-[#0A1628]/40 text-sm text-center max-w-[180px]">
          Your icon will appear here
        </p>
      </div>
    )
  }

  /* ── Loading state ── */
  if (generateState === 'loading') {
    return (
      <div className="w-full h-full aspect-square border-2 border-[#0A1628] rounded-md bg-light-green shadow-[4px_4px_0px_#0A1628] flex flex-col items-center justify-center gap-6">
        <div
          ref={cubeRef}
          className="w-20 h-20 bg-[#FFC300] border-2 border-[#0A1628] rounded-xl shadow-[4px_4px_0px_#0A1628]"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <p className="font-body text-[#0A1628]/50 text-sm">Crafting your icon…</p>
      </div>
    )
  }

  /* ── Batch result ── */
  if (form.mode === 'batch' && result?.imageUrls) {
    return (
      <div className="flex flex-col gap-4 h-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 overflow-y-auto">
          {result.imageUrls.map((url, i) => (
            <div
              key={i}
              className={clsx('rounded-md overflow-hidden aspect-square flex items-center justify-center', previewBg)}
            >
              {url ? (
                <img
                  src={url}
                  alt={`icon-${i + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-3xl opacity-40">🎲</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleDownloadAll}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 font-display font-bold text-sm py-2.5 bg-[#FFC300] text-[#0A1628] border-2 border-[#0A1628] rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <Download size={16} />
            Download All (.zip)
          </button>
          <button
            onClick={onRegenerate}
            className="cursor-pointer p-2.5 border-2 border-[#0A1628] rounded-md bg-off-white shadow-[2px_2px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            title="Regenerate"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
    )
  }

  /* ── Single result ── */
  const handleDownloadIcon = () => {
    if (!result?.imageUrl) return
    const a = document.createElement('a')
    a.href = result.imageUrl
    a.download = 'cubicon-icon.png'
    a.click()
  }

  const handleShareIcon = async () => {
    if (!result?.imageUrl) return
    try {
      await navigator.clipboard.writeText(result.imageUrl)
      alert('Icon URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Icon Preview — fills remaining vertical space */}
      <div id='divparent' className="flex-1 min-h-0 w-full rounded-md overflow-hidden">
        <div className={clsx('w-full h-full flex items-center justify-center', previewBg)}>
          {result?.imageUrl ? (
            <img
              src={result.imageUrl}
              alt="Generated icon"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 p-10">
              <div className="w-24 h-24 bg-[#FFC300]/10 border-2 border-[#FFC300]/20 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">✅</span>
              </div>
              <p className="font-body text-sm text-[#0A1628]/50">
                Icon generated (backend placeholder)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Buttons Below Icon */}
      {result?.imageUrl && (
        <div className="flex-none flex gap-3 flex-wrap">
          <button
            onClick={handleDownloadIcon}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 font-display font-bold text-sm py-2.5 bg-[#FFC300] text-[#0A1628] border-2 border-[#0A1628] rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <Download size={16} />
            Download
          </button>
          <button
            onClick={handleShareIcon}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 font-display font-bold text-sm py-2.5 bg-off-white border-2 border-[#0A1628] rounded-md shadow-[4px_4px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <Share2 size={16} />
            Share
          </button>
          <button
            onClick={onRegenerate}
            className="cursor-pointer p-2.5 border-2 border-[#0A1628] rounded-md bg-off-white shadow-[2px_2px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            title="Regenerate"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
