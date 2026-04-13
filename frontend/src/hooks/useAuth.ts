import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../api/supabase'

// Hard-coded admin emails — also set `role: 'admin'` in Supabase Auth user
// app_metadata for production via:
//   UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
//   WHERE email = 'workspace.rendy@gmail.com';
const ADMIN_EMAILS = ['workspace.rendy@gmail.com']

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // getSession() reads from localStorage — no Web Lock acquired, safe in React Strict Mode
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAdmin =
    user?.app_metadata?.role === 'admin' ||
    ADMIN_EMAILS.includes(user?.email ?? '')

  return { user, isAdmin, isLoading }
}
