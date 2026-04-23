export type GenerateMode = 'preset' | 'free'
export type IconStyle =
  | 'clay_pastel'
  | 'studio_float'
  | 'frosted_glass'
  | 'obsidian'
  | 'holographic'
  | 'soft_render'
export type Angle =
  | 'isometric'
  | 'front_34'
  | 'top_down'
  | 'cinematic'
  | 'floating_sym'
export type Resolution = '1K' | '2K' | '4K'
export type GenerateState = 'idle' | 'loading' | 'success' | 'error'

export interface FormState {
  mode: GenerateMode
  prompt: string
  style: IconStyle
  angle: Angle
  resolution: Resolution
  referenceFile: File | null
  variation: boolean
}

export interface GenerateResult {
  imageUrl?: string
  imageUrls?: string[]
}

export const CREDIT_COST: Record<Resolution, number> = { '1K': 1, '2K': 2, '4K': 3 }

export function calcCost(
  form: Pick<FormState, 'resolution' | 'variation'>,
): number {
  return CREDIT_COST[form.resolution] * (form.variation ? 3 : 1)
}
