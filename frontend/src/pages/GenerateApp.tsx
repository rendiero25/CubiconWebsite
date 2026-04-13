import { useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import Navbar from '../components/layout/Navbar'
import LeftPanel from './generate/LeftPanel'
import RightPanel from './generate/RightPanel'
import ConfirmModal from './generate/ConfirmModal'
import Toast from './generate/Toast'
import { OutOfCreditsModal, FreeTierLockModal } from './generate/EdgeModals'
import { useCredits } from '../hooks/useCredits'
import { useAuth } from '../hooks/useAuth'
import { recordAdminUsage } from '../hooks/useAdminUsage'
import { generateIcon } from '../api/generate'
import { removeBackground } from '@imgly/background-removal'
import type { FormState, GenerateState, GenerateResult } from './generate/types'
import { getBatchLines, calcCost } from './generate/types'

const DEFAULT_FORM: FormState = {
  mode: 'single',
  prompt: '',
  batchText: '',
  style: 'clay-pastel',
  resolution: '1K',
  background: 'transparent',
  bgColor: '#ffffff',
  bgGradient: ['#3B5BDB', '#E8EDFF'],
  referenceFile: null,
  variation: false,
}

// TODO: replace with real auth context once auth is implemented

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
  const [generateState, setGenerateState] = useState<GenerateState>('idle')
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [promptError, setPromptError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showOutOfCredits, setShowOutOfCredits] = useState(false)
  const [showLockModal, setShowLockModal] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const { credits, setCredits } = useCredits()
  const creditBadgeRef = useRef<HTMLSpanElement>(null)

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const validate = (): boolean => {
    if (form.mode === 'single') {
      if (!form.prompt.trim()) {
        setPromptError('Please describe your icon')
        triggerShake()
        return false
      }
    } else {
      const lines = getBatchLines(form.batchText)
      if (lines.length < 3) {
        setPromptError(`Add at least 3 prompts for batch mode (${lines.length} found)`)
        triggerShake()
        return false
      }
      if (lines.length > 10) {
        setPromptError('Maximum 10 icons per batch')
        triggerShake()
        return false
      }
    }
    setPromptError(null)
    return true
  }

  const handleRequestGenerate = () => {
    if (!validate()) return
    const cost = calcCost(form)
    // Admin uses free API quota — bypass credit check
    if (!isAdmin && (credits === null || credits < cost)) {
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

    // Admin: add free credits to balance with green GSAP flash
    // Non-admin: deduct credits with red GSAP flash
    const prevCredits = credits
    if (isAdmin) {
      setCredits((prev) => (prev ?? 0) + cost)
      if (creditBadgeRef.current) {
        gsap.fromTo(
          creditBadgeRef.current,
          { scale: 1.2, color: '#16a34a' },
          { scale: 1, color: '#1A1A1A', duration: 0.6, ease: 'back.out(1.7)' },
        )
      }
    } else {
      setCredits((prev) => (prev ?? 0) - cost)
      if (creditBadgeRef.current) {
        gsap.fromTo(
          creditBadgeRef.current,
          { scale: 1.15, color: '#ef4444' },
          { scale: 1, color: '#1A1A1A', duration: 0.5, ease: 'back.out(1.7)' },
        )
      }
    }

    try {
      const baseParams = {
        style: activeForm.style,
        resolution: activeForm.resolution,
        background: activeForm.background,
        bgColor: activeForm.bgColor,
        bgGradient: activeForm.bgGradient,
        userId: user?.id,
        isAdmin,
      }

      if (activeForm.mode === 'batch') {
        const lines = getBatchLines(activeForm.batchText)
        const results = await Promise.all(
          lines.map((prompt) => generateIcon({ prompt, ...baseParams })),
        )
        const imageUrls = await Promise.all(
          results.map(async (r) => {
            if (activeForm.background === 'transparent' && r.imageUrl) {
              const blob = await removeBackground(r.imageUrl)
              return URL.createObjectURL(blob)
            }
            return r.imageUrl ?? ''
          }),
        )
        setResult({ imageUrls })
        if (isAdmin) {
          recordAdminUsage({
            timestamp: new Date().toISOString(),
            prompt: `[Batch ×${lines.length}] ${lines[0] ?? ''}`,
            style: activeForm.style,
            resolution: activeForm.resolution,
            creditsSaved: cost,
          })
        }
      } else {
        const r = await generateIcon({ prompt: activeForm.prompt, ...baseParams })
        if (activeForm.background === 'transparent' && r.imageUrl) {
          const blob = await removeBackground(r.imageUrl)
          r.imageUrl = URL.createObjectURL(blob)
        }
        setResult(r)
        if (isAdmin) {
          recordAdminUsage({
            timestamp: new Date().toISOString(),
            prompt: activeForm.prompt,
            style: activeForm.style,
            resolution: activeForm.resolution,
            creditsSaved: cost,
          })
        }
      }
      setGenerateState('success')
    } catch (err) {
      setGenerateState('error')
      setCredits(prevCredits) // rollback on failure (both admin and non-admin)
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
      <Navbar creditBadgeRef={creditBadgeRef} />

      <main className="flex-1 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-16 py-6">
        {/* Left Panel */}
        <aside className="w-full lg:w-100 lg:shrink-0">
          <div className="p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <LeftPanel
              form={form}
              onChange={setField}
              credits={credits}
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
          <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0px_#000] p-5 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] overflow-hidden">
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
          credits={credits}
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
