import { useState, useEffect, useCallback } from 'react'
import api from '../../utils/api'
import {
  FileText,
  Search,
  X,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Crown
} from 'lucide-react'

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filterAdminId, setFilterAdminId] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterEntityType, setFilterEntityType] = useState('')
  const [error, setError] = useState(null)

  const fetchLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 50 })
      if (filterAdminId) params.append('admin_id', filterAdminId)
      if (filterAction) params.append('action', filterAction)
      if (filterEntityType) params.append('entity_type', filterEntityType)

      const response = await api.get(`/admin/audit-logs?${params}`)
      if (response.data.success) {
        setLogs(response.data.data.logs)
        setPagination(response.data.data.pagination)
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal memuat audit logs')
    } finally {
      setLoading(false)
    }
  }, [filterAdminId, filterAction, filterEntityType])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'bg-green-500/20 text-green-400'
      case 'UPDATE': return 'bg-blue-500/20 text-blue-400'
      case 'DELETE': return 'bg-red-500/20 text-red-400'
      case 'ACTIVATE': return 'bg-emerald-500/20 text-emerald-400'
      case 'DEACTIVATE': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getEntityColor = (type) => {
    switch (type) {
      case 'user': return 'bg-blue-500/20 text-blue-400'
      case 'api_key': return 'bg-purple-500/20 text-purple-400'
      case 'blacklist_entry': return 'bg-amber-500/20 text-amber-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="w-7 h-7 text-purple-400" />
          Audit Logs
        </h1>
        <p className="text-gray-400 mt-1">Riwayat semua aktivitas admin di sistem</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by Admin ID..."
            value={filterAdminId}
            onChange={(e) => setFilterAdminId(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea]/50"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#667eea]/50"
        >
          <option value="">Semua Action</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="ACTIVATE">Activate</option>
          <option value="DEACTIVATE">Deactivate</option>
        </select>
        <select
          value={filterEntityType}
          onChange={(e) => setFilterEntityType(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#667eea]/50"
        >
          <option value="">Semua Entity</option>
          <option value="user">User</option>
          <option value="api_key">API Key</option>
          <option value="blacklist_entry">Blacklist</option>
        </select>
        <button
          onClick={() => fetchLogs(pagination.page)}
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
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Waktu</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Admin</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Action</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Entity</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Entity ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">IP Address</th>
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
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    Tidak ada audit logs
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-linear-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Crown className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{log.admin_name}</p>
                          <p className="text-xs text-gray-500">{log.admin_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getEntityColor(log.entity_type)}`}>
                        {log.entity_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-mono">
                      {log.entity_id || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                      {log.ip_address || '-'}
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
              Menampilkan {logs.length} dari {pagination.total} logs
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm text-white">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
