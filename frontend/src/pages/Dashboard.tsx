import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Download, Globe, Lock, Trash2, Settings, Wand2, LayoutGrid, ImageOff, User, Shield, BarChart2, RefreshCw, ChevronLeft, ChevronRight, PlusCircle, Pencil, Check, X as XIcon } from 'lucide-react'
import clsx from 'clsx'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../api/supabase'
import { getCredits, topUpCredits } from '../api/credits'
import type { PublicIcon } from '../api/icons'
import { useAuth } from '../hooks/useAuth'
import { CREDIT_COST } from './generate/types'

const MONITORING_PAGE_SIZE = 10

type TabKey = 'history' | 'settings' | 'profile' | 'monitoring'

interface DashboardIcon extends PublicIcon {
  selected: boolean
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const adminTodayKey = new Date().toISOString().split('T')[0]
  const [tab, setTab] = useState<TabKey>('history')
  const [userId, setUserId] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [icons, setIcons] = useState<DashboardIcon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [defaultPublic, setDefaultPublic] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [refreshingCredits, setRefreshingCredits] = useState(false)
  const [refreshingIcons, setRefreshingIcons] = useState(false)
  const [monitoringPage, setMonitoringPage] = useState(1)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [isTopping, setIsTopping] = useState(false)
  const [topUpError, setTopUpError] = useState<string | null>(null)
  const [topUpSuccess, setTopUpSuccess] = useState<string | null>(null)
  // Profile editing
  const [displayName, setDisplayName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [visibilityError, setVisibilityError] = useState<string | null>(null)
  const [visibilitySuccess, setVisibilitySuccess] = useState<string | null>(null)
  const iconChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const loadIcons = async (uid: string) => {
    const { data, error: iconErr } = await supabase
      .from('icons')
      .select('id, prompt, style, resolution, url, is_public, created_at, user_id')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    if (iconErr) throw new Error(iconErr.message)
    setIcons((data ?? []).map((ic: PublicIcon & { is_public?: boolean }) => ({ ...ic, selected: false })))
  }

  const refreshIcons = async () => {
    if (!userId) return
    setRefreshingIcons(true)
    try {
      await loadIcons(userId)
      setMonitoringPage(1)
    } finally {
      setRefreshingIcons(false)
    }
  }

  const refreshCredits = async () => {
    if (!userId) return
    setRefreshingCredits(true)
    try {
      setCredits(await getCredits(userId))
    } finally {
      setRefreshingCredits(false)
    }
  }

  const handleTopUp = async () => {
    const amount = Number(topUpAmount)
    if (!Number.isInteger(amount) || amount <= 0) {
      setTopUpError('Masukkan angka bulat positif')
      return
    }
    try {
      setIsTopping(true)
      setTopUpError(null)
      setTopUpSuccess(null)
      const newBalance = await topUpCredits(amount)
      setCredits(newBalance)
      setTopUpAmount('')
      setTopUpSuccess(`+${amount} credit berhasil ditambahkan. Saldo baru: ${newBalance}`)
    } catch (err) {
      setTopUpError(err instanceof Error ? err.message : 'Gagal top-up credit')
    } finally {
      setIsTopping(false)
    }
  }

  // Auth + load data + Realtime icon subscription
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)
        const bal = await getCredits(user.id)
        setCredits(bal)
        // Load display name from users table
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .maybeSingle()
        setDisplayName(userData?.name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? '')
        await loadIcons(user.id)

        // Realtime: auto-update History tab when icons are inserted/deleted
        if (iconChannelRef.current) supabase.removeChannel(iconChannelRef.current)
        iconChannelRef.current = supabase
          .channel(`icons-dashboard-${user.id}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'icons', filter: `user_id=eq.${user.id}` },
            (payload) => {
              setIcons((prev) => {
                // Avoid duplicates if icon already in state
                if (prev.some((ic) => ic.id === payload.new.id)) return prev
                return [{ ...(payload.new as PublicIcon), selected: false }, ...prev]
              })
            },
          )
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'icons', filter: `user_id=eq.${user.id}` },
            (payload) => {
              setIcons((prev) =>
                prev.map((ic) => (ic.id === payload.new.id ? { ...ic, ...(payload.new as PublicIcon) } : ic))
              )
            },
          )
          .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'icons', filter: `user_id=eq.${user.id}` },
            (payload) => {
              setIcons((prev) => prev.filter((ic) => ic.id !== payload.old.id))
            },
          )
          .subscribe()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    load()
    return () => {
      if (iconChannelRef.current) supabase.removeChannel(iconChannelRef.current)
    }
  }, [])

  const allSelected = icons.length > 0 && icons.every((i) => i.selected)
  const anySelected = icons.some((i) => i.selected)

  const toggleSelect = (id: string) =>
    setIcons((prev) => prev.map((ic) => (ic.id === id ? { ...ic, selected: !ic.selected } : ic)))

  const toggleSelectAll = () =>
    setIcons((prev) => prev.map((ic) => ({ ...ic, selected: !allSelected })))

  const setVisibility = async (ids: string[], isPublic: boolean) => {
    try {
      setUpdatingIds((prev) => new Set([...prev, ...ids]))
      setVisibilityError(null)
      setVisibilitySuccess(null)

      const { data, error } = await supabase
        .from('icons')
        .update({ is_public: isPublic })
        .in('id', ids)
        .select('id, is_public')

      if (error) throw new Error(error.message)
      if (!data || data.length === 0) {
        throw new Error('Update gagal: tidak ada baris yang diubah. Pastikan kamu login dan icon milikmu.')
      }

      setIcons((prev) => prev.map((ic) => (ids.includes(ic.id) ? { ...ic, is_public: isPublic } : ic)))
      setVisibilitySuccess(
        ids.length === 1
          ? isPublic
            ? null
            : 'Icon berhasil dijadikan private'
          : isPublic
            ? null
            : `${ids.length} icon berhasil diprivatkan`
      )
    } catch (err) {
      setVisibilityError(err instanceof Error ? err.message : 'Gagal mengubah visibilitas')
    } finally {
      setUpdatingIds((prev) => {
        const updated = new Set(prev)
        ids.forEach((id) => updated.delete(id))
        return updated
      })
    }
  }

  const deleteSelected = async () => {
    const ids = icons.filter((i) => i.selected).map((i) => i.id)
    if (!ids.length) return
    await supabase.from('icons').delete().in('id', ids)
    setIcons((prev) => prev.filter((ic) => !ids.includes(ic.id)))
  }

  const saveSettings = async () => {
    if (!userId) return
    try {
      setSavingSettings(true)
      await supabase.from('users').update({ default_public: defaultPublic }).eq('id', userId)
    } finally {
      setSavingSettings(false)
    }
  }

  const startEditName = () => {
    setNameInput(displayName)
    setNameError(null)
    setEditingName(true)
  }

  const cancelEditName = () => {
    setEditingName(false)
    setNameError(null)
  }

  const saveDisplayName = async () => {
    const trimmed = nameInput.trim()
    if (!trimmed) { setNameError('Nama tidak boleh kosong'); return }
    if (trimmed.length > 50) { setNameError('Maks. 50 karakter'); return }
    if (!userId) return
    try {
      setSavingName(true)
      setNameError(null)
      await supabase.from('users').update({ name: trimmed }).eq('id', userId)
      setDisplayName(trimmed)
      setEditingName(false)
    } catch (err) {
      setNameError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setSavingName(false)
    }
  }

  const selectedIds = icons.filter((i) => i.selected).map((i) => i.id)

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      {/* Header */}
      <section className="py-8 md:py-12 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-near-black">Dashboard</h1>
            <p className="font-body text-sm text-near-black/60 mt-1">Manage your icons and credits</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Credit badge */}
            <div className="flex items-center gap-1.5 border-2 border-black rounded-md px-3 py-2 bg-light-blue shadow-[2px_2px_0_#000]">
              <Zap size={14} className="text-electric-blue" />
              <span className="font-body font-semibold text-sm text-near-black">
                {credits !== null ? `${credits} credits` : '—'}
              </span>
            </div>
            <Link
              to="/pricing"
              className="border-2 border-black font-display font-bold text-sm px-4 py-2 rounded-md bg-electric-blue text-white shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Buy Credits
            </Link>
            <Link
              to="/app"
              className="border-2 border-black font-display font-bold text-sm px-4 py-2 rounded-md bg-white text-near-black shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5"
            >
              <Wand2 size={14} /> Generate
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b-2 border-black bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex gap-0">
          {([['history', 'History', LayoutGrid], ['settings', 'Settings', Settings], ['profile', 'Profile', User]] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={clsx(
                'cursor-pointer flex items-center gap-2 px-5 py-4 font-display font-semibold text-sm border-b-2 transition-colors',
                tab === key
                  ? 'border-electric-blue text-electric-blue'
                  : 'border-transparent text-near-black/50 hover:text-near-black'
              )}
            >
              <Icon size={15} />{label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => setTab('monitoring')}
              className={clsx(
                'cursor-pointer flex items-center gap-2 px-5 py-4 font-display font-semibold text-sm border-b-2 transition-colors',
                tab === 'monitoring'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-near-black/50 hover:text-near-black'
              )}
            >
              <BarChart2 size={15} /> Monitoring
            </button>
          )}
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

          {/* History Tab */}
          {tab === 'history' && (
            <div className="flex flex-col gap-5">
              {/* Bulk actions */}
              {icons.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer flex items-center gap-2 font-body text-sm font-medium text-near-black">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 border-2 border-black rounded accent-electric-blue cursor-pointer"
                      />
                      Select All
                    </label>
                    {anySelected && (
                      <>
                        <button
                          onClick={() => setVisibility(selectedIds, true)}
                          disabled={updatingIds.size > 0}
                          className="cursor-pointer flex items-center gap-1.5 border-2 border-black rounded-md px-3 py-1.5 font-body text-xs font-medium bg-white hover:bg-light-blue transition-colors shadow-[2px_2px_0_#000] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Globe size={12} /> {updatingIds.size > 0 ? 'Processing...' : 'Make Public'}
                        </button>
                        <button
                          onClick={() => setVisibility(selectedIds, false)}
                          disabled={updatingIds.size > 0}
                          className="cursor-pointer flex items-center gap-1.5 border-2 border-black rounded-md px-3 py-1.5 font-body text-xs font-medium bg-white hover:bg-light-blue transition-colors shadow-[2px_2px_0_#000] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Lock size={12} /> {updatingIds.size > 0 ? 'Processing...' : 'Make Private'}
                        </button>
                        <button
                          onClick={deleteSelected}
                          className="cursor-pointer flex items-center gap-1.5 border-2 border-red-400 rounded-md px-3 py-1.5 font-body text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={12} /> Delete ({selectedIds.length})
                        </button>
                      </>
                    )}
                    <span className="font-body text-xs text-near-black/40 ml-auto">{icons.length} icons total</span>
                  </div>
                  {visibilityError && (
                    <div className="flex items-center gap-2 bg-red-50 border-2 border-red-400 rounded-md px-3 py-2 font-body text-xs text-red-600">
                      <span>❌</span>
                      <span>{visibilityError}</span>
                    </div>
                  )}
                  {visibilitySuccess && (
                    <div className="flex items-center gap-2 bg-green-50 border-2 border-green-400 rounded-md px-3 py-2 font-body text-xs text-green-700">
                      <span>✓</span>
                      <span>{visibilitySuccess}</span>
                    </div>
                  )}
                </div>
              )}

              {error ? (
                <div className="flex flex-col items-center py-20 gap-4">
                  <ImageOff size={32} className="text-near-black/30" />
                  <p className="font-body text-sm text-near-black/60">{error}</p>
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="border-2 border-black rounded-md bg-white shadow-[3px_3px_0_#000] overflow-hidden animate-pulse">
                      <div className="aspect-square bg-light-blue/40" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-near-black/10 rounded w-3/4" />
                        <div className="h-3 bg-near-black/10 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : icons.length === 0 ? (
                <div className="flex flex-col items-center py-24 gap-5">
                  <div className="w-20 h-20 bg-light-blue border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_#000]">
                    <Wand2 size={32} className="text-electric-blue" />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-semibold text-lg text-near-black">No icons yet</p>
                    <p className="font-body text-sm text-near-black/60 mt-1">Generate your first icon to see it here.</p>
                  </div>
                  <Link
                    to="/app"
                    className="flex items-center gap-2 bg-electric-blue text-white border-2 border-black font-display font-bold px-5 py-2.5 rounded-md shadow-[4px_4px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    <Wand2 size={14} /> Start Generating
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {icons.map((icon) => (
                    <div
                      key={icon.id}
                      className={clsx(
                        'border-2 rounded-md bg-white overflow-hidden group',
                        icon.selected
                          ? 'border-electric-blue shadow-[3px_3px_0_#3B5BDB]'
                          : 'border-black shadow-[3px_3px_0_#000]'
                      )}
                    >
                      <div className="relative bg-light-blue aspect-square flex items-center justify-center border-b-2 border-black">
                        <img
                          src={icon.url}
                          alt={icon.prompt}
                          className="w-3/4 h-3/4 object-contain"
                          loading="lazy"
                        />
                        {/* Selection indicator */}
                        <div
                          className={clsx(
                            'absolute top-2 right-2 w-5 h-5 border-2 border-black rounded flex items-center justify-center transition-all cursor-pointer',
                            icon.selected ? 'bg-electric-blue' : 'bg-white/80'
                          )}
                          onClick={() => toggleSelect(icon.id)}
                        >
                          {icon.selected && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        {/* Visibility badge */}
                        <div className="absolute bottom-2 left-2">
                          {icon.is_public
                            ? <span className="flex items-center gap-1 bg-white border-2 border-black rounded px-1.5 py-0.5 font-body text-[10px] font-semibold"><Globe size={10} /> Public</span>
                            : <span className="flex items-center gap-1 bg-white border-2 border-black rounded px-1.5 py-0.5 font-body text-[10px] font-semibold"><Lock size={10} /> Private</span>
                          }
                        </div>
                      </div>

                      {/* Always-visible info + actions */}
                      <div className="p-3 flex flex-col gap-2">
                        <p className="font-body text-xs font-medium text-near-black truncate">{icon.prompt}</p>
                        <div className="flex gap-1">
                          <span className="font-body text-[10px] text-near-black/50 border border-black/15 rounded px-1 py-0.5">{icon.style}</span>
                          <span className="font-body text-[10px] font-semibold text-electric-blue border border-electric-blue/30 rounded px-1 py-0.5 bg-light-blue">{icon.resolution}</span>
                        </div>
                        <p className="font-body text-[10px] text-near-black/40">
                          {new Date(icon.created_at).toLocaleString()}
                        </p>
                        <a
                          href={icon.url}
                          download
                          className="flex items-center justify-center gap-1.5 border-2 border-black rounded-md py-1.5 font-display font-bold text-[10px] bg-electric-blue text-white shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                        >
                          <Download size={11} /> Download
                        </a>
                        <Link
                          to={`/app?prompt=${encodeURIComponent(icon.prompt)}`}
                          className="flex items-center justify-center gap-1.5 border-2 border-black rounded-md py-1.5 font-display font-bold text-[10px] bg-white shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                        >
                          <Wand2 size={11} /> Regenerate
                        </Link>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setVisibility([icon.id], !icon.is_public)}
                            disabled={updatingIds.has(icon.id)}
                            className="cursor-pointer flex-1 flex items-center justify-center gap-1 border-2 border-black rounded-md py-1.5 font-body text-[10px] font-medium bg-white shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingIds.has(icon.id) ? '...' : icon.is_public ? <><Lock size={9} /> Private</> : <><Globe size={9} /> Public</>}
                          </button>
                          <button
                            onClick={async () => {
                              await supabase.from('icons').delete().eq('id', icon.id)
                              setIcons((prev) => prev.filter((ic) => ic.id !== icon.id))
                            }}
                            className="cursor-pointer flex items-center justify-center border-2 border-red-400 rounded-md px-2 py-1.5 font-body text-[10px] font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          )}

          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="max-w-lg flex flex-col gap-5">
              {/* Avatar + name card */}
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-electric-blue border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0_#000]">
                  <span className="font-display font-bold text-2xl text-white">
                    {(displayName || user?.email || '?')
                      .split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('')}
                  </span>
                </div>
                <div className="text-center w-full">
                  {editingName ? (
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveDisplayName(); if (e.key === 'Escape') cancelEditName() }}
                        maxLength={50}
                        autoFocus
                        className="border-2 border-black rounded-md px-3 py-1.5 font-display font-bold text-lg text-near-black text-center w-full focus:outline-none focus:border-electric-blue"
                      />
                      {nameError && <p className="font-body text-xs text-red-600">{nameError}</p>}
                      <div className="flex gap-2">
                        <button
                          onClick={saveDisplayName}
                          disabled={savingName}
                          className="cursor-pointer flex items-center gap-1 border-2 border-black rounded-md px-3 py-1 font-display font-bold text-xs bg-electric-blue text-white shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
                        >
                          <Check size={12} /> {savingName ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          onClick={cancelEditName}
                          className="cursor-pointer flex items-center gap-1 border-2 border-black rounded-md px-3 py-1 font-body text-xs bg-white hover:bg-light-blue transition-colors"
                        >
                          <XIcon size={12} /> Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <p className="font-display font-bold text-xl text-near-black">{displayName || '—'}</p>
                      <button
                        onClick={startEditName}
                        className="cursor-pointer p-1 rounded hover:bg-light-blue transition-colors"
                        title="Edit nama"
                      >
                        <Pencil size={14} className="text-near-black/40 hover:text-electric-blue" />
                      </button>
                    </div>
                  )}
                  <p className="font-body text-sm text-near-black/60 mt-1">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1.5 mt-2 bg-yellow-50 border-2 border-yellow-400 text-yellow-700 font-display font-bold text-xs px-2.5 py-1 rounded-md">
                      <Shield size={11} /> Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Ikon', value: icons.length },
                  { label: 'Dipublikasi', value: icons.filter(i => i.is_public).length },
                  { label: 'Saldo Credit', value: credits ?? '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="border-2 border-black rounded-md bg-white shadow-[3px_3px_0_#000] p-4 text-center">
                    <p className="font-display font-bold text-2xl text-near-black">{value}</p>
                    <p className="font-body text-[11px] text-near-black/50 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Account details */}
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 flex flex-col gap-3">
                <h2 className="font-display font-semibold text-lg text-near-black">Detail Akun</h2>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-3 border-b border-black/10">
                    <span className="font-body text-sm text-near-black/60">Username</span>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm font-medium text-near-black">{displayName || '—'}</span>
                      <button onClick={startEditName} className="cursor-pointer p-0.5 rounded hover:bg-light-blue transition-colors">
                        <Pencil size={12} className="text-near-black/30 hover:text-electric-blue" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-black/10">
                    <span className="font-body text-sm text-near-black/60">Email</span>
                    <span className="font-body text-sm font-medium text-near-black">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-black/10">
                    <span className="font-body text-sm text-near-black/60">Bergabung sejak</span>
                    <span className="font-body text-sm font-medium text-near-black">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="font-body text-sm text-near-black/60">Saldo Credit</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 border-2 border-black rounded-md px-2.5 py-1 bg-light-blue font-body font-semibold text-sm text-near-black">
                        <Zap size={12} className="text-electric-blue" />
                        {credits !== null ? credits : '—'}
                      </span>
                      <Link to="/pricing" className="font-body text-xs font-medium text-electric-blue underline underline-offset-2">
                        Beli lagi
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign out */}
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 flex flex-col gap-3">
                <h2 className="font-display font-semibold text-lg text-near-black">Keluar</h2>
                <p className="font-body text-sm text-near-black/60">Kamu akan diarahkan ke halaman login setelah keluar.</p>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="cursor-pointer self-start border-2 border-red-400 font-body text-sm font-medium px-4 py-2 rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Monitoring Tab — Admin only */}
          {tab === 'monitoring' && isAdmin && (() => {
            const adminTodayCount = icons.filter((i) => i.created_at.startsWith(adminTodayKey)).length
            const creditBalance = credits ?? 0
            const totalPages = Math.max(1, Math.ceil(icons.length / MONITORING_PAGE_SIZE))
            const pagedIcons = icons.slice(
              (monitoringPage - 1) * MONITORING_PAGE_SIZE,
              monitoringPage * MONITORING_PAGE_SIZE,
            )
            return (
              <div className="flex flex-col gap-5">
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Saldo — from Supabase */}
                  <div className="border-2 border-yellow-400 rounded-md bg-yellow-50 shadow-[4px_4px_0_#000] p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-body text-xs font-medium text-yellow-700">Saldo Credit</p>
                      <button
                        onClick={refreshCredits}
                        disabled={refreshingCredits}
                        className="cursor-pointer p-1 rounded hover:bg-yellow-100 transition-colors disabled:opacity-50"
                        title="Refresh saldo"
                      >
                        <RefreshCw size={12} className={clsx('text-yellow-600', refreshingCredits && 'animate-spin')} />
                      </button>
                    </div>
                    <p className="font-display font-bold text-3xl text-yellow-700">{creditBalance}</p>
                    <p className="font-body text-[10px] text-yellow-600/70 mt-1">Supabase · real-time</p>
                  </div>

                  {/* Capacity cards */}
                  {([['1K', CREDIT_COST['1K']], ['2K', CREDIT_COST['2K']], ['4K', CREDIT_COST['4K']]] as const).map(([res, cost]) => (
                    <div key={res} className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-5">
                      <p className="font-body text-xs font-medium text-near-black/50 mb-1.5">Kapasitas {res}</p>
                      <p className="font-display font-bold text-3xl text-near-black">{Math.floor(creditBalance / cost)}</p>
                      <p className="font-body text-[10px] text-near-black/40 mt-1">{cost} credit/ikon</p>
                    </div>
                  ))}
                </div>

                {/* Top-up credit card */}
                <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <PlusCircle size={16} className="text-electric-blue" />
                    <h2 className="font-display font-semibold text-base text-near-black">Isi Credit (Dev)</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={topUpAmount}
                      onChange={(e) => { setTopUpAmount(e.target.value); setTopUpError(null); setTopUpSuccess(null) }}
                      placeholder="Jumlah credit (maks. 10.000)"
                      className="border-2 border-black rounded-md px-3 py-2 font-body text-sm text-near-black bg-white focus:outline-none focus:border-electric-blue w-full sm:max-w-xs"
                    />
                    <button
                      onClick={handleTopUp}
                      disabled={isTopping || !topUpAmount}
                      className="cursor-pointer flex items-center gap-2 border-2 border-black font-display font-bold text-sm px-5 py-2 rounded-md bg-electric-blue text-white shadow-[3px_3px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <PlusCircle size={14} />
                      {isTopping ? 'Menyimpan...' : 'Isi Credit'}
                    </button>
                  </div>
                  {topUpError && (
                    <p className="mt-2 font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{topUpError}</p>
                  )}
                  {topUpSuccess && (
                    <p className="mt-2 font-body text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">{topUpSuccess}</p>
                  )}
                </div>

                {/* Usage history — real data from Supabase icons */}
                <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] overflow-hidden">
                  <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b-2 border-black bg-yellow-50">
                    <div className="flex items-center gap-2">
                      <BarChart2 size={16} className="text-yellow-600" />
                      <h2 className="font-display font-semibold text-base text-near-black">Riwayat Generasi</h2>
                    </div>
                    <div className="flex gap-2 ml-auto items-center">
                      <span className="font-body text-xs font-medium border-2 border-black rounded-md px-2.5 py-1 bg-white">
                        Total: <span className="font-bold">{icons.length}</span>
                      </span>
                      <span className="font-body text-xs font-medium border-2 border-yellow-400 rounded-md px-2.5 py-1 bg-yellow-50 text-yellow-700">
                        Hari ini: <span className="font-bold">{adminTodayCount}</span>
                      </span>
                      <button
                        onClick={refreshIcons}
                        disabled={refreshingIcons}
                        className="cursor-pointer p-1 rounded hover:bg-yellow-100 transition-colors disabled:opacity-50"
                        title="Refresh riwayat"
                      >
                        <RefreshCw size={12} className={clsx('text-yellow-600', refreshingIcons && 'animate-spin')} />
                      </button>
                    </div>
                  </div>

                  {icons.length === 0 ? (
                    <div className="py-16 flex flex-col items-center gap-3">
                      <BarChart2 size={28} className="text-near-black/20" />
                      <p className="font-body text-sm text-near-black/50">Belum ada generasi.</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b-2 border-black bg-near-black/5">
                              <th className="px-4 py-3 text-left font-display font-semibold text-xs text-near-black/60">Waktu</th>
                              <th className="px-4 py-3 text-left font-display font-semibold text-xs text-near-black/60">Prompt</th>
                              <th className="px-4 py-3 text-left font-display font-semibold text-xs text-near-black/60">Style</th>
                              <th className="px-4 py-3 text-left font-display font-semibold text-xs text-near-black/60">Res</th>
                              <th className="px-4 py-3 text-right font-display font-semibold text-xs text-near-black/60">Credit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pagedIcons.map((icon) => (
                              <tr key={icon.id} className="border-b border-black/10 hover:bg-yellow-50/40 transition-colors">
                                <td className="px-4 py-3 font-body text-xs text-near-black/50 whitespace-nowrap">
                                  {new Date(icon.created_at).toLocaleString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-4 py-3 font-body text-xs text-near-black max-w-50 truncate">{icon.prompt}</td>
                                <td className="px-4 py-3 font-body text-xs text-near-black/70">{icon.style}</td>
                                <td className="px-4 py-3">
                                  <span className="font-body text-[10px] font-semibold text-electric-blue border border-electric-blue/30 rounded px-1.5 py-0.5 bg-light-blue">{icon.resolution}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="font-body text-xs font-semibold text-yellow-600 bg-yellow-50 border border-yellow-300 rounded px-1.5 py-0.5">
                                    {CREDIT_COST[icon.resolution as keyof typeof CREDIT_COST] ?? 1} cr
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t-2 border-black bg-near-black/5">
                          <button
                            onClick={() => setMonitoringPage((p) => Math.max(1, p - 1))}
                            disabled={monitoringPage === 1}
                            className="cursor-pointer flex items-center gap-1 border-2 border-black rounded-md px-3 py-1.5 font-body text-xs font-medium bg-white shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[2px_2px_0_#000]"
                          >
                            <ChevronLeft size={12} /> Prev
                          </button>
                          <span className="font-body text-xs text-near-black/60">
                            Halaman <span className="font-bold text-near-black">{monitoringPage}</span> dari <span className="font-bold text-near-black">{totalPages}</span>
                          </span>
                          <button
                            onClick={() => setMonitoringPage((p) => Math.min(totalPages, p + 1))}
                            disabled={monitoringPage === totalPages}
                            className="cursor-pointer flex items-center gap-1 border-2 border-black rounded-md px-3 py-1.5 font-body text-xs font-medium bg-white shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[2px_2px_0_#000]"
                          >
                            Next <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })()}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div className="max-w-lg flex flex-col gap-5">
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 flex flex-col gap-3">
                <h2 className="font-display font-semibold text-lg text-near-black">Account</h2>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="self-start border-2 border-red-400 font-body text-sm font-medium px-4 py-2 rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
