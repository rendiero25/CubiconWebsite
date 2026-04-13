import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Download, Globe, Lock, Trash2, Settings, Wand2, LayoutGrid, ImageOff, User, Shield, BarChart2, RefreshCw, Activity } from 'lucide-react'
import clsx from 'clsx'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../api/supabase'
import { getCredits } from '../api/credits'
import type { PublicIcon } from '../api/icons'
import { useAuth } from '../hooks/useAuth'
import { useAdminUsage } from '../hooks/useAdminUsage'

// Gemini free-tier limits (AI Studio, as of 2025)
// https://ai.google.dev/pricing
const GEMINI_MODEL = 'gemini-2.0-flash-preview-image-generation'
const GEMINI_FREE_RPD = 1500  // requests per day
const GEMINI_FREE_RPM = 10    // requests per minute

type TabKey = 'history' | 'settings' | 'profile' | 'monitoring'

interface DashboardIcon extends PublicIcon {
  selected: boolean
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const { log: adminLog, totalSaved: adminTotalSaved, clear: clearAdminLog } = useAdminUsage()
  const adminTodayKey = new Date().toISOString().split('T')[0]
  const adminTodayCount = adminLog.filter((e) => e.timestamp.startsWith(adminTodayKey)).length
  const [tab, setTab] = useState<TabKey>('history')
  const [userId, setUserId] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [icons, setIcons] = useState<DashboardIcon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [defaultPublic, setDefaultPublic] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [refreshingCredits, setRefreshingCredits] = useState(false)

  const refreshCredits = async () => {
    if (!userId) return
    setRefreshingCredits(true)
    try {
      setCredits(await getCredits(userId))
    } finally {
      setRefreshingCredits(false)
    }
  }

  // Auth + load data
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)
        const bal = await getCredits(user.id)
        setCredits(bal)
        const { data, error: iconErr } = await supabase
          .from('icons')
          .select('id, prompt, style, resolution, url, is_public, created_at, user_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (iconErr) throw new Error(iconErr.message)
        setIcons((data ?? []).map((ic: PublicIcon & { is_public?: boolean }) => ({ ...ic, selected: false })))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const allSelected = icons.length > 0 && icons.every((i) => i.selected)
  const anySelected = icons.some((i) => i.selected)

  const toggleSelect = (id: string) =>
    setIcons((prev) => prev.map((ic) => (ic.id === id ? { ...ic, selected: !ic.selected } : ic)))

  const toggleSelectAll = () =>
    setIcons((prev) => prev.map((ic) => ({ ...ic, selected: !allSelected })))

  const setVisibility = async (ids: string[], isPublic: boolean) => {
    await supabase.from('icons').update({ is_public: isPublic }).in('id', ids)
    setIcons((prev) => prev.map((ic) => (ids.includes(ic.id) ? { ...ic, is_public: isPublic } : ic)))
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
                        className="cursor-pointer flex items-center gap-1.5 border-2 border-black rounded-md px-3 py-1.5 font-body text-xs font-medium bg-white hover:bg-light-blue transition-colors shadow-[2px_2px_0_#000]"
                      >
                        <Globe size={12} /> Make Public
                      </button>
                      <button
                        onClick={() => setVisibility(selectedIds, false)}
                        className="cursor-pointer flex items-center gap-1.5 border-2 border-black rounded-md px-3 py-1.5 font-body text-xs font-medium bg-white hover:bg-light-blue transition-colors shadow-[2px_2px_0_#000]"
                      >
                        <Lock size={12} /> Make Private
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
                        'border-2 rounded-md bg-white overflow-hidden transition-all cursor-pointer group',
                        icon.selected
                          ? 'border-electric-blue shadow-[3px_3px_0_#3B5BDB]'
                          : 'border-black shadow-[3px_3px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                      )}
                      onClick={() => toggleSelect(icon.id)}
                    >
                      <div className="relative bg-light-blue aspect-square flex items-center justify-center border-b-2 border-black">
                        <img
                          src={icon.url}
                          alt={icon.prompt}
                          className="w-3/4 h-3/4 object-contain"
                          loading="lazy"
                        />
                        {/* Selection indicator */}
                        <div className={clsx(
                          'absolute top-2 right-2 w-5 h-5 border-2 border-black rounded flex items-center justify-center transition-all',
                          icon.selected ? 'bg-electric-blue' : 'bg-white/80'
                        )}>
                          {icon.selected && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        {/* Visibility badge */}
                        <div className="absolute bottom-2 left-2">
                          {icon.is_public
                            ? <span className="flex items-center gap-1 bg-white border-2 border-black rounded px-1.5 py-0.5 font-body text-[10px] font-semibold"><Globe size={10} /> Public</span>
                            : <span className="flex items-center gap-1 bg-white border-2 border-black rounded px-1.5 py-0.5 font-body text-[10px] font-semibold"><Lock size={10} /> Private</span>
                          }
                        </div>
                        {/* Hover actions */}
                        <div className="absolute inset-0 bg-near-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a
                            href={icon.url}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 bg-white border-2 border-black rounded-md flex items-center justify-center hover:bg-light-blue transition-colors"
                          >
                            <Download size={13} />
                          </a>
                          <Link
                            to={`/app?prompt=${encodeURIComponent(icon.prompt)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 bg-white border-2 border-black rounded-md flex items-center justify-center hover:bg-light-blue transition-colors"
                          >
                            <Wand2 size={13} />
                          </Link>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-body text-xs font-medium text-near-black truncate">{icon.prompt}</p>
                        <div className="flex gap-1 mt-1.5">
                          <span className="font-body text-[10px] text-near-black/50 border border-black/15 rounded px-1 py-0.5">{icon.style}</span>
                          <span className="font-body text-[10px] font-semibold text-electric-blue border border-electric-blue/30 rounded px-1 py-0.5 bg-light-blue">{icon.resolution}</span>
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
              {/* Avatar card */}
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-electric-blue border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0_#000]">
                  <span className="font-display font-bold text-2xl text-white">
                    {(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || '?')
                      .split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('')}
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-xl text-near-black">
                    {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="font-body text-sm text-near-black/60 mt-0.5">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1.5 mt-2 bg-yellow-50 border-2 border-yellow-400 text-yellow-700 font-display font-bold text-xs px-2.5 py-1 rounded-md">
                      <Shield size={11} /> Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Account details */}
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 flex flex-col gap-3">
                <h2 className="font-display font-semibold text-lg text-near-black">Account details</h2>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-3 border-b border-black/10">
                    <span className="font-body text-sm text-near-black/60">Email</span>
                    <span className="font-body text-sm font-medium text-near-black">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-black/10">
                    <span className="font-body text-sm text-near-black/60">Member since</span>
                    <span className="font-body text-sm font-medium text-near-black">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="font-body text-sm text-near-black/60">Credits balance</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 border-2 border-black rounded-md px-2.5 py-1 bg-light-blue font-body font-semibold text-sm text-near-black">
                        <Zap size={12} className="text-electric-blue" />
                        {credits !== null ? credits : '—'}
                      </span>
                      <Link to="/pricing" className="font-body text-xs font-medium text-electric-blue underline underline-offset-2">
                        Buy more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign out */}
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 flex flex-col gap-3">
                <h2 className="font-display font-semibold text-lg text-near-black">Sign out</h2>
                <p className="font-body text-sm text-near-black/60">You&apos;ll be redirected to login after signing out.</p>
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
          {tab === 'monitoring' && isAdmin && (
            <div className="flex flex-col gap-5">
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Current balance — from Supabase (reflects real free credits added) */}
                <div className="border-2 border-yellow-400 rounded-md bg-yellow-50 shadow-[4px_4px_0_#000] p-5 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-body text-xs font-medium text-yellow-700">Saldo Credit Saat Ini</p>
                    <button
                      onClick={refreshCredits}
                      disabled={refreshingCredits}
                      className="cursor-pointer p-1 rounded hover:bg-yellow-100 transition-colors disabled:opacity-50"
                      title="Refresh saldo"
                    >
                      <RefreshCw size={12} className={clsx('text-yellow-600', refreshingCredits && 'animate-spin')} />
                    </button>
                  </div>
                  <p className="font-display font-bold text-3xl text-yellow-700">{credits ?? '—'}</p>
                  <p className="font-body text-[10px] text-yellow-600/70 mt-1">dari Supabase · real-time</p>
                </div>
                {[
                  { label: 'Total Gratis Diterima', value: `+${adminTotalSaved} cr`, sub: 'dari Google API' },
                  { label: 'Total Generasi', value: adminLog.length, sub: 'semua waktu' },
                  { label: 'Generasi Hari Ini', value: adminTodayCount, sub: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-5">
                    <p className="font-body text-xs font-medium text-near-black/50 mb-1.5">{label}</p>
                    <p className="font-display font-bold text-3xl text-near-black">{value}</p>
                    <p className="font-body text-[10px] text-near-black/40 mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Google Gemini Free Quota */}
              {(() => {
                const todayPercent = Math.min(100, Math.round((adminTodayCount / GEMINI_FREE_RPD) * 100))
                const remaining = Math.max(0, GEMINI_FREE_RPD - adminTodayCount)
                const barColor = todayPercent >= 90 ? 'bg-red-500' : todayPercent >= 70 ? 'bg-yellow-400' : 'bg-green-500'
                return (
                  <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity size={16} className="text-electric-blue" />
                      <h2 className="font-display font-semibold text-base text-near-black">Google Gemini Free Quota</h2>
                      <span className="ml-auto font-body text-[10px] text-near-black/40">Estimasi · per browser</span>
                    </div>

                    {/* Model info */}
                    <div className="mb-4 flex items-center justify-between p-3 bg-near-black/5 border border-black/10 rounded-md">
                      <span className="font-body text-xs text-near-black/50">Model</span>
                      <span className="font-body text-xs font-semibold text-near-black">{GEMINI_MODEL}</span>
                    </div>

                    {/* RPD progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-baseline mb-1.5">
                        <p className="font-body text-xs font-medium text-near-black">Requests Per Day (RPD)</p>
                        <p className="font-body text-xs font-bold text-near-black">{adminTodayCount} / {GEMINI_FREE_RPD}</p>
                      </div>
                      <div className="h-3 border-2 border-black rounded-full overflow-hidden bg-near-black/5">
                        <div className={clsx('h-full transition-all', barColor)} style={{ width: `${todayPercent}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="font-body text-[10px] text-near-black/40">{todayPercent}% terpakai hari ini</p>
                        <p className={clsx('font-body text-[10px] font-semibold', remaining === 0 ? 'text-red-500' : 'text-green-600')}>
                          {remaining} sisa
                        </p>
                      </div>
                    </div>

                    {/* RPM + reset info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border border-black/10 rounded-md bg-near-black/5">
                        <p className="font-body text-[10px] text-near-black/50 mb-0.5">Rate Limit</p>
                        <p className="font-body text-sm font-bold text-near-black">{GEMINI_FREE_RPM} RPM</p>
                      </div>
                      <div className="p-3 border border-black/10 rounded-md bg-near-black/5">
                        <p className="font-body text-[10px] text-near-black/50 mb-0.5">Reset Quota</p>
                        <p className="font-body text-sm font-bold text-near-black">00:00 UTC</p>
                      </div>
                    </div>

                    {remaining === 0 && (
                      <p className="mt-3 font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                        Quota harian habis. Akan reset tengah malam UTC.
                      </p>
                    )}
                    <p className="mt-3 font-body text-[10px] text-near-black/30">
                      Tracking berbasis browser lokal. Cek quota aktual di Google AI Studio.
                    </p>
                  </div>
                )
              })()}

              {/* Usage table */}
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black bg-yellow-50">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={16} className="text-yellow-600" />
                    <h2 className="font-display font-semibold text-base text-near-black">Riwayat Penggunaan Gratis</h2>
                  </div>
                  {adminLog.length > 0 && (
                    <button
                      onClick={clearAdminLog}
                      className="cursor-pointer flex items-center gap-1.5 border-2 border-red-400 rounded-md px-3 py-1.5 font-body text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={12} /> Hapus Semua
                    </button>
                  )}
                </div>
                {adminLog.length === 0 ? (
                  <div className="py-16 flex flex-col items-center gap-3">
                    <BarChart2 size={28} className="text-near-black/20" />
                    <p className="font-body text-sm text-near-black/50">Belum ada generasi gratis.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-black bg-near-black/5">
                          <th className="px-4 py-3 text-left font-display font-semibold text-xs text-near-black/60">Waktu</th>
                          <th className="px-4 py-3 text-left font-display font-semibold text-xs text-near-black/60">Prompt</th>
                          <th className="px-4 py-3 text-left font-display font-semibold text-xs text-near-black/60">Style</th>
                          <th className="px-4 py-3 text-left font-display font-semibold text-xs text-near-black/60">Res</th>
                          <th className="px-4 py-3 text-right font-display font-semibold text-xs text-near-black/60">Credit Saved</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminLog.map((entry) => (
                          <tr key={entry.id} className="border-b border-black/10 hover:bg-yellow-50/40 transition-colors">
                            <td className="px-4 py-3 font-body text-xs text-near-black/50 whitespace-nowrap">
                              {new Date(entry.timestamp).toLocaleString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-4 py-3 font-body text-xs text-near-black max-w-50 truncate">{entry.prompt}</td>
                            <td className="px-4 py-3 font-body text-xs text-near-black/70">{entry.style}</td>
                            <td className="px-4 py-3">
                              <span className="font-body text-[10px] font-semibold text-electric-blue border border-electric-blue/30 rounded px-1.5 py-0.5 bg-light-blue">{entry.resolution}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-body text-xs font-semibold text-yellow-600 bg-yellow-50 border border-yellow-300 rounded px-1.5 py-0.5">+{entry.creditsSaved}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div className="max-w-lg flex flex-col gap-5">
              <div className="border-2 border-black rounded-md bg-white shadow-[4px_4px_0_#000] p-6 flex flex-col gap-5">
                <h2 className="font-display font-semibold text-lg text-near-black">Generate defaults</h2>

                <label className="flex items-center justify-between cursor-pointer gap-4">
                  <div>
                    <p className="font-body text-sm font-medium text-near-black">Default visibility: Public</p>
                    <p className="font-body text-xs text-near-black/50 mt-0.5">
                      When ON, new icons are shared to Explore automatically.
                    </p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={defaultPublic}
                    onClick={() => setDefaultPublic((v) => !v)}
                    className={clsx(
                      'relative w-11 h-6 border-2 border-black rounded-full transition-colors shrink-0',
                      defaultPublic ? 'bg-electric-blue' : 'bg-near-black/20'
                    )}
                  >
                    <span className={clsx(
                      'absolute top-0.5 w-4 h-4 bg-white border-2 border-black rounded-full transition-all',
                      defaultPublic ? 'left-5' : 'left-0.5'
                    )} />
                  </button>
                </label>

                <button
                  onClick={saveSettings}
                  disabled={savingSettings}
                  className="self-start border-2 border-black font-display font-bold text-sm px-5 py-2.5 rounded-md bg-electric-blue text-white shadow-[3px_3px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>

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
