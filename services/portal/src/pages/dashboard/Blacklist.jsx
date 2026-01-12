import { useState, useEffect, useCallback } from 'react'
import { 
  Shield, 
  Plus, 
  Trash2, 
  Search,
  User,
  Store,
  Globe,
  MapPin,
  AlertCircle,
  Loader2,
  RefreshCw,
  Filter,
  Zap
} from 'lucide-react'
import api from '../../utils/api'

export default function Blacklist() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [error, setError] = useState('')
  const [newEntry, setNewEntry] = useState({
    type: 'ACCOUNT_ID',
    value: '',
    reason: ''
  })

  const fetchBlacklist = useCallback(async () => {
    try {
      setLoading(true)
      const params = filterType !== 'all' ? { type: filterType } : {}
      const response = await api.get('/blacklist', { params })
      if (response.data.success) {
        setEntries(response.data.data.entries || [])
      }
    } catch (error) {
      setError(error?.response?.data?.error?.message || 'Gagal memuat data blacklist')
    } finally {
      setLoading(false)
    }
  }, [filterType])

  useEffect(() => {
    fetchBlacklist()
  }, [fetchBlacklist])

  const createEntry = async () => {
    if (!newEntry.value.trim()) {
      setError('Nilai harus diisi')
      return
    }

    try {
      setCreating(true)
      setError('')
      await api.post('/blacklist', newEntry)
      setNewEntry({ type: 'ACCOUNT_ID', value: '', reason: '' })
      setShowCreateModal(false)
      fetchBlacklist()
    } catch (error) {
      setError(error?.response?.data?.error?.message || 'Gagal menambah ke blacklist')
    } finally {
      setCreating(false)
    }
  }

  const deleteEntry = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus entri ini dari blacklist?')) {
      return
    }

    try {
      await api.delete(`/blacklist/${id}`)
      fetchBlacklist()
    } catch (error) {
      setError(error?.response?.data?.error?.message || 'Gagal menghapus dari blacklist')
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ACCOUNT_ID': return User
      case 'MERCHANT_ID': return Store
      case 'IP': return Globe
      case 'COUNTRY': return MapPin
      default: return Shield
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'ACCOUNT_ID': return 'Account ID'
      case 'MERCHANT_ID': return 'Merchant ID'
      case 'IP': return 'IP Address'
      case 'COUNTRY': return 'Country'
      default: return type
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'ACCOUNT_ID': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'MERCHANT_ID': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'IP': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'COUNTRY': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredEntries = entries.filter(entry =>
    entry.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    account: entries.filter(e => e.type === 'ACCOUNT_ID').length,
    merchant: entries.filter(e => e.type === 'MERCHANT_ID').length,
    ip: entries.filter(e => e.type === 'IP').length,
    country: entries.filter(e => e.type === 'COUNTRY').length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blacklist</h1>
          <p className="text-gray-400 mt-1">Kelola daftar account, merchant, IP, dan country yang diblokir</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          Tambah ke Blacklist
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.account}</p>
              <p className="text-sm text-gray-400">Account</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Store className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.merchant}</p>
              <p className="text-sm text-gray-400">Merchant</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.ip}</p>
              <p className="text-sm text-gray-400">IP Diblokir</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <MapPin className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.country}</p>
              <p className="text-sm text-gray-400">Country</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">
            ×
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="card-premium p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Cari berdasarkan nilai atau alasan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 appearance-none focus:outline-none focus:border-[#667eea] transition-colors"
              >
                <option value="all">Semua Tipe</option>
                <option value="ACCOUNT_ID">Account ID</option>
                <option value="MERCHANT_ID">Merchant ID</option>
                <option value="IP">IP Address</option>
                <option value="COUNTRY">Country</option>
              </select>
            </div>
            <button
              onClick={fetchBlacklist}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Blacklist Table */}
      <div className="card-premium overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-[#667eea] animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Memuat data blacklist...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 flex items-center justify-center border border-[#667eea]/20">
              <Zap className="w-10 h-10 text-[#667eea]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchTerm ? 'Tidak Ada Hasil' : 'Blacklist Kosong'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              {searchTerm 
                ? 'Coba ubah kata kunci pencarian Anda'
                : 'Tambahkan account, merchant, atau IP yang mencurigakan ke blacklist'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-xl hover:opacity-90 shadow-lg shadow-purple-500/20"
              >
                <Plus className="w-5 h-5" />
                Tambah ke Blacklist
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipe</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nilai</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Alasan</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEntries.map((entry) => {
                  const TypeIcon = getTypeIcon(entry.type)
                  return (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border ${getTypeColor(entry.type)}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          {getTypeLabel(entry.type)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-sm text-[#667eea] bg-[#667eea]/10 px-2.5 py-1 rounded-lg border border-[#667eea]/20">{entry.value}</code>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-400">{entry.reason || '-'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500">{formatDate(entry.created_at)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="card-premium max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-2">Tambah ke Blacklist</h2>
            <p className="text-gray-400 mb-6">
              Masukkan data yang ingin ditambahkan ke daftar blacklist.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipe
                </label>
                <select
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-[#667eea]"
                >
                  <option value="ACCOUNT_ID">Account ID</option>
                  <option value="MERCHANT_ID">Merchant ID</option>
                  <option value="IP">IP Address</option>
                  <option value="COUNTRY">Country Code</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nilai
                </label>
                <input
                  type="text"
                  value={newEntry.value}
                  onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}
                  placeholder={
                    newEntry.type === 'ACCOUNT_ID' ? 'acc-12345' :
                    newEntry.type === 'MERCHANT_ID' ? 'merchant-xyz' :
                    newEntry.type === 'IP' ? '192.168.1.1' :
                    'ID, US, CN'
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alasan (Opsional)
                </label>
                <textarea
                  value={newEntry.reason}
                  onChange={(e) => setNewEntry({ ...newEntry, reason: e.target.value })}
                  placeholder="Alasan ditambahkan ke blacklist..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewEntry({ type: 'ACCOUNT_ID', value: '', reason: '' })
                }}
                className="flex-1 py-3 px-4 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/10"
              >
                Batal
              </button>
              <button
                onClick={createEntry}
                disabled={creating || !newEntry.value.trim()}
                className="flex-1 py-3 px-4 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Tambahkan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
