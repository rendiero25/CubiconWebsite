import { useState, useCallback, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import Navbar, { type NavColors } from '../components/layout/Navbar'
import LeftPanel from './generate/LeftPanel'
import RightPanel from './generate/RightPanel'
import ConfirmModal from './generate/ConfirmModal'
import Toast from './generate/Toast'
import { OutOfCreditsModal, FreeTierLockModal } from './generate/EdgeModals'
import { useCredits } from '../hooks/useCredits'
import { useAuth } from '../hooks/useAuth'
import { recordAdminUsage } from '../hooks/useAdminUsage'
import { generateIcon } from '../api/generate'
import { uploadIcon, blobUrlToBase64, saveIcon } from '../api/icons'
import { removeBackground } from '@imgly/background-removal'
import { makeSquare } from '../utils/imageUtils'
import type { FormState, GenerateState, GenerateResult } from './generate/types'
import { calcCost } from './generate/types'

// isnet_fp16: half-precision ISNet — 2–3× faster than isnet, near-identical accuracy
const BG_REMOVAL_CONFIG = {
  model: 'isnet_fp16' as const,
  output: { format: 'image/png' as const, quality: 1 },
}

const DEFAULT_FORM: FormState = {
  mode: 'preset',
  prompt: '',
  style: 'clay_pastel',
  angle: 'isometric',
  resolution: '1K',
  referenceFile: null,
  variation: false,
}

// ─── GENERATE APP — NAVBAR COLOR OVERRIDE ────────────────────────────────────
const GENERATE_NAV_COLORS: Partial<NavColors> = {
  bg:                'bg-gradient-to-r from-electric-yellow via-electric-yellow to-near-black',
  logo:              'text-near-black',
  logoHover:         'hover:text-off-white',
  link:              'text-near-black',
  linkHover:         'hover:text-off-white',
  linkActive:        'text-off-white',
  creditBadgeBg:     'bg-light-green',
  creditBadgeBorder: 'border-near-black',
  creditBadgeText:   'text-near-black',
  creditBadgeIcon:   'text-electric-yellow',
  dashboardBg:       'bg-electric-yellow',
  dashboardText:     'text-near-black',
  dashboardBorder:   'border-near-black',
  dashboardShadow:   'shadow-[3px_3px_0px_var(--color-light-green)]',
  loginText:         'text-near-black',
  loginHover:        'hover:text-off-white',
  startFreeBg:       'bg-near-black',
  startFreeText:     'text-electric-yellow',
  startFreeBorder:   'border-near-black',
  startFreeShadow:   'shadow-[3px_3px_0px_var(--color-off-white)]',
  mobileBg:          'bg-electric-yellow',
  mobileLinkColor:   'text-near-black',
  mobileToggle:      'border-near-black text-near-black',
}
// ─────────────────────────────────────────────────────────────────────────────

type ToastState = {
  message: string
  type: 'success' | 'error'
  action?: { label: string; onClick: () => void }
}

export default function GenerateApp() {
  const { user, isAdmin } = useAuth()
  const isFreeUser = user === null
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState<FormState>({
    ...DEFAULT_FORM,
    prompt: searchParams.get('prompt') ?? '',
  })
  const [generateState, setGenerateState] = useState<GenerateState>(() => {
    try {
      return sessionStorage.getItem('cubicon_result') ? 'success' : 'idle'
    } catch { return 'idle' }
  })
  const [result, setResult] = useState<GenerateResult | null>(() => {
    try {
      const saved = sessionStorage.getItem('cubicon_result')
      return saved ? (JSON.parse(saved) as GenerateResult) : null
    } catch { return null }
  })
  const [promptError, setPromptError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showOutOfCredits, setShowOutOfCredits] = useState(false)
  const [showLockModal, setShowLockModal] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const { credits, setCredits } = useCredits()
  const creditBadgeRef = useRef<HTMLSpanElement>(null)

  // Persist last result across browser refreshes
  useEffect(() => {
    try {
      if (result) sessionStorage.setItem('cubicon_result', JSON.stringify(result))
      else sessionStorage.removeItem('cubicon_result')
    } catch { /* storage unavailable */ }
  }, [result])

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const validate = (): boolean => {
    if (!form.prompt.trim()) {
      setPromptError(
        form.mode === 'preset' ? 'Please enter an object name' : 'Please write your prompt',
      )
      triggerShake()
      return false
    }
    setPromptError(null)
    return true
  }

  const persistIcon = useCallback(async (imageUrl: string, prompt: string, style: string, resolution: string, userId: string) => {
    try {
      const dataUrl = imageUrl.startsWith('blob:') ? await blobUrlToBase64(imageUrl) : imageUrl
      const cloudinaryUrl = await uploadIcon(dataUrl, `icon-${userId.slice(0, 8)}`)
      await saveIcon({ userId, prompt, style, resolution, url: cloudinaryUrl })
    } catch (err) {
      setToast({
        message: `Icon generated, but save failed: ${(err as Error).message}`,
        type: 'error',
      })
    }
  }, [])

  const handleRequestGenerate = () => {
    if (!validate()) return
    const cost = calcCost(form)
    if (credits === null || credits < cost) {
      setShowOutOfCredits(true)
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmGenerate = async (withVariation: boolean) => {
    setShowConfirm(false)
    const activeForm = { ...form, variation: withVariation }
    const cost = calcCost(activeForm)

    setGenerateState('loading')
    setResult(null)

    // Optimistic credit deduction with GSAP flash
    const prevCredits = credits
    setCredits((prev) => (prev ?? 0) - cost)
    if (creditBadgeRef.current) {
      gsap.fromTo(
        creditBadgeRef.current,
        { scale: 1.15, color: '#ef4444' },
        { scale: 1, color: 'near-black', duration: 0.5, ease: 'back.out(1.7)' },
      )
    }

    try {
      const baseParams = {
        prompt: activeForm.prompt,
        mode: activeForm.mode,
        style: activeForm.style,
        angle: activeForm.angle,
        hasStyleRef: !!activeForm.referenceFile,
        resolution: activeForm.resolution,
        userId: user?.id,
        isAdmin,
      }

      const processImage = async (imageUrl: string): Promise<string> => {
        if (!imageUrl) return ''
        const blob = await removeBackground(imageUrl, BG_REMOVAL_CONFIG)
        const b64 = await blobUrlToBase64(URL.createObjectURL(blob))
        return makeSquare(b64)
      }

      if (withVariation) {
        // Variation ×3: call API 3 times with the same prompt
        const results = await Promise.all([
          generateIcon(baseParams),
          generateIcon(baseParams),
          generateIcon(baseParams),
        ])
        const imageUrls = await Promise.all(
          results.map((r) => processImage(r.imageUrl ?? '')),
        )
        setResult({ imageUrls })
        if (user?.id) {
          void Promise.allSettled(
            imageUrls.map((url) =>
              persistIcon(url, activeForm.prompt, activeForm.style, activeForm.resolution, user.id),
            ),
          )
        }
        if (isAdmin) {
          recordAdminUsage({
            timestamp: new Date().toISOString(),
            prompt: `[×3 variation] ${activeForm.prompt}`,
            style: activeForm.style,
            resolution: activeForm.resolution,
            creditsUsed: cost,
          })
        }
      } else {
        const r = await generateIcon(baseParams)
        const finalImageUrl = await processImage(r.imageUrl ?? '')
        r.imageUrl = finalImageUrl
        setResult(r)
        if (user?.id) {
          void persistIcon(finalImageUrl, activeForm.prompt, activeForm.style, activeForm.resolution, user.id)
        }
        if (isAdmin) {
          recordAdminUsage({
            timestamp: new Date().toISOString(),
            prompt: activeForm.prompt,
            style: activeForm.style,
            resolution: activeForm.resolution,
            creditsUsed: cost,
          })
        }
      }
      setGenerateState('success')
    } catch (err) {
      setGenerateState('error')
      setCredits(prevCredits)
      setToast({
        message: (err as Error).message || 'Generation failed. Please try again.',
        type: 'error',
        action: {
          label: 'Try Again',
          onClick: () => {
            setToast(null)
            handleRequestGenerate()
          },
        },
      })
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      <Navbar creditBadgeRef={creditBadgeRef} colors={GENERATE_NAV_COLORS} />

      <main className="flex-1 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-16 py-6">
        {/* Left Panel */}
        <aside className="w-full lg:w-100 lg:shrink-0">
          <div className="p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <LeftPanel
              form={form}
              onChange={setField}
              credits={credits ?? 0}
              generateState={generateState}
              promptError={promptError}
              shake={shake}
              isFreeUser={isFreeUser}
              isAdmin={isAdmin}
              onRequestGenerate={handleRequestGenerate}
              onLocked={() => setShowLockModal(true)}
            />
          </div>
        </aside>

        {/* Right Panel */}
        <section className="flex-1 min-w-0">
          <div className="border-2 border-near-black rounded-md bg-off-white shadow-[4px_4px_0px_near-black] p-5 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] overflow-hidden">
            <RightPanel
              generateState={generateState}
              result={result}
              form={form}
              onRegenerate={handleRequestGenerate}
              onShareToExplore={() =>
                setToast({ message: 'Shared to Explore!', type: 'success' })
              }
            />
          </div>
        </section>
      </main>

      {/* Modals */}
      {showConfirm && (
        <ConfirmModal
          form={form}
          credits={credits ?? 0}
          isAdmin={isAdmin}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmGenerate}
        />
      )}
      {showOutOfCredits && <OutOfCreditsModal onClose={() => setShowOutOfCredits(false)} />}
      {showLockModal && (
        <FreeTierLockModal
          resolution={form.resolution}
          onClose={() => setShowLockModal(false)}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          action={toast.action}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}
