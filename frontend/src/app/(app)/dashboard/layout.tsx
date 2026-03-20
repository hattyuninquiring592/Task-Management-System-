'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col fixed left-0 top-0 bottom-0 border-r border-white/8 bg-slate-950/80 backdrop-blur-xl z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>TaskFlow</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-500/10 text-brand-400 font-medium text-sm transition-all">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/8 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-slate-950/90 backdrop-blur-xl border-b border-white/8 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>TaskFlow</span>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors p-1">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
