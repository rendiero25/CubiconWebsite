export type GenerateMode = 'single' | 'batch'
export type IconStyle =
  | 'clay-pastel'
  | 'realistic-dark'
  | 'neon-flat'
  | 'matte-minimal'
  | 'glass-morphism'
export type Resolution = '1K' | '2K' | '4K'
export type BackgroundType = 'transparent' | 'solid' | 'gradient'
export type GenerateState = 'idle' | 'loading' | 'success' | 'error'

export interface FormState {
  mode: GenerateMode
  prompt: string
  batchText: string
  style: IconStyle
  resolution: Resolution
  background: BackgroundType
  bgColor: string
  bgGradient: [string, string]
  referenceFile: File | null
  variation: boolean
}

export interface GenerateResult {
  imageUrl?: string
  imageUrls?: string[]
}

export const CREDIT_COST: Record<Resolution, number> = { '1K': 1, '2K': 2, '4K': 3 }

export function getBatchLines(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

export function calcCost(
  form: Pick<FormState, 'mode' | 'batchText' | 'resolution' | 'variation'>,
): number {
  const base = CREDIT_COST[form.resolution]
  const count =
    form.mode === 'batch' ? Math.max(getBatchLines(form.batchText).length, 1) : 1
  return base * count * (form.variation ? 3 : 1)
}
