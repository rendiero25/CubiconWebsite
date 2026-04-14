import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

export interface PublicIcon {
  id: string
  prompt: string
  style: string
  resolution: string
  url: string
  is_public?: boolean
  created_at: string
  user_id: string
}

export interface IconFilters {
  search?: string
  style?: string
  resolution?: string
  sort?: 'latest' | 'trending'
  page?: number
  limit?: number
}

export async function getPublicIcons(filters: IconFilters = {}): Promise<PublicIcon[]> {
  const { search, style, resolution, sort = 'latest', page = 0, limit = 20 } = filters

  let query = supabase
    .from('icons')
    .select('id, prompt, style, resolution, url, created_at, user_id')
    .eq('is_public', true)

  if (search) {
    query = query.ilike('prompt', `%${search}%`)
  }
  if (style) {
    query = query.eq('style', style)
  }
  if (resolution) {
    query = query.eq('resolution', resolution)
  }

  query = query
    .order('created_at', { ascending: sort !== 'latest' })
    .range(page * limit, (page + 1) * limit - 1)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as PublicIcon[]
}

/**
 * Upload a final image to Supabase Storage bucket "icons".
 * Accepts a data URL (base64) or blob URL.
 * Returns the public URL. No external API key needed — uses the existing Supabase project.
 *
 * One-time setup required in Supabase dashboard:
 *   Storage → New bucket → Name: "icons" → Public: ON
 */
export async function uploadToSupabaseStorage(dataUrl: string, fileName: string): Promise<string> {
  // Resolve data/blob URL to a Blob
  const fetchRes = await fetch(dataUrl)
  const blob = await fetchRes.blob()
  const ext = (blob.type.split('/')[1] ?? 'png').split('+')[0]
  const path = `${fileName}-${Date.now()}.${ext}`

  const { error: uploadErr } = await supabase.storage
    .from('icons')
    .upload(path, blob, { contentType: blob.type, upsert: false })
  if (uploadErr) throw new Error(uploadErr.message)

  const { data } = supabase.storage.from('icons').getPublicUrl(path)
  return data.publicUrl
}

/**
 * Upload a final image (base64 data URL or blob URL converted to base64) to Cloudinary
 * via the backend upload proxy. Returns the Cloudinary secure URL.
 */
export async function uploadIcon(imageDataUrl: string, fileName?: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: imageDataUrl, fileName }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? `Upload failed: HTTP ${res.status}`)
  }
  const { url } = await res.json() as { url: string }
  return url
}

/**
 * Save a generated icon's metadata to the Supabase icons table.
 * Uses anon key + RLS — user_id must match the authenticated user.
 */
export async function saveIcon(icon: {
  userId: string
  prompt: string
  style: string
  resolution: string
  url: string
  isPublic?: boolean
}): Promise<void> {
  const { error } = await supabase.from('icons').insert({
    user_id: icon.userId,
    prompt: icon.prompt,
    style: icon.style,
    resolution: icon.resolution,
    url: icon.url,
    is_public: icon.isPublic ?? false,
    created_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
}

/**
 * Convert a blob: URL to a base64 data URL (needed before uploading to Cloudinary).
 */
export async function blobUrlToBase64(blobUrl: string): Promise<string> {
  const res = await fetch(blobUrl)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
