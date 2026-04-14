import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../api/supabase'
import { getCredits } from '../api/credits'

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const subscribedUidRef = useRef<string | null>(null)

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
    // Already subscribed for this uid — skip
    if (subscribedUidRef.current === uid && channelRef.current) return

    // Tear down any previous channel synchronously before creating a new one
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    subscribedUidRef.current = uid

    // Use a unique channel name with timestamp to avoid reusing a stale channel
    const channel = supabase
      .channel(`credits-${uid}-${Date.now()}`)
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
    // getSession reads from localStorage — fast path for initial credit load only.
    // Subscription is set up exclusively via onAuthStateChange to avoid double-subscribe.
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null
      if (!user) { setIsLoading(false); return }
      setUserId(user.id)
      loadCredits(user.id)
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
          subscribedUidRef.current = null
        }
      }
    })

    return () => {
      subscription.unsubscribe()
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
        subscribedUidRef.current = null
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
