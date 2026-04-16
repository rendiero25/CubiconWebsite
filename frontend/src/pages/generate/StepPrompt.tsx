import clsx from 'clsx'
import type { GenerateMode } from './types'
import { getBatchLines } from './types'

interface Props {
  mode: GenerateMode
  prompt: string
  batchText: string
  onPromptChange: (v: string) => void
  onBatchChange: (v: string) => void
  shake: boolean
  error: string | null
}

export default function StepPrompt({
  mode,
  prompt,
  batchText,
  onPromptChange,
  onBatchChange,
  shake,
  error,
}: Props) {
  const lineCount = getBatchLines(batchText).length

  if (mode === 'single') {
    return (
      <div>
        <p className="font-body text-sm font-medium text-[#0A1628] mb-2">Prompt</p>
        <input
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder='Describe your icon — e.g. "Shopping cart"'
          className={clsx(
            'w-full border-2 border-[#0A1628] rounded-md px-3 py-2.5 font-body text-sm outline-none focus:border-[#FFC300] transition-colors bg-white',
            shake && 'animate-[shake_0.4s_ease]',
            error && 'border-red-500',
          )}
        />
        {error && <p className="font-body text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-body text-sm font-medium text-[#0A1628]">Prompts</p>
        <span
          className={clsx(
            'font-body text-xs font-medium',
            lineCount > 0 && lineCount < 3 ? 'text-red-500' : 'text-[#FFC300]',
          )}
        >
          {lineCount}/10 icons
        </span>
      </div>
      <textarea
        value={batchText}
        onChange={(e) => onBatchChange(e.target.value)}
        placeholder={'Shopping cart\nCloud storage\nAnalytics dashboard'}
        rows={6}
        className={clsx(
          'w-full border-2 border-[#0A1628] rounded-md px-3 py-2.5 font-body text-sm outline-none focus:border-[#FFC300] transition-colors resize-none bg-white',
          shake && 'animate-[shake_0.4s_ease]',
          error && 'border-red-500',
        )}
      />
      {lineCount > 0 && lineCount < 3 && (
        <p className="font-body text-xs text-amber-600 mt-1">
          Minimum 3 icons for batch mode
        </p>
      )}
      {error && <p className="font-body text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
