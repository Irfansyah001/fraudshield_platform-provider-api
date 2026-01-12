import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Check, Sparkles, Crown, Users } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '', requirements: [] }
    
    const requirements = [
      { met: password.length >= 8, text: 'Minimal 8 karakter' },
      { met: /[a-z]/.test(password), text: 'Huruf kecil (a-z)' },
      { met: /[A-Z]/.test(password), text: 'Huruf besar (A-Z)' },
      { met: /[0-9]/.test(password), text: 'Angka (0-9)' },
      { met: /[@$!%*?&]/.test(password), text: 'Karakter spesial (@$!%*?&)' }
    ]
    
    const strength = requirements.filter(r => r.met).length

    const labels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat']
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-600']

    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || '',
      requirements,
      isValid: requirements.every(r => r.met)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.')
      return
    }

    if (!passwordStrength.isValid) {
      setError('Password tidak memenuhi persyaratan keamanan.')
      return
    }

    if (!agreedToTerms) {
      setError('Anda harus menyetujui syarat dan ketentuan.')
      return
    }

    setLoading(true)

    try {
      console.log('[Register] Mengirim data:', { name: formData.name, email: formData.email, role: formData.role })
      const result = await register(formData.name, formData.email, formData.password, formData.role)
      
      if (result.success) {
        console.log('[Register] Sukses:', { id: result.data?.user?.id, role: result.data?.user?.role })
        // Redirect admin ke panel admin, user biasa ke dashboard
        const redirectPath = formData.role === 'admin' ? '/admin' : '/dashboard'
        navigate(redirectPath, { replace: true })
      } else {
        setError(result.error || 'Pendaftaran gagal. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Register error:', error)
      setError(error?.response?.data?.error?.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-[#667eea]/5 to-[#764ba2]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FraudShield</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 border border-[#667eea]/30 rounded-full text-[10px] font-medium text-[#667eea]">
              <Sparkles className="w-3 h-3" />
              PRO
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Buat Akun Developer</h1>
          <p className="mt-2 text-gray-400">
            Mulai gratis dengan 1.000 request/bulan
          </p>
        </div>

        {/* Register Form Card */}
        <div className="card-premium p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
                  placeholder="Nama Anda"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
                  placeholder="anda@example.com"
                />
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipe Akun
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    formData.role === 'user'
                      ? 'bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 border-[#667eea] text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.role === 'user'
                      ? 'bg-linear-to-br from-[#667eea] to-[#764ba2]'
                      : 'bg-white/10'
                  }`}>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Developer</p>
                    <p className="text-xs text-gray-500">Akses API & Dashboard</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    formData.role === 'admin'
                      ? 'bg-linear-to-r from-amber-500/20 to-orange-500/20 border-amber-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.role === 'admin'
                      ? 'bg-linear-to-br from-amber-500 to-orange-500'
                      : 'bg-white/10'
                  }`}>
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Admin</p>
                    <p className="text-xs text-gray-500">Kelola seluruh sistem</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= passwordStrength.strength 
                            ? passwordStrength.color 
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="text-xs text-gray-400">
                      Kekuatan: <span className="text-white">{passwordStrength.label}</span>
                    </p>
                  )}
                  <div className="space-y-1">
                    {passwordStrength.requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Check className={`w-3 h-3 ${req.met ? 'text-emerald-400' : 'text-gray-600'}`} />
                        <span className={req.met ? 'text-gray-400' : 'text-gray-600'}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-2 text-xs text-red-400">Password tidak cocok</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-5 h-5 rounded-lg border shrink-0 flex items-center justify-center transition-colors ${
                  agreedToTerms 
                    ? 'bg-linear-to-r from-[#667eea] to-[#764ba2] border-transparent' 
                    : 'bg-white/5 border-white/20 hover:border-white/30'
                }`}
              >
                {agreedToTerms && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className="text-sm text-gray-400">
                Saya menyetujui{' '}
                <a href="#" className="text-[#667eea] hover:text-[#764ba2]">Syarat & Ketentuan</a>
                {' '}dan{' '}
                <a href="#" className="text-[#667eea] hover:text-[#764ba2]">Kebijakan Privasi</a>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full py-3 px-4 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[#667eea] font-medium hover:text-[#764ba2] transition-colors">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
