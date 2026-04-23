import clsx from 'clsx'
import type { GenerateMode } from './types'

interface Props {
  mode: GenerateMode
  prompt: string
  onChange: (v: string) => void
  shake: boolean
  error: string | null
}

export default function StepPrompt({ mode, prompt, onChange, shake, error }: Props) {
  if (mode === 'preset') {
    return (
      <div>
        <p className="font-body text-sm font-medium text-[#0A1628] mb-2">Object</p>
        <input
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Type an object name — e.g. "Shopping cart"'
          className={clsx(
            'w-full border-2 border-[#0A1628] rounded-md px-3 py-2.5 font-body text-sm outline-none focus:border-[#FFC300] transition-colors bg-off-white',
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
      <p className="font-body text-sm font-medium text-[#0A1628] mb-2">Prompt</p>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Write your full prompt — e.g. "A glowing crystal ball floating above a wooden table"`}
        rows={4}
        className={clsx(
          'w-full border-2 border-[#0A1628] rounded-md px-3 py-2.5 font-body text-sm outline-none focus:border-[#FFC300] transition-colors resize-none bg-off-white',
          shake && 'animate-[shake_0.4s_ease]',
          error && 'border-red-500',
        )}
      />
      {error && <p className="font-body text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
