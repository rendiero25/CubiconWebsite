import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../api/supabase'
import { getCredits } from '../api/credits'

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const loadCredits = useCallback(async (uid: string) => {
    setIsLoading(true)
    try {
      setCredits(await getCredits(uid))
    } catch {
      // keep previous balance on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const subscribeRealtime = useCallback((uid: string) => {
    // Clean up any existing subscription first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }
    const channel = supabase
      .channel(`credits-${uid}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'credits', filter: `user_id=eq.${uid}` },
        (payload) => {
          const newBalance = (payload.new as { balance: number }).balance
          setCredits(newBalance)
        },
      )
      .subscribe()
    channelRef.current = channel
  }, [])

  useEffect(() => {
    // getSession() reads from localStorage — near-instant
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null
      if (!user) { setIsLoading(false); return }
      setUserId(user.id)
      loadCredits(user.id)
      subscribeRealtime(user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null
      setUserId(uid)
      if (uid) {
        loadCredits(uid)
        subscribeRealtime(uid)
      } else {
        setCredits(null)
        setIsLoading(false)
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current)
          channelRef.current = null
        }
      }
    })

    return () => {
      subscription.unsubscribe()
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [loadCredits, subscribeRealtime])

  const refresh = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      setCredits(await getCredits(userId))
    } catch {
      // keep previous balance
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  return { credits, setCredits, isLoading, refresh }
}
