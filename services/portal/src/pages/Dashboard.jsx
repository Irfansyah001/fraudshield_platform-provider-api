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
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#0f0f23]">
      {/* Mobile sidebar backdrop */}
      {isAdmin && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {isAdmin && (
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-72 bg-linear-to-b from-[#1a1a2e] to-[#16213e] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
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

            {/* Admin Navigation (scrollable) */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="pt-1 pb-2">
                <div className="flex items-center gap-2 px-4 text-xs font-semibold text-[#667eea] uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  Admin Panel
                </div>
              </div>
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-linear-to-r from-amber-500/20 to-orange-500/20 text-white border border-amber-500/30 shadow-lg shadow-amber-500/10'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-amber-400' : ''}`} />
                  {item.name}
                  {isActive(item.href) && (
                    <ChevronRight className="w-4 h-4 ml-auto text-amber-400" />
                  )}
                </Link>
              ))}

              {/* Pro Badge */}
              <div className="mt-6 p-4 rounded-2xl bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#667eea]" />
                  <span className="text-sm font-semibold text-white">Upgrade ke Pro</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Dapatkan fitur unlimited dan dukungan prioritas</p>
                <button className="w-full py-2 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Upgrade Sekarang
                </button>
              </div>
            </nav>

            {/* User Info (fixed bottom, no overlap) */}
            <div className="p-4 border-t border-white/5 bg-[#0f0f23]/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center ring-2 bg-linear-to-br from-amber-500 to-orange-500 ring-amber-500/20">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 rounded-xl hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className={isAdmin ? 'lg:pl-72' : ''}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 glass-dark flex items-center justify-between px-4 lg:px-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Buka sidebar admin"
              >
                <Menu className="w-5 h-5 text-gray-300" />
              </button>
            )}

            {/* Logo (mobile / non-admin) */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Shield className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="hidden sm:block text-base font-bold text-white">FraudShield</span>
            </Link>
          </div>

          {/* Main navigation (all roles) */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 text-white border border-[#667eea]/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 ${isActive(item.href) ? 'text-[#667eea]' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User avatar (mobile) */}
            <div className="lg:hidden">
              <div className="w-9 h-9 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile main navigation (all roles) */}
        <div className="lg:hidden px-4 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 text-white border border-[#667eea]/30'
                    : 'text-gray-300 bg-white/5 hover:bg-white/10'
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 ${isActive(item.href) ? 'text-[#667eea]' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
