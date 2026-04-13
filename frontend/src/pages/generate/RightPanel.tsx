import { useEffect, useRef } from 'react'
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
      <div className="h-full flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <div className="w-28 h-28 border-2 border-dashed border-black/20 rounded-2xl flex items-center justify-center">
          <span className="text-5xl opacity-20">🎲</span>
        </div>
        <p className="font-body text-[#1A1A1A]/40 text-sm text-center max-w-[180px]">
          Your icon will appear here
        </p>
      </div>
    )
  }

  /* ── Loading state ── */
  if (generateState === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 min-h-[400px]">
        <div
          ref={cubeRef}
          className="w-20 h-20 bg-[#3B5BDB] border-2 border-black rounded-xl shadow-[4px_4px_0px_#000]"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <p className="font-body text-[#1A1A1A]/50 text-sm">Crafting your icon…</p>
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
              className="border-2 border-black rounded-md overflow-hidden aspect-square bg-[#E8EDFF] flex items-center justify-center"
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
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 font-display font-bold text-sm py-2.5 bg-[#3B5BDB] text-white border-2 border-black rounded-md shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <Download size={16} />
            Download All (.zip)
          </button>
          <button
            onClick={onRegenerate}
            className="cursor-pointer p-2.5 border-2 border-black rounded-md bg-white shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            title="Regenerate"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
    )
  }

  /* ── Single result ── */
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 border-2 border-black rounded-md bg-[#E8EDFF] flex items-center justify-center min-h-[300px]">
        {result?.imageUrl ? (
          <img
            src={result.imageUrl}
            alt="Generated icon"
            className="max-w-full max-h-full object-contain p-6"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 p-10">
            <div className="w-24 h-24 bg-[#3B5BDB]/10 border-2 border-[#3B5BDB]/20 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <p className="font-body text-sm text-[#1A1A1A]/50">
              Icon generated (backend placeholder)
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {result?.imageUrl ? (
          <a
            href={result.imageUrl}
            download="cubicon-icon.png"
            className="cursor-pointer flex items-center gap-2 font-display font-bold text-sm px-4 py-2.5 bg-[#3B5BDB] text-white border-2 border-black rounded-md shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <Download size={16} />
            Download PNG
          </a>
        ) : null}
        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 font-body font-medium text-sm px-4 py-2.5 border-2 border-black rounded-md bg-white shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <RefreshCw size={16} />
          Regenerate
        </button>
        <button
          onClick={onShareToExplore}
          className="flex items-center gap-2 font-body font-medium text-sm px-4 py-2.5 border-2 border-black rounded-md bg-white shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <Share2 size={16} />
          Share to Explore
        </button>
      </div>
    </div>
  )
}
