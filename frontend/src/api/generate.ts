const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export interface GenerateParams {
  prompt: string
  style: string
  resolution: string
  background: string
  bgColor?: string
  bgGradient?: [string, string]
  userId?: string
  isAdmin?: boolean
}

export interface GenerateResult {
  imageUrl?: string
  imageUrls?: string[]
}

export async function generateIcon(params: GenerateParams): Promise<GenerateResult> {
  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json()
}
