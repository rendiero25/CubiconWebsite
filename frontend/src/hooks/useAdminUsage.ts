import { useState, useCallback } from 'react'

const STORAGE_KEY = 'cubicon_admin_usage'

export interface AdminUsageEntry {
  id: string
  timestamp: string
  prompt: string
  style: string
  resolution: string
  creditsUsed: number
}

function readLog(): AdminUsageEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

/** Call this from GenerateApp after a successful admin generation. */
export function recordAdminUsage(entry: Omit<AdminUsageEntry, 'id'>): void {
  const log = readLog()
  log.unshift({ ...entry, id: crypto.randomUUID() })
  if (log.length > 500) log.splice(500)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

export function clearAdminUsageLog(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/** Use in Dashboard to read and clear the admin usage log. */
export function useAdminUsage() {
  const [log, setLog] = useState<AdminUsageEntry[]>(readLog)

  const refresh = useCallback(() => setLog(readLog()), [])

  const clear = useCallback(() => {
    clearAdminUsageLog()
    setLog([])
  }, [])

  const totalSaved = log.reduce((s, e) => s + e.creditsUsed, 0)

  return { log, totalSaved, refresh, clear }
}