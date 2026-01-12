import { useState, useEffect, useCallback } from 'react'
import { 
  Activity, 
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Server
} from 'lucide-react'
import api from '../../utils/api'

export default function Usage() {
  const [summary, setSummary] = useState(null)
  const [daily, setDaily] = useState([])
  const [endpoints, setEndpoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')
  const [error, setError] = useState('')

  const fetchUsageStats = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90

      const [summaryRes, dailyRes, endpointsRes] = await Promise.allSettled([
        api.get('/stats/usage', { params: { period } }),
        api.get('/stats/daily', { params: { days } }),
        api.get('/stats/endpoints'),
      ])

      if (summaryRes.status === 'fulfilled' && summaryRes.value.data?.success) {
        setSummary(summaryRes.value.data.data)
      } else {
        const message =
          summaryRes.status === 'rejected'
            ? (summaryRes.reason?.response?.data?.error?.message || summaryRes.reason?.message)
            : (summaryRes.value?.data?.error?.message)
        throw new Error(message || 'Gagal memuat statistik penggunaan')
      }

      if (dailyRes.status === 'fulfilled' && dailyRes.value.data?.success) {
        setDaily(dailyRes.value.data.data?.usage || [])
      } else {
        setDaily([])
      }

      if (endpointsRes.status === 'fulfilled' && endpointsRes.value.data?.success) {
        setEndpoints(endpointsRes.value.data.data?.endpoints || [])
      } else {
        setEndpoints([])
      }
    } catch (err) {
      setError(err?.message || err?.response?.data?.error?.message || 'Gagal memuat statistik penggunaan')
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchUsageStats()
  }, [fetchUsageStats])

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num?.toString() || '0'
  }

  const calculateRate = (part, total) => {
    if (!total) return '0.0'
    return ((part / total) * 100).toFixed(1)
  }

  const chartData = (daily || []).map((d) => ({
    date: new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    requests: Number(d.requests) || 0,
    fraud: Number(d.fraud) || 0,
  }))
  const maxValue = Math.max(...chartData.map(d => d.requests), 1)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-[#667eea] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Memuat statistik penggunaan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchUsageStats}
            className="mt-4 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const totalRequests = summary?.total || 0
  const fraudDetected = summary?.fraud_detected || 0
  const safeRequests = Math.max(totalRequests - fraudDetected, 0)
  const fraudRate = calculateRate(fraudDetected, totalRequests)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Penggunaan API</h1>
          <p className="text-gray-400 mt-1">Monitor dan analisis penggunaan API fraud detection Anda</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  period === p
                    ? 'bg-linear-to-r from-[#667eea] to-[#764ba2] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : '90 Hari'}
              </button>
            ))}
          </div>
          <button
            onClick={fetchUsageStats}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center border border-[#667eea]/30">
              <Activity className="w-6 h-6 text-[#667eea]" />
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-white/5 text-gray-400 border border-white/10">
              {period.toUpperCase()}
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatNumber(totalRequests)}</p>
          <p className="text-gray-400 text-sm">Total Request</p>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              Decline
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatNumber(fraudDetected)}</p>
          <p className="text-gray-400 text-sm">Fraud Terdeteksi</p>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Non-decline
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatNumber(safeRequests)}</p>
          <p className="text-gray-400 text-sm">Transaksi Non-Fraud</p>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
              parseFloat(fraudRate) < 5 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : parseFloat(fraudRate) < 15
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {parseFloat(fraudRate) < 5 ? 'Rendah' : parseFloat(fraudRate) < 15 ? 'Sedang' : 'Tinggi'}
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{fraudRate}%</p>
          <p className="text-gray-400 text-sm">Tingkat Fraud</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Aktivitas Request</h3>
            <p className="text-sm text-gray-400">Jumlah request per hari</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#667eea] rounded-full"></div>
              <span className="text-gray-400">Request</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-gray-400">Fraud</span>
            </div>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 text-sm">
              Belum ada data harian. Jalankan beberapa request API agar usage logger terisi.
            </p>
          </div>
        ) : (
          <div className="h-64 flex items-end gap-1">
            {chartData.slice(-20).map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5">
                  <div 
                    className="w-full bg-[#667eea]/80 rounded-t-sm transition-all hover:bg-[#667eea]"
                    style={{ height: `${(item.requests / maxValue) * 180}px` }}
                    title={`${item.date}: ${item.requests} requests`}
                  />
                  <div 
                    className="w-full bg-red-400/80 rounded-b-sm transition-all hover:bg-red-400"
                    style={{ height: `${(item.fraud / maxValue) * 180}px` }}
                    title={`${item.date}: ${item.fraud} fraud`}
                  />
                </div>
                {i % 3 === 0 && (
                  <span className="text-[10px] text-gray-500 mt-2">{item.date}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Endpoints */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Endpoint Usage</h3>
            <p className="text-sm text-gray-400">Penggunaan per endpoint API</p>
          </div>
        </div>

        <div className="space-y-4">
          {endpoints.length === 0 ? (
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
              <p className="text-gray-500 text-sm">
                Belum ada data endpoint. Data ini akan muncul setelah ada request yang tercatat di `api_usage_logs`.
              </p>
            </div>
          ) : (
            endpoints.map((ep, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#667eea]/10 flex items-center justify-center border border-[#667eea]/20">
                    <Server className="w-5 h-5 text-[#667eea]" />
                  </div>
                  <div>
                    <code className="text-sm text-white font-medium">{ep.endpoint}</code>
                    <p className="text-xs text-gray-500 mt-0.5">Avg latency: {ep.avg_time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatNumber(ep.calls)}</p>
                    <p className="text-xs text-gray-500">calls</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {ep.success_rate}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="card-premium p-6 bg-linear-to-r from-[#667eea]/5 to-[#764ba2]/5 border-[#667eea]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#667eea]/10 flex items-center justify-center border border-[#667eea]/20 shrink-0">
            <Zap className="w-6 h-6 text-[#667eea]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Tingkatkan ke Pro</h3>
            <p className="text-gray-400 text-sm mb-4">
              Dapatkan analitik lanjutan, export data, dan webhook real-time dengan paket Pro.
            </p>
            <button className="px-5 py-2.5 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20">
              Lihat Paket Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
