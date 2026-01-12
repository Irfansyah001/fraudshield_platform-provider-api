import { useState, useEffect, useCallback } from 'react'
import api from '../../utils/api'
import {
  Key,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react'

export default function AdminKeys() {
  const [keys, setKeys] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filterUserId, setFilterUserId] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchKeys = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (filterUserId) params.append('user_id', filterUserId)
      if (filterStatus) params.append('status', filterStatus)

      const response = await api.get(`/admin/keys?${params}`)
      if (response.data.success) {
        setKeys(response.data.data.keys)
        setPagination(response.data.data.pagination)
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal memuat data API keys')
    } finally {
      setLoading(false)
    }
  }, [filterUserId, filterStatus])

  useEffect(() => {
    fetchKeys()
  }, [fetchKeys])

  const handleToggle = async (id) => {
    try {
      await api.patch(`/admin/keys/${id}/toggle`)
      fetchKeys(pagination.page)
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal mengubah status API key')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/keys/${id}`)
      setDeleteConfirm(null)
      fetchKeys(pagination.page)
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal menghapus API key')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Key className="w-7 h-7 text-purple-400" />
          Semua API Keys
        </h1>
        <p className="text-gray-400 mt-1">Kelola semua API keys dari seluruh user</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by User ID..."
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea]/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#667eea]/50"
        >
          <option value="">Semua Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={() => fetchKeys(pagination.page)}
          className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">API Key</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Owner</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Terakhir Digunakan</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Dibuat</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#667eea]"></div>
                      Memuat...
                    </div>
                  </td>
                </tr>
              ) : keys.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    Tidak ada data API key
                  </td>
                </tr>
              ) : (
                keys.map((key) => (
                  <tr key={key.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{key.name || 'Unnamed Key'}</p>
                        <p className="text-sm text-gray-500 font-mono">{key.prefix}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{key.user_name}</p>
                          <p className="text-xs text-gray-500">{key.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        key.status === 'ACTIVE'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {key.status === 'ACTIVE' ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {key.last_used_at
                        ? new Date(key.last_used_at).toLocaleString('id-ID')
                        : 'Belum pernah'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(key.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(key.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            key.status === 'ACTIVE'
                              ? 'text-green-400 hover:bg-green-500/10'
                              : 'text-gray-400 hover:bg-white/10'
                          }`}
                          title={key.status === 'ACTIVE' ? 'Revoke' : 'Aktifkan'}
                        >
                          {key.status === 'ACTIVE' ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(key)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <p className="text-sm text-gray-400">
              Menampilkan {keys.length} dari {pagination.total} keys
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchKeys(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm text-white">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchKeys(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Hapus API Key?</h3>
                <p className="text-sm text-gray-400">{deleteConfirm.name || deleteConfirm.key_prefix}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              API key ini akan dihapus permanen dan tidak dapat digunakan lagi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-white/5 text-white rounded-lg hover:bg-white/10"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
