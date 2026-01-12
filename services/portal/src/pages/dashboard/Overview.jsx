import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  Activity,
  Zap
} from 'lucide-react';
import api from '../../utils/api';

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, txRes] = await Promise.all([
        api.get('/stats/dashboard'),
        api.get('/stats/transactions?limit=5')
      ]);

      if (statsRes.data.success) {
        setDashboardStats(statsRes.data.data);
      }
      if (txRes.data.success) {
        setRecentTransactions(txRes.data.data.transactions || []);
      }
    } catch (err) {
      setError('Gagal memuat data dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'low': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'high': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'low': return 'Rendah';
      case 'medium': return 'Sedang';
      case 'high': return 'Tinggi';
      default: return status;
    }
  };

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const stats = dashboardStats ? [
    {
      name: 'Total Request',
      value: dashboardStats.total_requests.toLocaleString(),
      change: dashboardStats.total_requests_change,
      changeType: dashboardStats.total_requests_change?.startsWith('+') && dashboardStats.total_requests_change !== '+0%' ? 'positive' : dashboardStats.total_requests_change?.startsWith('-') ? 'negative' : 'neutral',
      icon: BarChart3,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      name: 'Fraud Terdeteksi',
      value: dashboardStats.fraud_detected.toLocaleString(),
      change: dashboardStats.fraud_detected_change,
      changeType: 'warning',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      name: 'Request Aman',
      value: dashboardStats.safe_requests.toLocaleString(),
      change: '',
      changeType: 'positive',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      name: 'Rata-rata Response',
      value: `${dashboardStats.avg_response_time}ms`,
      change: '',
      changeType: 'positive',
      icon: Clock,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center border border-[#667eea]/20">
            <Loader2 className="w-8 h-8 text-[#667eea] animate-spin" />
          </div>
          <p className="text-gray-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const totalTx = recentTransactions.length || 1;
  const lowRisk = recentTransactions.filter(t => t.status === 'low').length;
  const mediumRisk = recentTransactions.filter(t => t.status === 'medium').length;
  const highRisk = recentTransactions.filter(t => t.status === 'high').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Selamat datang kembali! Berikut ringkasan aktivitas API Anda.</p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="stat-card group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} border flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.change && (
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-400' : 
                  stat.changeType === 'negative' ? 'text-red-400' : 
                  stat.changeType === 'warning' ? 'text-amber-400' : 'text-gray-400'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : stat.changeType === 'negative' ? (
                    <ArrowDownRight className="w-4 h-4" />
                  ) : null}
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder & Risk Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Tren Request</h2>
            <select className="text-sm bg-white/5 border border-white/10 text-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-[#667eea]">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
              <option>3 Bulan Terakhir</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center rounded-xl bg-linear-to-br from-white/5 to-transparent border border-white/5">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 flex items-center justify-center border border-[#667eea]/20">
                <TrendingUp className="w-8 h-8 text-[#667eea]" />
              </div>
              <p className="text-gray-500 text-sm">Grafik akan ditampilkan di sini</p>
              <p className="text-gray-600 text-xs mt-1">Mulai gunakan API untuk melihat tren</p>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Distribusi Risiko</h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Risiko Rendah</span>
                <span className="font-semibold text-emerald-400">{Math.round((lowRisk / totalTx) * 100) || 0}%</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500" style={{width: `${(lowRisk / totalTx) * 100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Risiko Sedang</span>
                <span className="font-semibold text-amber-400">{Math.round((mediumRisk / totalTx) * 100) || 0}%</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500" style={{width: `${(mediumRisk / totalTx) * 100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Risiko Tinggi</span>
                <span className="font-semibold text-red-400">{Math.round((highRisk / totalTx) * 100) || 0}%</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-red-500 to-rose-400 rounded-full transition-all duration-500" style={{width: `${(highRisk / totalTx) * 100}%`}}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-5 bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-2xl border border-[#667eea]/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{dashboardStats?.fraud_detected || 0} Fraud Dicegah</p>
                <p className="text-sm text-gray-400">Bulan ini</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-xl flex items-center justify-center border border-[#667eea]/20">
              <Activity className="w-5 h-5 text-[#667eea]" />
            </div>
            <h2 className="text-lg font-semibold text-white">Transaksi Terbaru</h2>
          </div>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 flex items-center justify-center border border-[#667eea]/20">
              <Zap className="w-10 h-10 text-[#667eea]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Transaksi</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">Mulai gunakan API FraudShield untuk melihat data transaksi dan analisis risiko di sini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Transaksi</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Skor Risiko</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Level</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentTransactions.map((tx, index) => (
                  <tr key={tx.id || index} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <code className="text-sm text-[#667eea] bg-[#667eea]/10 px-2.5 py-1 rounded-lg border border-[#667eea]/20">{tx.id}</code>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">{tx.account_id || '-'}</td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono font-semibold text-white">{(tx.risk_score || 0).toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(tx.status)}`}>
                        {getStatusLabel(tx.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{formatTimeAgo(tx.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-white/5 text-center">
          <button className="text-sm text-[#667eea] font-medium hover:text-[#764ba2] transition-colors">
            Lihat Semua Transaksi →
          </button>
        </div>
      </div>
    </div>
  );
}
