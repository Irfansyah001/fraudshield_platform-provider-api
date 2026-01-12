import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        setSuccess(true);
        // Untuk testing, tampilkan token yang dikembalikan
        if (response.data.data.reset_token) {
          setResetToken(response.data.data.reset_token);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Terkirim!</h2>
            <p className="text-gray-300 mb-6">
              Jika email terdaftar, link reset password akan dikirim ke inbox Anda.
            </p>

            {/* Untuk testing - tampilkan token langsung */}
            {resetToken && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-yellow-400 text-sm font-medium mb-2">
                  🧪 Mode Testing - Token Reset:
                </p>
                <code className="text-xs text-yellow-300 break-all">{resetToken}</code>
                <p className="text-yellow-400/70 text-xs mt-2">
                  Gunakan token ini di halaman reset password.
                </p>
                <Link
                  to={`/reset-password?token=${resetToken}`}
                  className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  Langsung Reset Password →
                </Link>
              </div>
            )}

            <div className="space-y-3">
              <Link
                to="/reset-password"
                className="block w-full px-4 py-3 text-sm font-medium text-white bg-linear-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Masukkan Token Reset
              </Link>
              <Link
                to="/login"
                className="block w-full px-4 py-3 text-sm font-medium text-gray-300 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
              >
                Kembali ke Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            to="/login"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Login
          </Link>
          <h2 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Lupa Password?
          </h2>
          <p className="mt-2 text-gray-400">
            Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-linear-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Link Reset'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Ingat password?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
