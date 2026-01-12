import { Link } from 'react-router-dom'
import { 
  Shield, 
  Zap, 
  Lock, 
  BarChart3, 
  Code2, 
  Globe,
  ArrowRight,
  CheckCircle2,
  Play,
  Sparkles
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Deteksi Real-time',
      description: 'Analisis transaksi dalam hitungan milidetik menggunakan algoritma machine learning terkini.'
    },
    {
      icon: Lock,
      title: 'Keamanan Tingkat Enterprise',
      description: 'Enkripsi end-to-end dan autentikasi API key untuk menjaga keamanan data Anda.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Mendalam',
      description: 'Dashboard analitik komprehensif untuk memantau pola penipuan dan tren transaksi.'
    },
    {
      icon: Code2,
      title: 'Integrasi Mudah',
      description: 'RESTful API yang sederhana dengan dokumentasi lengkap dan SDK untuk berbagai bahasa.'
    },
    {
      icon: Globe,
      title: 'Skalabilitas Global',
      description: 'Infrastruktur cloud yang dapat menangani jutaan transaksi per detik.'
    },
    {
      icon: Shield,
      title: 'Blacklist Management',
      description: 'Kelola daftar hitam account, merchant, IP, dan country dengan mudah melalui API.'
    },
  ]

  const stats = [
    { value: '99.9%', label: 'Akurasi Deteksi' },
    { value: '<50ms', label: 'Response Time' },
    { value: '10M+', label: 'Transaksi/Hari' },
    { value: '500+', label: 'Perusahaan' },
  ]

  const steps = [
    {
      step: '01',
      title: 'Daftar & Dapatkan API Key',
      description: 'Buat akun gratis dan dapatkan API key Anda dalam hitungan menit.'
    },
    {
      step: '02',
      title: 'Integrasikan API',
      description: 'Gunakan dokumentasi kami untuk mengintegrasikan API ke sistem Anda.'
    },
    {
      step: '03',
      title: 'Analisis Transaksi',
      description: 'Kirim data transaksi dan dapatkan skor risiko penipuan secara real-time.'
    },
    {
      step: '04',
      title: 'Lindungi Bisnis',
      description: 'Blokir transaksi mencurigakan dan pantau analytics melalui dashboard.'
    },
  ]

  return (
    <div className="overflow-hidden bg-[#0f0f23]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-125 h-125 bg-[#667eea]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-125 h-125 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-linear-to-r from-[#667eea]/5 to-[#764ba2]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/20 text-[#667eea] rounded-full text-sm font-medium mb-6 animate-pulse-soft">
              <Sparkles className="w-4 h-4" />
              Platform Deteksi Penipuan #1 di Indonesia
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Lindungi Bisnis Anda dari{' '}
              <span className="gradient-text">
                Penipuan Online
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              FraudShield API memberikan deteksi penipuan real-time menggunakan AI untuk melindungi transaksi bisnis Anda dari aktivitas mencurigakan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-purple-500/25"
              >
                Mulai Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Play className="w-5 h-5" />
                Lihat Dokumentasi
              </Link>
            </div>

            {/* Trusted by */}
            <div className="mt-16">
              <p className="text-sm text-gray-500 mb-6">Dipercaya oleh perusahaan terkemuka</p>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {['Tokopedia', 'Gojek', 'Shopee', 'Bukalapak', 'OVO'].map((company) => (
                  <span key={company} className="text-xl font-bold text-gray-600 hover:text-gray-400 transition-colors">{company}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#1a1a2e] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0f0f23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Solusi lengkap untuk mendeteksi dan mencegah penipuan di platform digital Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-premium p-8 hover:border-[#667eea]/30 transition-all group"
              >
                <div className="w-14 h-14 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cara Kerja
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Hanya dalam 4 langkah mudah untuk mulai melindungi bisnis Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-linear-to-r from-[#667eea]/30 to-[#764ba2]/30 -translate-x-1/2"></div>
                )}
                <div className="text-center">
                  <div className="text-6xl font-bold text-white/5 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-24 bg-[#0f0f23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Integrasi Semudah Copy-Paste
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Dengan dokumentasi lengkap dan contoh kode siap pakai, Anda bisa mengintegrasikan FraudShield API dalam hitungan menit.
              </p>
              <ul className="space-y-4">
                {[
                  'RESTful API yang mudah dipahami',
                  'Autentikasi dengan API Key',
                  'Response JSON yang konsisten',
                  'Error handling yang jelas',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-premium p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-gray-500 text-sm">request.js</span>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code className="text-gray-300">
{`const response = await fetch('https://api.fraudshield.id/v1/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'fs_live_xxxxxxxxxxxxxxxx'
  },
  body: JSON.stringify({
    account_id: 'acc-12345',
    merchant_id: 'merchant-xyz',
    ip_address: '103.123.45.67',
    amount: 1500000
  })
});

const data = await response.json();
console.log(data.risk_score); // 0.15 (low risk)`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-br from-[#667eea] to-[#764ba2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Melindungi Bisnis Anda?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Mulai gratis dengan 1.000 request per bulan. Tidak perlu kartu kredit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#667eea] font-semibold rounded-xl hover:bg-white/90 transition-all shadow-xl"
            >
              Daftar Gratis Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:border-white/50 hover:bg-white/10 transition-all"
            >
              Lihat Paket Harga
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
