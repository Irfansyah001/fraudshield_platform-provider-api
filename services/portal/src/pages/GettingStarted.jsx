import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Key, 
  Code, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  BookOpen
} from 'lucide-react'
import Navbar from '../components/Navbar'

export default function GettingStarted() {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const steps = [
    {
      id: 1,
      title: 'Buat Akun Developer',
      description: 'Daftarkan akun Anda untuk mengakses dashboard dan mendapatkan API key.',
      icon: Key,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600">
            Kunjungi halaman pendaftaran dan buat akun baru dengan email Anda.
          </p>
          <Link 
            to="/register"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Daftar Sekarang <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              <strong>Tips:</strong> Gunakan password yang kuat dengan kombinasi huruf besar, 
              huruf kecil, angka, dan karakter spesial.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Dapatkan API Key',
      description: 'Generate API key dari dashboard untuk mengautentikasi request Anda.',
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600">
            Setelah login, kunjungi halaman <strong>API Keys</strong> di dashboard dan buat API key baru.
          </p>
          <div className="p-4 bg-slate-800 rounded-lg overflow-x-auto">
            <code className="text-green-400 text-sm whitespace-pre">
{`// API Key Anda akan terlihat seperti ini:
fs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// PENTING: Simpan API key dengan aman!
// API key hanya ditampilkan sekali saat pembuatan.`}
            </code>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Peringatan:</strong> Jangan pernah membagikan API key Anda atau 
              menyimpannya di repository publik. Gunakan environment variables.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Kirim Request Pertama',
      description: 'Gunakan API key untuk mengirim request fraud scoring pertama Anda.',
      icon: Code,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600">
            Gunakan contoh kode berikut untuk mengirim request fraud scoring:
          </p>
          
          {/* cURL Example */}
          <div>
            <div className="flex items-center justify-between bg-slate-700 px-4 py-2 rounded-t-lg">
              <span className="text-sm text-slate-300">cURL</span>
              <button
                onClick={() => copyToClipboard(`curl -X POST https://api.fraudshield.id/v1/score \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: fs_live_YOUR_API_KEY" \\
  -d '{
    "external_txn_id": "TXN-001",
    "account_id": "ACC-12345",
    "amount": 500000,
    "currency": "IDR",
    "available_balance": 1000000,
    "merchant_id": "MERCHANT-001",
    "ip": "103.28.100.1",
    "country": "ID"
  }'`, 'curl')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedIndex === 'curl' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-4 bg-slate-800 rounded-b-lg overflow-x-auto">
              <code className="text-green-400 text-sm whitespace-pre">
{`curl -X POST https://api.fraudshield.id/v1/score \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: fs_live_YOUR_API_KEY" \\
  -d '{
    "external_txn_id": "TXN-001",
    "account_id": "ACC-12345",
    "amount": 500000,
    "currency": "IDR",
    "available_balance": 1000000,
    "merchant_id": "MERCHANT-001",
    "ip": "103.28.100.1",
    "country": "ID"
  }'`}
              </code>
            </div>
          </div>

          {/* JavaScript Example */}
          <div>
            <div className="flex items-center justify-between bg-slate-700 px-4 py-2 rounded-t-lg">
              <span className="text-sm text-slate-300">JavaScript (Node.js)</span>
              <button
                onClick={() => copyToClipboard(`const response = await fetch('https://api.fraudshield.id/v1/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRAUDSHIELD_API_KEY
  },
  body: JSON.stringify({
    external_txn_id: 'TXN-001',
    account_id: 'ACC-12345',
    amount: 500000,
    currency: 'IDR',
    available_balance: 1000000,
    merchant_id: 'MERCHANT-001',
    ip: '103.28.100.1',
    country: 'ID'
  })
});

const result = await response.json();
console.log(result);`, 'js')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedIndex === 'js' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-4 bg-slate-800 rounded-b-lg overflow-x-auto">
              <code className="text-green-400 text-sm whitespace-pre">
{`const response = await fetch('https://api.fraudshield.id/v1/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRAUDSHIELD_API_KEY
  },
  body: JSON.stringify({
    external_txn_id: 'TXN-001',
    account_id: 'ACC-12345',
    amount: 500000,
    currency: 'IDR',
    available_balance: 1000000,
    merchant_id: 'MERCHANT-001',
    ip: '103.28.100.1',
    country: 'ID'
  })
});

const result = await response.json();
console.log(result);`}
              </code>
            </div>
          </div>

          {/* Python Example */}
          <div>
            <div className="flex items-center justify-between bg-slate-700 px-4 py-2 rounded-t-lg">
              <span className="text-sm text-slate-300">Python</span>
              <button
                onClick={() => copyToClipboard(`import requests
import os

response = requests.post(
    'https://api.fraudshield.id/v1/score',
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': os.environ['FRAUDSHIELD_API_KEY']
    },
    json={
        'external_txn_id': 'TXN-001',
        'account_id': 'ACC-12345',
        'amount': 500000,
        'currency': 'IDR',
        'available_balance': 1000000,
        'merchant_id': 'MERCHANT-001',
        'ip': '103.28.100.1',
        'country': 'ID'
    }
)

print(response.json())`, 'python')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedIndex === 'python' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-4 bg-slate-800 rounded-b-lg overflow-x-auto">
              <code className="text-green-400 text-sm whitespace-pre">
{`import requests
import os

response = requests.post(
    'https://api.fraudshield.id/v1/score',
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': os.environ['FRAUDSHIELD_API_KEY']
    },
    json={
        'external_txn_id': 'TXN-001',
        'account_id': 'ACC-12345',
        'amount': 500000,
        'currency': 'IDR',
        'available_balance': 1000000,
        'merchant_id': 'MERCHANT-001',
        'ip': '103.28.100.1',
        'country': 'ID'
    }
)

print(response.json())`}
              </code>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Pahami Response',
      description: 'Pelajari cara menginterpretasi hasil fraud scoring.',
      icon: Terminal,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600">
            API akan mengembalikan response dengan fraud score dan rekomendasi tindakan:
          </p>
          <div className="p-4 bg-slate-800 rounded-lg overflow-x-auto">
            <code className="text-green-400 text-sm whitespace-pre">
{`{
  "success": true,
  "data": {
    "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
    "external_txn_id": "TXN-001",
    "risk_score": 35,
    "risk_level": "MEDIUM",
    "recommendation": "REVIEW",
    "factors": [
      "velocity_normal",
      "amount_within_limit",
      "new_account_medium_risk"
    ],
    "processed_at": "2024-01-15T10:30:00Z"
  }
}`}
            </code>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-700">APPROVE</h4>
              <p className="text-sm text-green-600 mt-1">Score 0-49: Risiko rendah, transaksi aman.</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-700">REVIEW</h4>
              <p className="text-sm text-amber-600 mt-1">Score 50-79: Risiko sedang, perlu verifikasi.</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-700">DECLINE</h4>
              <p className="text-sm text-red-600 mt-1">Score 80-100: Risiko tinggi, tolak transaksi.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Kelola Blacklist',
      description: 'Tambahkan entitas mencurigakan ke dalam daftar hitam.',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600">
            Gunakan fitur blacklist untuk memblokir entitas yang terbukti melakukan fraud:
          </p>
          <div className="p-4 bg-slate-800 rounded-lg overflow-x-auto">
            <code className="text-green-400 text-sm whitespace-pre">
{`// Menambahkan akun ke blacklist
POST /v1/blacklist
{
  "type": "ACCOUNT_ID",
  "value": "ACC-FRAUDSTER-001",
  "reason": "Multiple confirmed fraud transactions"
}

// Tipe blacklist yang tersedia:
// - ACCOUNT_ID : ID akun pengguna
// - MERCHANT_ID : ID merchant
// - IP : Alamat IP
// - COUNTRY : Kode negara (2 huruf)`}
            </code>
          </div>
          <p className="text-sm text-slate-500">
            Transaksi dari entitas yang ada di blacklist akan otomatis mendapatkan score 100 dan rekomendasi DECLINE.
          </p>
        </div>
      )
    }
  ]

  const [activeStep, setActiveStep] = useState(1)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Panduan Memulai
          </h1>
          <p className="text-xl text-blue-100">
            Ikuti langkah-langkah berikut untuk mulai menggunakan FraudShield API
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    activeStep === step.id
                      ? 'bg-blue-600 text-white scale-110'
                      : activeStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {activeStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 rounded ${
                    activeStep > step.id ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`${activeStep === step.id ? 'block' : 'hidden'}`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Langkah {step.id}</p>
                  <h2 className="text-2xl font-bold text-slate-800">{step.title}</h2>
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-6">{step.description}</p>
              {step.content}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeStep === 1
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
                disabled={activeStep === steps.length}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeStep === steps.length
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Selanjutnya <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Tautan Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/docs" 
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4"
          >
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-slate-800">Dokumentasi API</h4>
              <p className="text-sm text-slate-500">Referensi lengkap</p>
            </div>
          </Link>
          <Link 
            to="/pricing" 
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4"
          >
            <Zap className="w-8 h-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-slate-800">Paket Harga</h4>
              <p className="text-sm text-slate-500">Pilih paket terbaik</p>
            </div>
          </Link>
          <a 
            href="http://localhost:4000/docs" 
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4"
          >
            <Globe className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-slate-800">Swagger UI</h4>
              <p className="text-sm text-slate-500">Coba API langsung</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  )
}
