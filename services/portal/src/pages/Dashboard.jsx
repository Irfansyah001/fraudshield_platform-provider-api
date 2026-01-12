import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Key,
  Shield,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Bell,
  User,
  Sparkles,
  Users,
  Activity,
  FileText,
  Crown
} from 'lucide-react'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Ringkasan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
    { name: 'Blacklist', href: '/dashboard/blacklist', icon: Shield },
    { name: 'Penggunaan', href: '/dashboard/usage', icon: BarChart3 },
    { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  ]

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Crown },
    { name: 'Kelola Users', href: '/admin/users', icon: Users },
    { name: 'Semua API Keys', href: '/admin/keys', icon: Key },
    { name: 'Semua Blacklist', href: '/admin/blacklist', icon: Shield },
    { name: 'Transaksi', href: '/admin/transactions', icon: Activity },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  ]

  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72
        bg-linear-to-b from-[#1a1a2e] to-[#16213e]
        border-r border-white/5
        transform transition-transform duration-300
        flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FraudShield</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive(item.href)
                    ? 'bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 text-white border border-[#667eea]/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="pt-4 pb-2 px-4 text-xs font-semibold text-[#667eea] uppercase flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" />
                  Admin Panel
                </div>

                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive(item.href)
                        ? 'bg-linear-to-r from-amber-500/20 to-orange-500/20 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Pro Badge */}
          <div className="mx-4 mt-6 p-4 rounded-2xl bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#667eea]" />
              <span className="text-sm font-semibold text-white">Upgrade ke Pro</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Fitur unlimited & prioritas support
            </p>
            <button className="w-full py-2 bg-linear-to-r from-[#667eea] to-[#764ba2] text-xs font-semibold rounded-lg text-white">
              Upgrade Sekarang
            </button>
          </div>
        </div>

        {/* USER INFO (FIXED BOTTOM) */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              {isAdmin ? <Crown className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 rounded-xl hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-30 h-20 flex items-center justify-between px-4 lg:px-8 border-b border-white/5 bg-[#0f0f23]/80 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white/5"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <button className="relative p-2 rounded-xl bg-white/5">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
