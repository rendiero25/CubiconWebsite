import clsx from 'clsx'
import StepMode from './StepMode'
import StepPrompt from './StepPrompt'
import StepStyle from './StepStyle'
import StepResolution from './StepResolution'
import StepBackground from './StepBackground'
import StepReference from './StepReference'
import type { FormState, GenerateState } from './types'
import { calcCost } from './types'

interface Props {
  form: FormState
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  credits: number
  generateState: GenerateState
  promptError: string | null
  shake: boolean
  isFreeUser: boolean
  isAdmin?: boolean
  onRequestGenerate: () => void
  onLocked: () => void
}

export default function LeftPanel({
  form,
  onChange,
  credits,
  generateState,
  promptError,
  shake,
  isFreeUser,
  isAdmin,
  onRequestGenerate,
  onLocked,
}: Props) {
  const cost = calcCost(form)
  const hasEnough = isAdmin || credits >= cost
  const isLoading = generateState === 'loading'

  return (
    <div className="flex flex-col gap-5">
      <StepMode value={form.mode} onChange={(v) => onChange('mode', v)} />
      <StepPrompt
        mode={form.mode}
        prompt={form.prompt}
        batchText={form.batchText}
        onPromptChange={(v) => onChange('prompt', v)}
        onBatchChange={(v) => onChange('batchText', v)}
        shake={shake}
        error={promptError}
      />
      <StepStyle value={form.style} onChange={(v) => onChange('style', v)} />
      <StepResolution
        value={form.resolution}
        onChange={(v) => onChange('resolution', v)}
        isFreeUser={isFreeUser}
        onLocked={onLocked}
      />
      <StepBackground
        value={form.background}
        bgColor={form.bgColor}
        bgGradient={form.bgGradient}
        onChange={(v) => onChange('background', v)}
        onBgColorChange={(v) => onChange('bgColor', v)}
        onBgGradientChange={(v) => onChange('bgGradient', v)}
      />
      <StepReference file={form.referenceFile} onChange={(v) => onChange('referenceFile', v)} />

      {/* Credit summary + CTA */}
      <div className="border-t-2 border-black pt-4 mt-1">
        <p className="font-body text-sm text-near-black/70 mb-3">
          This will use{' '}
          <span className="font-bold text-near-black">
            {cost} credit{cost !== 1 ? 's' : ''}
          </span>{' '}
          · You have{' '}
          <span className={clsx('font-bold', hasEnough ? 'text-electric-blue' : 'text-red-500')}>
            {credits} remaining
          </span>
        </p>
        <button
          onClick={onRequestGenerate}
          disabled={isLoading}
          className={clsx(
            'cursor-pointer w-full font-display font-bold text-base py-3 border-2 border-black rounded-md transition-all',
            isLoading
              ? 'bg-electric-blue/60 text-white cursor-not-allowed'
              : 'bg-electric-blue text-white shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none',
          )}
        >
          {isLoading ? 'Generating…' : 'Generate Icon'}
        </button>
      </div>
    </div>
  )
}
