import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import {
  Users,
  Key,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  Clock,
  Crown,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal memuat statistik')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
        {error}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total || 0,
      subtitle: `${stats?.users?.admins || 0} admin, ${stats?.users?.suspended || 0} suspended`,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/users'
    },
    {
      title: 'API Keys',
      value: stats?.api_keys?.total || 0,
      subtitle: `${stats?.api_keys?.active || 0} aktif`,
      icon: Key,
      color: 'from-purple-500 to-pink-500',
      link: '/admin/keys'
    },
    {
      title: 'Blacklist Entries',
      value: stats?.blacklist?.total || 0,
      subtitle: `${stats?.blacklist?.active || 0} aktif`,
      icon: Shield,
      color: 'from-amber-500 to-orange-500',
      link: '/admin/blacklist'
    },
    {
      title: 'Total Transaksi',
      value: stats?.transactions?.total || 0,
      subtitle: `Avg score: ${stats?.transactions?.avg_score || 0}`,
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      link: '/admin/transactions'
    },
  ]

  const riskLevels = stats?.transactions?.by_decision || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">Kelola dan monitor seluruh sistem FraudShield</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="group p-6 bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-linear-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{card.value.toLocaleString()}</p>
            <p className="text-sm text-gray-400">{card.title}</p>
            <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
          </Link>
        ))}
      </div>

      {/* Decision Distribution & API Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decision Distribution */}
        <div className="p-6 bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Distribusi Keputusan Transaksi
          </h3>
          <div className="space-y-4">
            {[
              { level: 'Approve', value: riskLevels.approve || 0, color: 'bg-green-500' },
              { level: 'Review', value: riskLevels.review || 0, color: 'bg-yellow-500' },
              { level: 'Decline', value: riskLevels.decline || 0, color: 'bg-red-500' },
            ].map((item) => {
              const total = Object.values(riskLevels).reduce((a, b) => a + b, 0) || 1
              const percentage = ((item.value / total) * 100).toFixed(1)
              return (
                <div key={item.level}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{item.level}</span>
                    <span className="text-white">{item.value} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* API Usage */}
        <div className="p-6 bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            API Usage
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-white">{stats?.api_usage?.total?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Total Request</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-green-400">{stats?.api_usage?.today?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Hari Ini</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-blue-400">{stats?.api_usage?.last_7_days?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-400 mt-1">7 Hari Terakhir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Users & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <div className="p-6 bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Top Users by API Usage
          </h3>
          <div className="space-y-3">
            {(stats?.top_users || []).slice(0, 5).map((user, idx) => (
              <div key={user.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <span className="w-6 h-6 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <span className="text-sm font-semibold text-[#667eea]">{user.request_count} req</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="p-6 bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Aktivitas Admin Terbaru
            </h3>
            <Link to="/admin/audit-logs" className="text-sm text-[#667eea] hover:underline">
              Lihat semua
            </Link>
          </div>
          <div className="space-y-3">
            {(stats?.recent_audit_logs || []).slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                    log.action === 'CREATE' ? 'bg-green-500/20 text-green-400' :
                    log.action === 'UPDATE' ? 'bg-blue-500/20 text-blue-400' :
                    log.action === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {log.action}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-sm text-white">
                  <span className="text-gray-400">{log.admin_name}</span> {log.action.toLowerCase()} {log.entity_type}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
