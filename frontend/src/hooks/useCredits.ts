import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../api/supabase'
import { getCredits } from '../api/credits'

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

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

  useEffect(() => {
    // getSession() reads from localStorage — no Web Lock acquired, safe in React Strict Mode
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
      } else {
        setCredits(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadCredits])

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
