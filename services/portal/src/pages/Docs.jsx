import { useState, useCallback, createContext, useContext } from 'react'
import { 
  Book, 
  Code2, 
  Key, 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react'

// Context untuk copy functionality
const CopyContext = createContext(null)

// Komponen CodeBlock dipindahkan ke luar fungsi utama
function CodeBlock({ code, language = 'javascript', id }) {
  const { copiedCode, copyToClipboard } = useContext(CopyContext)
  
  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
        <span className="text-xs text-slate-400">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-slate-300">{code}</code>
      </pre>
    </div>
  )
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [copiedCode, setCopiedCode] = useState(null)

  const copyToClipboard = useCallback((text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }, [])

  const sections = [
    { id: 'getting-started', name: 'Memulai', icon: Book },
    { id: 'authentication', name: 'Autentikasi', icon: Key },
    { id: 'fraud-scoring', name: 'Fraud Scoring', icon: Shield },
    { id: 'blacklist', name: 'Blacklist API', icon: AlertTriangle },
    { id: 'errors', name: 'Error Handling', icon: AlertTriangle },
    { id: 'sdks', name: 'SDKs & Libraries', icon: Code2 },
  ]

  return (
    <CopyContext.Provider value={{ copiedCode, copyToClipboard }}>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari dokumentasi..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-slate-900 mb-2">Butuh bantuan?</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Tim support kami siap membantu Anda.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Hubungi Support
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Getting Started */}
            {activeSection === 'getting-started' && (
              <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Memulai dengan FraudShield API</h1>
                
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Selamat Datang!</h3>
                  <p className="text-blue-800">
                    FraudShield API membantu Anda mendeteksi dan mencegah transaksi penipuan secara real-time. 
                    Panduan ini akan membantu Anda memulai dalam hitungan menit.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Langkah 1: Dapatkan API Key</h2>
                <p className="text-slate-600 mb-4">
                  Setelah mendaftar, Anda bisa membuat API key melalui dashboard. API key digunakan untuk 
                  mengautentikasi setiap request ke API.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 mb-6">
                  <li>Masuk ke Dashboard FraudShield</li>
                  <li>Navigasi ke menu "API Keys"</li>
                  <li>Klik tombol "Buat API Key Baru"</li>
                  <li>Simpan API key dengan aman - ini hanya ditampilkan sekali!</li>
                </ol>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Langkah 2: Konfigurasi Environment</h2>
                <p className="text-slate-600 mb-4">
                  Base URL untuk semua request API:
                </p>
                <CodeBlock 
                  code="https://api.fraudshield.id/v1" 
                  language="text"
                  id="base-url"
                />

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Langkah 3: Request Pertama Anda</h2>
                <p className="text-slate-600 mb-4">
                  Berikut contoh request untuk mengecek skor risiko penipuan:
                </p>
                <CodeBlock 
                  code={`curl -X POST https://api.fraudshield.id/v1/score \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: fs_live_your_api_key_here" \\
  -d '{
    "external_txn_id": "txn_abc123xyz",
    "account_id": "acc_user456",
    "amount": 1500000,
    "currency": "IDR",
    "available_balance": 5000000,
    "merchant_id": "merchant_789",
    "ip": "103.123.45.67",
    "country": "ID",
    "timestamp": "2026-01-12T10:30:00Z"
  }'`}
                  language="bash"
                  id="first-request"
                />

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Response</h2>
                <CodeBlock 
                  code={`{
  "success": true,
  "data": {
    "request_id": "8f01f9d6-8d2b-4b5a-9b77-1a9d1a7ad7bf",
    "decision": "APPROVE",
    "risk_score": 12,
    "triggered_rules": [],
    "processed_at": "2026-01-12T10:30:00.000Z"
  }
}`}
                  language="json"
                  id="response-example"
                />
              </div>
            )}

            {/* Authentication */}
            {activeSection === 'authentication' && (
              <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Autentikasi</h1>
                
                <p className="text-slate-600 mb-6">
                  FraudShield API menggunakan API key untuk autentikasi. Setiap request harus menyertakan 
                  header <code className="bg-slate-100 px-2 py-1 rounded">X-API-Key</code> dengan API key Anda.
                </p>

                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-1">Keamanan API Key</h3>
                      <p className="text-yellow-800 text-sm">
                        Jangan pernah membagikan API key Anda atau menyimpannya di kode yang bisa diakses publik.
                        Gunakan environment variables untuk menyimpan API key.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Format API Key</h2>
                <p className="text-slate-600 mb-4">
                  API key memiliki format: <code className="bg-slate-100 px-2 py-1 rounded">fs_live_xxxxxxxxxxxxxxxx</code>
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
                  <li><code className="bg-slate-100 px-1 rounded">fs_live_</code> - Prefix untuk production key</li>
                  <li><code className="bg-slate-100 px-1 rounded">fs_test_</code> - Prefix untuk testing key (akan datang)</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contoh Penggunaan</h2>
                <CodeBlock 
                  code={`// Node.js dengan Axios
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.fraudshield.id/v1',
  headers: {
    'X-API-Key': process.env.FRAUDSHIELD_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Gunakan instance untuk request
const response = await api.post('/score', {
  external_txn_id: 'txn_abc123xyz',
  account_id: 'acc_user456',
  amount: 1500000,
  currency: 'IDR',
  available_balance: 5000000,
  merchant_id: 'merchant_789',
  ip: '103.123.45.67',
  country: 'ID'
});`}
                  language="javascript"
                  id="auth-example"
                />

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Error Autentikasi</h2>
                <p className="text-slate-600 mb-4">
                  Jika API key tidak valid atau tidak disertakan, API akan mengembalikan error 401:
                </p>
                <CodeBlock 
                  code={`{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "API key tidak valid atau tidak disertakan"
  }
}`}
                  language="json"
                  id="auth-error"
                />
              </div>
            )}

            {/* Fraud Scoring */}
            {activeSection === 'fraud-scoring' && (
              <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Fraud Scoring API</h1>
                
                <p className="text-slate-600 mb-6">
                  Endpoint utama untuk menganalisis risiko penipuan dari sebuah transaksi.
                </p>

                <div className="bg-slate-100 rounded-xl p-4 mb-8 flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded">POST</span>
                  <code className="text-slate-800">/v1/score</code>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Request Body</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Parameter</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Tipe</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Wajib</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 text-sm"><code>external_txn_id</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">string</td>
                        <td className="px-4 py-3 text-sm">Ya</td>
                        <td className="px-4 py-3 text-sm text-slate-600">ID transaksi unik dari sistem Anda</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm"><code>account_id</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">string</td>
                        <td className="px-4 py-3 text-sm">Ya</td>
                        <td className="px-4 py-3 text-sm text-slate-600">ID akun pelanggan</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm"><code>amount</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">number</td>
                        <td className="px-4 py-3 text-sm">Ya</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Nilai transaksi</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm"><code>currency</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">string</td>
                        <td className="px-4 py-3 text-sm">Ya</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Kode mata uang (mis. IDR, USD)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm"><code>available_balance</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">number</td>
                        <td className="px-4 py-3 text-sm">Ya</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Saldo tersedia saat transaksi</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm"><code>merchant_id</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">string</td>
                        <td className="px-4 py-3 text-sm">Tidak</td>
                        <td className="px-4 py-3 text-sm text-slate-600">ID merchant</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm"><code>ip</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">string</td>
                        <td className="px-4 py-3 text-sm">Tidak</td>
                        <td className="px-4 py-3 text-sm text-slate-600">IP pelanggan</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm"><code>country</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">string</td>
                        <td className="px-4 py-3 text-sm">Tidak</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Kode negara (mis. ID, US)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm"><code>timestamp</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">string (ISO 8601)</td>
                        <td className="px-4 py-3 text-sm">Tidak</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Waktu transaksi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>


                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contoh Request</h2>
                <CodeBlock 
                  code={`const response = await fetch('https://api.fraudshield.id/v1/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'fs_live_your_api_key'
  },
  body: JSON.stringify({
    external_txn_id: 'txn_abc123xyz',
    account_id: 'acc_user456',
    amount: 2500000,
    currency: 'IDR',
    available_balance: 10000000,
    merchant_id: 'merchant_789',
    ip: '103.123.45.67',
    country: 'ID',
    timestamp: new Date().toISOString(),
  })
});

const data = await response.json();`}
                  language="javascript"
                  id="score-request"
                />

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Response</h2>
                <CodeBlock 
                  code={`{
  "success": true,
  "data": {
    "request_id": "8f01f9d6-8d2b-4b5a-9b77-1a9d1a7ad7bf",
    "decision": "REVIEW",
    "risk_score": 65,
    "triggered_rules": [
      {
        "rule": "VELOCITY",
        "severity": "MEDIUM",
        "reason": "Medium velocity: 4 transactions in last 5 minutes (threshold: 3)"
      }
    ],
    "processed_at": "2026-01-12T10:30:00.000Z"
  }
}`}
                  language="json"
                  id="score-response"
                />

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Risk Levels</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                    <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs font-bold rounded mb-2">APPROVE</span>
                    <p className="text-sm text-slate-600">Risk score 0 - 49</p>
                    <p className="text-sm text-green-700">Transaksi direkomendasikan lanjut</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                    <span className="inline-block px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded mb-2">REVIEW</span>
                    <p className="text-sm text-slate-600">Risk score 50 - 79</p>
                    <p className="text-sm text-yellow-700">Transaksi direkomendasikan ditinjau</p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded mb-2">DECLINE</span>
                    <p className="text-sm text-slate-600">Risk score 80 - 100</p>
                    <p className="text-sm text-red-700">Transaksi direkomendasikan ditolak</p>
                  </div>
                </div>
              </div>
            )}

            {/* Blacklist */}
            {activeSection === 'blacklist' && (
              <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Blacklist API</h1>
                
                <p className="text-slate-600 mb-6">
                  Kelola daftar hitam account, merchant, IP, dan country yang diketahui berisiko.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tambah ke Blacklist</h2>
                <div className="bg-slate-100 rounded-xl p-4 mb-4 flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded">POST</span>
                  <code className="text-slate-800">/blacklist</code>
                </div>
                <CodeBlock 
                  code={`// Request
{
  "type": "ACCOUNT_ID",      // ACCOUNT_ID, MERCHANT_ID, IP, COUNTRY
  "value": "fraudster_123",
  "reason": "Confirmed fraud case #123"
}

// Response
{
  "success": true,
  "data": {
    "id": 123,
    "type": "ACCOUNT_ID",
    "value": "fraudster_123",
    "reason": "Confirmed fraud case #123",
    "active": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}`}
                  language="json"
                  id="blacklist-add"
                />

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Lihat Semua Blacklist</h2>
                <div className="bg-slate-100 rounded-xl p-4 mb-4 flex items-center gap-4">
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded">GET</span>
                  <code className="text-slate-800">/blacklist</code>
                </div>
                <p className="text-slate-600 mb-4">
                  Query parameters: <code>type</code> (optional), <code>page</code>, <code>limit</code>
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Hapus dari Blacklist</h2>
                <div className="bg-slate-100 rounded-xl p-4 mb-4 flex items-center gap-4">
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded">DELETE</span>
                  <code className="text-slate-800">/blacklist/:id</code>
                </div>
              </div>
            )}

            {/* Errors */}
            {activeSection === 'errors' && (
              <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Error Handling</h1>
                
                <p className="text-slate-600 mb-6">
                  FraudShield API menggunakan kode status HTTP standar dan mengembalikan error dalam format JSON yang konsisten.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Format Error</h2>
                <CodeBlock 
                  code={`{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Deskripsi error yang mudah dipahami",
    "details": {}  // Optional, informasi tambahan
  }
}`}
                  language="json"
                  id="error-format"
                />

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Kode Error</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">HTTP</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 text-sm">400</td>
                        <td className="px-4 py-3 text-sm"><code>BAD_REQUEST</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">Request tidak valid</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">401</td>
                        <td className="px-4 py-3 text-sm"><code>UNAUTHORIZED</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">API key tidak valid</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">403</td>
                        <td className="px-4 py-3 text-sm"><code>FORBIDDEN</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">Akses ditolak</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">404</td>
                        <td className="px-4 py-3 text-sm"><code>NOT_FOUND</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">Resource tidak ditemukan</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">429</td>
                        <td className="px-4 py-3 text-sm"><code>RATE_LIMITED</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">Terlalu banyak request</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">500</td>
                        <td className="px-4 py-3 text-sm"><code>INTERNAL_ERROR</code></td>
                        <td className="px-4 py-3 text-sm text-slate-600">Error server internal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SDKs */}
            {activeSection === 'sdks' && (
              <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">SDKs & Libraries</h1>
                
                <p className="text-slate-600 mb-6">
                  Gunakan SDK resmi kami untuk mempermudah integrasi dengan berbagai bahasa pemrograman.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                  <p className="text-blue-800">
                    <strong>Coming Soon:</strong> SDK untuk Node.js, Python, PHP, Go, dan Java sedang dalam pengembangan.
                    Untuk sementara, Anda bisa menggunakan HTTP client standar.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Node.js (Coming Soon)</h2>
                <CodeBlock 
                  code={`// npm install @fraudshield/node
const FraudShield = require('@fraudshield/node');

const client = new FraudShield('fs_live_your_api_key');

const result = await client.score({
  external_txn_id: 'txn_abc123xyz',
  account_id: 'acc_user456',
  amount: 1500000,
  currency: 'IDR',
  available_balance: 5000000,
  merchant_id: 'merchant_789',
  ip: '103.123.45.67',
  country: 'ID'
});

console.log(result.risk_score);`}
                  language="javascript"
                  id="sdk-node"
                />

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Python (Coming Soon)</h2>
                <CodeBlock 
                  code={`# pip install fraudshield
from fraudshield import FraudShield

client = FraudShield('fs_live_your_api_key')

result = client.score(
  external_txn_id='txn_abc123xyz',
  account_id='acc_user456',
  amount=1500000,
  currency='IDR',
  available_balance=5000000,
  merchant_id='merchant_789',
  ip='103.123.45.67',
  country='ID'
)

print(result.risk_score)`}
                  language="python"
                  id="sdk-python"
                />

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">PHP (Coming Soon)</h2>
                <CodeBlock 
                  code={`// composer require fraudshield/php
use FraudShield\\Client;

$client = new Client('fs_live_your_api_key');

$result = $client->score([
  'external_txn_id' => 'txn_abc123xyz',
  'account_id' => 'acc_user456',
  'amount' => 1500000,
  'currency' => 'IDR',
  'available_balance' => 5000000,
  'merchant_id' => 'merchant_789',
  'ip' => '103.123.45.67',
  'country' => 'ID'
]);

echo $result->risk_score;`}
                  language="php"
                  id="sdk-php"
                />
              </div>
            )}
          </main>
        </div>
      </div>
      </div>
    </CopyContext.Provider>
  )
}
