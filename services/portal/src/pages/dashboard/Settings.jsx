import { useState, useEffect } from 'react'
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  Bell,
  Smartphone,
  Globe,
  Moon
} from 'lucide-react'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

export default function Settings() {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')
  
  // Profile form
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  
  // Password form
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    fraudAlerts: true,
    usageReports: false,
    newsletter: false
  })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSaveSuccess(false)
    
    try {
      setLoading(true)
      const response = await api.put('/me', { name: profile.name })
      if (response.data.success) {
        const updatedUser = response.data?.data?.user
        setUser(updatedUser ? { ...user, ...updatedUser } : { ...user, name: profile.name })
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal memperbarui profil')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setSaveSuccess(false)

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Password baru tidak cocok')
      return
    }

    if (passwords.newPassword.length < 8) {
      setError('Password minimal 8 karakter')
      return
    }

    try {
      setLoading(true)
      await api.put('/me/password', {
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword,
      })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal mengubah password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
        <p className="text-gray-400 mt-1">Kelola profil, keamanan, dan preferensi akun Anda</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-400" />
          <p className="text-sm text-emerald-400">Perubahan berhasil disimpan</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">
            ×
          </button>
        </div>
      )}

      {/* Profile Section */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center border border-[#667eea]/30">
            <User className="w-6 h-6 text-[#667eea]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Informasi Profil</h2>
            <p className="text-sm text-gray-400">Perbarui informasi akun Anda</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
                  placeholder="Nama Anda"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Email tidak dapat diubah</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Keamanan</h2>
            <p className="text-sm text-gray-400">Ubah password akun Anda</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password Saat Ini
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !passwords.currentPassword || !passwords.newPassword}
              className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 shadow-lg shadow-purple-500/20"
            >
              <Shield className="w-4 h-4" />
              Ubah Password
            </button>
          </div>
        </form>
      </div>

      {/* Notifications Section */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Bell className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Notifikasi</h2>
            <p className="text-sm text-gray-400">Kelola preferensi notifikasi Anda</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email Alert', desc: 'Terima notifikasi penting via email', icon: Mail },
            { key: 'fraudAlerts', label: 'Fraud Alert', desc: 'Notifikasi saat fraud terdeteksi', icon: Shield },
            { key: 'usageReports', label: 'Laporan Penggunaan', desc: 'Laporan mingguan penggunaan API', icon: Globe },
            { key: 'newsletter', label: 'Newsletter', desc: 'Update fitur dan tips terbaru', icon: Smartphone },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    notifications[item.key] ? 'bg-[#667eea]' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Theme Section */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Moon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Tampilan</h2>
            <p className="text-sm text-gray-400">Kustomisasi tampilan dashboard</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-linear-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Dark Mode</p>
              <p className="text-xs text-gray-500">Tema gelap dengan aksen ungu</p>
            </div>
          </div>
          <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Aktif
          </span>
        </div>
      </div>
    </div>
  )
}
