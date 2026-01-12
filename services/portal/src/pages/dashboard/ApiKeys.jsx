import { useState, useEffect } from 'react'
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Shield,
  Zap
} from 'lucide-react'
import api from '../../utils/api'

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null)
  const [visibleKeys, setVisibleKeys] = useState({})
  const [copiedKey, setCopiedKey] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const response = await api.get('/keys')
      if (response.data.success) {
        setApiKeys(response.data.data.keys || [])
      }
    } catch (error) {
      setError(error?.response?.data?.error?.message || 'Gagal memuat API keys')
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      setError('Nama API key harus diisi')
      return
    }

    try {
      setCreating(true)
      setError('')
      const response = await api.post('/keys', { name: newKeyName })
      
      if (response.data.success) {
        setNewlyCreatedKey(response.data.data)
        setNewKeyName('')
        fetchApiKeys()
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal membuat API key')
    } finally {
      setCreating(false)
    }
  }

  const deleteApiKey = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus API key ini? Tindakan ini tidak dapat dibatalkan.')) {
      return
    }

    try {
      await api.delete(`/keys/${id}`)
      fetchApiKeys()
    } catch (error) {
      setError(error?.response?.data?.error?.message || 'Gagal menghapus API key')
    }
  }

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const maskApiKey = (key) => {
    if (!key) return '••••••••••••••••'
    return key.substring(0, 10) + '••••••••••••••••'
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-gray-400 mt-1">Kelola API key untuk mengakses FraudShield API</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          Buat API Key Baru
        </button>
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

      {/* Newly Created Key Alert */}
      {newlyCreatedKey && (
        <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-400 mb-2">API Key Berhasil Dibuat!</h3>
              <p className="text-sm text-gray-400 mb-4">
                Simpan API key ini dengan aman. API key hanya ditampilkan sekali dan tidak dapat dilihat lagi.
              </p>
              <div className="bg-[#0f0f23] rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-sm font-mono text-emerald-400 break-all">
                    {newlyCreatedKey.api_key}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newlyCreatedKey.api_key, 'new')}
                    className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors"
                  >
                    {copiedKey === 'new' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-emerald-400" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setNewlyCreatedKey(null)}
                className="mt-4 text-sm text-emerald-400 font-medium hover:text-emerald-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-xl flex items-center justify-center border border-[#667eea]/20">
              <Key className="w-5 h-5 text-[#667eea]" />
            </div>
            <h2 className="text-lg font-semibold text-white">Daftar API Key</h2>
          </div>
          <button
            onClick={fetchApiKeys}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-[#667eea] animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Memuat API keys...</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 flex items-center justify-center border border-[#667eea]/20">
              <Zap className="w-10 h-10 text-[#667eea]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Belum Ada API Key</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Buat API key pertama Anda untuk mulai menggunakan FraudShield API</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-xl hover:opacity-90 shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-5 h-5" />
              Buat API Key
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-xl flex items-center justify-center border border-[#667eea]/20">
                        <Key className="w-5 h-5 text-[#667eea]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{key.name}</h3>
                        <p className="text-sm text-gray-500">Dibuat: {formatDate(key.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        {visibleKeys[key.id] ? key.api_key : maskApiKey(key.api_key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title={visibleKeys[key.id] ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        {visibleKeys[key.id] ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.api_key, key.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Salin"
                      >
                        {copiedKey === key.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                      key.is_active 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {key.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20"
                      title="Hapus"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage Tips */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-xl flex items-center justify-center border border-[#667eea]/20">
            <Shield className="w-5 h-5 text-[#667eea]" />
          </div>
          <h3 className="font-semibold text-white">Tips Keamanan API Key</h3>
        </div>
        <ul className="space-y-3 text-sm text-gray-400">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
            Jangan pernah membagikan API key Anda kepada siapapun
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
            Simpan API key di environment variables, bukan di kode
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
            Rotasi API key secara berkala untuk keamanan
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
            Segera hapus API key yang tidak digunakan
          </li>
        </ul>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="card-premium max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-2">Buat API Key Baru</h2>
            <p className="text-gray-400 mb-6">
              Berikan nama untuk API key ini agar mudah diidentifikasi.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nama API Key
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="contoh: Production Server"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewKeyName('')
                }}
                className="flex-1 py-3 px-4 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  createApiKey()
                  setShowCreateModal(false)
                }}
                disabled={creating || !newKeyName.trim()}
                className="flex-1 py-3 px-4 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  'Buat API Key'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
