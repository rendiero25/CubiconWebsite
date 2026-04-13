import { supabase } from './supabase'

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
