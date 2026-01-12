# 📚 Materi Pembelajaran FraudShield API
## Panduan Lengkap untuk Mahasiswa IT

---

## Daftar Isi

1. [Pengantar](#1-pengantar)
2. [Konsep Dasar yang Wajib Dipahami](#2-konsep-dasar-yang-wajib-dipahami)
3. [Arsitektur Sistem FraudShield](#3-arsitektur-sistem-fraudshield)
4. [Komponen Backend (API Service)](#4-komponen-backend-api-service)
5. [Komponen Frontend (Portal Client)](#5-komponen-frontend-portal-client)
6. [Database dan Struktur Data](#6-database-dan-struktur-data)
7. [Sistem Autentikasi](#7-sistem-autentikasi)
8. [Algoritma Fraud Scoring](#8-algoritma-fraud-scoring)
9. [API Endpoints](#9-api-endpoints)
10. [Keamanan dan Best Practices](#10-keamanan-dan-best-practices)
11. [Pertanyaan yang Mungkin Ditanyakan Dosen](#11-pertanyaan-yang-mungkin-ditanyakan-dosen)
12. [Glosarium Istilah](#12-glosarium-istilah)

---

## 1. Pengantar

### 1.1 Apa itu FraudShield?

**FraudShield** adalah platform **Provider API** untuk deteksi penipuan (fraud detection) secara real-time. Platform ini menyediakan layanan API yang dapat diintegrasikan oleh developer atau bisnis untuk menilai risiko transaksi keuangan.

### 1.2 Mengapa Platform Ini Dibuat?

Dalam dunia e-commerce dan fintech, penipuan transaksi adalah masalah serius. FraudShield hadir untuk:
- Membantu bisnis mendeteksi transaksi mencurigakan
- Memberikan skor risiko secara instan (real-time)
- Menyediakan sistem blacklist untuk memblokir pelaku penipuan

### 1.3 Siapa Target Pengguna?

| Pengguna | Peran |
|----------|-------|
| **Developer** | Mengintegrasikan API ke aplikasi mereka |
| **Business Owner** | Memantau transaksi dan mengelola blacklist |
| **System Admin** | Mengelola API keys dan pengaturan |

---

## 2. Konsep Dasar yang Wajib Dipahami

### 2.1 REST API

**REST (Representational State Transfer)** adalah arsitektur untuk membangun web service.

**Karakteristik REST API:**
- Menggunakan HTTP methods (GET, POST, PUT, DELETE)
- Stateless (setiap request independen)
- Menggunakan URL sebagai resource identifier
- Response dalam format JSON

**Contoh:**
```
GET  /users      → Mengambil daftar user
POST /users      → Membuat user baru
PUT  /users/1    → Mengupdate user dengan id 1
DELETE /users/1  → Menghapus user dengan id 1
```

### 2.2 JSON (JavaScript Object Notation)

Format pertukaran data yang digunakan dalam API.

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2.3 HTTP Status Codes

| Code | Meaning | Kapan Digunakan |
|------|---------|-----------------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource baru berhasil dibuat |
| 400 | Bad Request | Request tidak valid |
| 401 | Unauthorized | Belum login / token invalid |
| 403 | Forbidden | Tidak punya akses |
| 404 | Not Found | Resource tidak ditemukan |
| 409 | Conflict | Data sudah ada (duplicate) |
| 500 | Internal Server Error | Error di server |

### 2.4 Authentication vs Authorization

| Aspek | Authentication | Authorization |
|-------|---------------|---------------|
| **Pertanyaan** | "Siapa kamu?" | "Apa yang boleh kamu lakukan?" |
| **Contoh** | Login dengan email/password | User biasa tidak bisa akses admin panel |
| **Di FraudShield** | JWT Token | API Key untuk scoring |

---

## 3. Arsitektur Sistem FraudShield

### 3.1 Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FraudShield Platform                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────┐          ┌─────────────────┐                      │
│   │   Portal Web    │  HTTP    │   API Server    │                      │
│   │  (React + Vite) │─────────▶│ (Node.js/Express)│                      │
│   │   Port: 3000    │          │   Port: 4000    │                      │
│   └─────────────────┘          └────────┬────────┘                      │
│          │                              │                                │
│          │ Proxy /api                   │                                │
│          └──────────────────────────────┤                                │
│                                         │                                │
│                                ┌────────▼────────┐                      │
│                                │     MySQL       │                      │
│                                │   Database      │                      │
│                                │   Port: 3306    │                      │
│                                └─────────────────┘                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │  External App   │
                    │ (E-commerce,    │
                    │  Mobile App,    │──── POST /v1/score ────▶ API Server
                    │  Payment Gateway)│     (dengan X-API-Key)
                    └─────────────────┘
```

### 3.2 Penjelasan Komponen

| Komponen | Teknologi | Port | Fungsi |
|----------|-----------|------|--------|
| **Portal** | React + Vite | 3000 | Dashboard untuk developer |
| **API** | Node.js + Express | 4000 | Backend service |
| **Database** | MySQL | 3306 | Penyimpanan data |

### 3.3 Alur Data

```
1. Developer login via Portal (React)
         ↓
2. Portal mengirim request ke /api (proxy ke port 4000)
         ↓
3. API Server memvalidasi JWT Token
         ↓
4. API Server query ke MySQL Database
         ↓
5. Response dikembalikan ke Portal
         ↓
6. Portal menampilkan data ke user
```

---

## 4. Komponen Backend (API Service)

### 4.1 Struktur Folder

```
services/api/
├── src/
│   ├── app.js              # Setup Express app
│   ├── server.js           # Entry point
│   ├── config/
│   │   ├── db.js           # Koneksi database
│   │   └── env.js          # Environment variables
│   ├── controllers/        # Logic handler untuk setiap route
│   │   ├── auth.controller.js
│   │   ├── keys.controller.js
│   │   ├── score.controller.js
│   │   └── ...
│   ├── middleware/         # Fungsi perantara
│   │   ├── authJwt.js      # Validasi JWT token
│   │   ├── apiKeyAuth.js   # Validasi API Key
│   │   ├── errorHandler.js # Global error handler
│   │   └── ...
│   ├── routes/             # Definisi endpoint
│   ├── services/           # Business logic
│   └── utils/              # Helper functions
├── db/
│   ├── schema.sql          # Struktur tabel
│   └── seed.sql            # Data awal
└── docs/
    └── openapi.yaml        # Dokumentasi API (Swagger)
```

### 4.2 Penjelasan Layer Architecture

```
┌─────────────────────────────────────────┐
│              Routes Layer               │  ← Definisi endpoint URL
├─────────────────────────────────────────┤
│            Middleware Layer             │  ← Validasi, auth, logging
├─────────────────────────────────────────┤
│            Controller Layer             │  ← Handle request/response
├─────────────────────────────────────────┤
│             Service Layer               │  ← Business logic
├─────────────────────────────────────────┤
│              Data Layer                 │  ← Query database
└─────────────────────────────────────────┘
```

### 4.3 Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Node.js | 18+ | Runtime JavaScript |
| Express.js | 4.x | Web framework |
| MySQL | 8.0 | Database |
| jsonwebtoken | - | JWT authentication |
| bcrypt | - | Password hashing |
| Joi | - | Input validation |
| Helmet | - | Security headers |
| CORS | - | Cross-origin access |

---

## 5. Komponen Frontend (Portal Client)

### 5.1 Struktur Folder

```
services/portal/
├── src/
│   ├── main.jsx            # Entry point React
│   ├── App.jsx             # Root component + routing
│   ├── index.css           # Global styles (Tailwind)
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx # State management untuk auth
│   ├── pages/              # Halaman-halaman
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── dashboard/
│   │       ├── Overview.jsx
│   │       ├── ApiKeys.jsx
│   │       ├── Blacklist.jsx
│   │       ├── Usage.jsx
│   │       └── Settings.jsx
│   └── utils/
│       └── api.js          # Axios instance
├── vite.config.js          # Vite configuration
└── package.json
```

### 5.2 Teknologi Frontend

| Teknologi | Fungsi |
|-----------|--------|
| React 18 | UI Library |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Tailwind CSS | Utility-first CSS framework |
| Axios | HTTP client |
| Lucide React | Icon library |

### 5.3 Konsep Penting di Frontend

#### Context API (State Management)
```jsx
// AuthContext.jsx - Menyimpan state user secara global
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  // ... login, logout, register functions
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

#### Protected Route
```jsx
// Komponen yang mencegah akses tanpa login
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return children
}
```

---

## 6. Database dan Struktur Data

### 6.1 Entity Relationship Diagram (ERD)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │    api_keys     │       │  transactions   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │──┐    │ id (PK)         │
│ name            │  │    │ user_id (FK)    │◀─┘    │ api_key_id (FK) │◀─┘
│ email           │  │    │ name            │       │ external_txn_id │
│ password_hash   │  │    │ prefix          │       │ account_id      │
│ created_at      │  │    │ key_hash        │       │ amount          │
│ updated_at      │  │    │ status          │       │ risk_score      │
└─────────────────┘  │    │ last_used_at    │       │ decision        │
                     │    └─────────────────┘       │ triggered_rules │
                     │                              └─────────────────┘
                     │
                     │    ┌─────────────────┐       ┌─────────────────┐
                     │    │blacklist_entries│       │ password_resets │
                     │    ├─────────────────┤       ├─────────────────┤
                     └───▶│ id (PK)         │       │ id (PK)         │
                          │ user_id (FK)    │◀──────│ user_id (FK)    │
                          │ type            │       │ token           │
                          │ value           │       │ expires_at      │
                          │ reason          │       │ used            │
                          │ active          │       └─────────────────┘
                          └─────────────────┘
```

### 6.2 Penjelasan Tabel

#### Tabel `users`
Menyimpan data developer yang mendaftar.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | Primary key, auto increment |
| name | VARCHAR(255) | Nama lengkap |
| email | VARCHAR(255) | Email (unique) |
| password_hash | VARCHAR(255) | Password yang sudah di-hash dengan bcrypt |
| created_at | TIMESTAMP | Waktu registrasi |

#### Tabel `api_keys`
Menyimpan API key yang dibuat oleh user.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | Primary key |
| user_id | INT | Foreign key ke users |
| name | VARCHAR(255) | Nama deskriptif untuk key |
| prefix | VARCHAR(20) | 8 karakter awal key (untuk identifikasi) |
| key_hash | VARCHAR(255) | Hash dari full API key |
| status | ENUM | 'ACTIVE' atau 'REVOKED' |
| last_used_at | TIMESTAMP | Kapan terakhir digunakan |

#### Tabel `blacklist_entries`
Menyimpan daftar entitas yang di-blacklist.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| type | ENUM | 'ACCOUNT_ID', 'MERCHANT_ID', 'IP', 'COUNTRY' |
| value | VARCHAR(255) | Nilai yang di-blacklist |
| reason | TEXT | Alasan blacklist |
| active | BOOLEAN | Apakah masih aktif |

#### Tabel `transactions`
Menyimpan riwayat semua transaksi yang dinilai.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| external_txn_id | VARCHAR(255) | ID transaksi dari client |
| amount | DECIMAL | Jumlah transaksi |
| risk_score | INT | Skor risiko (0-100) |
| decision | ENUM | 'APPROVE', 'REVIEW', 'DECLINE' |
| triggered_rules_json | JSON | Rule yang terpicu |

---

## 7. Sistem Autentikasi

### 7.1 Dua Jenis Autentikasi

FraudShield menggunakan **dua sistem autentikasi** yang berbeda:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEM AUTENTIKASI                            │
├────────────────────────────┬────────────────────────────────────┤
│      JWT Bearer Token      │           API Key                  │
├────────────────────────────┼────────────────────────────────────┤
│ Untuk: Portal/Dashboard    │ Untuk: Fraud Scoring               │
│ Header: Authorization      │ Header: X-API-Key                  │
│ Format: Bearer <token>     │ Format: fs_live_xxxx...            │
│ Expire: 1 jam              │ Tidak expire (revoke manual)       │
│ Dapat: /me, /keys, /stats  │ Dapat: /v1/score                   │
└────────────────────────────┴────────────────────────────────────┘
```

### 7.2 Alur JWT Authentication

```
1. User POST /auth/login dengan {email, password}
         ↓
2. Server verifikasi password dengan bcrypt.compare()
         ↓
3. Jika valid, server generate JWT dengan jwt.sign()
         ↓
4. JWT dikembalikan ke client
         ↓
5. Client simpan di localStorage
         ↓
6. Setiap request, client kirim header:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
         ↓
7. Server validasi JWT dengan jwt.verify()
```

### 7.3 Struktur JWT Token

JWT terdiri dari 3 bagian yang dipisahkan titik (.):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTYxNjE2MTYxNn0.xxxxx
```

| Bagian | Isi |
|--------|-----|
| Header | {"alg": "HS256", "typ": "JWT"} |
| Payload | {"userId": 1, "email": "john@example.com", "iat": 1616161616} |
| Signature | HMAC-SHA256(header + payload, secret) |

### 7.4 Alur API Key Authentication

```
1. User login ke Portal
         ↓
2. User buat API Key via POST /keys
         ↓
3. Server generate random key: fs_live_a1b2c3d4...
         ↓
4. Server simpan HASH dari key (bukan plaintext!)
         ↓
5. Server kembalikan full key (hanya sekali ini!)
         ↓
6. User simpan key di aplikasi mereka
         ↓
7. Saat scoring, kirim header:
   X-API-Key: fs_live_a1b2c3d4...
         ↓
8. Server hash key yang diterima
         ↓
9. Server bandingkan dengan hash di database
```

---

## 8. Algoritma Fraud Scoring

### 8.1 Gambaran Umum

Sistem scoring FraudShield menganalisis transaksi dan memberikan:
- **Risk Score**: 0-100 (semakin tinggi = semakin berisiko)
- **Decision**: APPROVE, REVIEW, atau DECLINE

### 8.2 Rule-based Scoring

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRAUD SCORING PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input: Transaction Data                                         │
│    ↓                                                             │
│  ┌────────────────────┐                                         │
│  │ 1. BLACKLIST CHECK │ ──▶ Hard Decline jika match             │
│  └────────────────────┘     (ACCOUNT_ID, IP, MERCHANT, COUNTRY) │
│    ↓                                                             │
│  ┌────────────────────┐                                         │
│  │ 2. BALANCE CHECK   │ ──▶ Hard Decline jika amount > balance  │
│  └────────────────────┘                                         │
│    ↓                                                             │
│  ┌────────────────────┐                                         │
│  │ 3. VELOCITY CHECK  │ ──▶ +40 atau +80 risk score             │
│  └────────────────────┘     (terlalu banyak transaksi/5 menit)  │
│    ↓                                                             │
│  ┌────────────────────┐                                         │
│  │ 4. DAILY LIMIT     │ ──▶ +30 atau +70 risk score             │
│  └────────────────────┘     (melebihi limit harian)             │
│    ↓                                                             │
│  Calculate Final Score                                           │
│    ↓                                                             │
│  ┌────────────────────┐                                         │
│  │ DECISION LOGIC     │                                         │
│  │ score >= 80: DECLINE│                                        │
│  │ score >= 50: REVIEW │                                        │
│  │ score < 50: APPROVE │                                        │
│  └────────────────────┘                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Detail Setiap Rule

#### Rule 1: Blacklist Check
```javascript
// Cek apakah account_id, merchant_id, ip, atau country ada di blacklist
const blacklistMatches = await blacklistService.checkMultipleBlacklist(userId, {
  account_id: accountId,
  merchant_id: merchantId,
  ip: ip,
  country: country,
});

if (blacklistMatches.length > 0) {
  hardDecline = true;  // Langsung tolak
}
```

#### Rule 2: Insufficient Funds
```javascript
if (amount > availableBalance) {
  hardDecline = true;
  // Transaksi ditolak karena saldo tidak cukup
}
```

#### Rule 3: Velocity Check
```javascript
// Hitung berapa transaksi dalam 5 menit terakhir
const velocityCount = await getVelocityCount(apiKeyId, accountId, 5 * 60 * 1000);

if (velocityCount > 6) {
  riskScore += 80;  // HIGH severity
} else if (velocityCount > 3) {
  riskScore += 40;  // MEDIUM severity
}
```

#### Rule 4: Daily Limit
```javascript
const dailySum = await getDailySum(apiKeyId, accountId);
const projectedDaily = dailySum + amount;

if (projectedDaily > 2000000) {
  riskScore += 70;  // HIGH severity
} else if (projectedDaily > 1000000) {
  riskScore += 30;  // MEDIUM severity
}
```

### 8.4 Contoh Response Scoring

```json
{
  "success": true,
  "data": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "decision": "REVIEW",
    "risk_score": 55,
    "triggered_rules": [
      {
        "rule": "VELOCITY",
        "severity": "MEDIUM",
        "reason": "Medium velocity: 4 transactions in last 5 minutes (threshold: 3)"
      },
      {
        "rule": "DAILY_LIMIT",
        "severity": "MEDIUM",
        "reason": "Projected daily total (1500000) exceeds medium threshold (1000000)"
      }
    ],
    "processed_at": "2026-01-12T10:30:00.000Z"
  }
}
```

---

## 9. API Endpoints

### 9.1 Ringkasan Endpoint

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | /auth/register | - | Registrasi akun baru |
| POST | /auth/login | - | Login mendapatkan token |
| POST | /auth/forgot-password | - | Request reset password |
| POST | /auth/reset-password | - | Reset password dengan token |
| GET | /me | JWT | Ambil profil user |
| PUT | /me | JWT | Update profil user |
| PUT | /me/password | JWT | Ubah password |
| GET | /keys | JWT | List API keys |
| POST | /keys | JWT | Buat API key baru |
| DELETE | /keys/:id | JWT | Hapus/revoke API key |
| GET | /blacklist | JWT | List blacklist entries |
| POST | /blacklist | JWT | Tambah blacklist |
| GET | /blacklist/:id | JWT | Detail blacklist |
| PUT | /blacklist/:id | JWT | Update blacklist |
| DELETE | /blacklist/:id | JWT | Hapus blacklist |
| GET | /stats/dashboard | JWT | Statistik dashboard |
| GET | /stats/usage | JWT | Statistik penggunaan |
| GET | /stats/transactions | JWT | Riwayat transaksi |
| GET | /stats/daily | JWT | Statistik harian |
| GET | /stats/endpoints | JWT | Statistik per endpoint |
| POST | /v1/score | API Key | Fraud scoring |

### 9.2 Contoh Request & Response

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Developer",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Developer",
      "email": "john@example.com"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer"
  }
}
```

#### Fraud Scoring
```http
POST /v1/score
Content-Type: application/json
X-API-Key: fs_live_a1b2c3d4e5f6g7h8i9j0...

{
  "external_txn_id": "TXN-2026-001",
  "account_id": "ACC-12345",
  "amount": 500000,
  "currency": "IDR",
  "available_balance": 1000000,
  "merchant_id": "MERCHANT-001",
  "ip": "103.123.45.67",
  "country": "ID"
}
```

---

## 10. Keamanan dan Best Practices

### 10.1 Password Security

```
User Password: "MyPassword123"
        ↓
bcrypt.hash(password, 10)  ← 10 = salt rounds
        ↓
Stored: "$2b$10$N9qo8uLOickgx2ZMRZoMy..."
```

**Mengapa bcrypt?**
- One-way hashing (tidak bisa di-decrypt)
- Salt otomatis (mencegah rainbow table attack)
- Slow by design (mencegah brute force)

### 10.2 Security Headers (Helmet)

```javascript
app.use(helmet());
// Menambahkan:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
// - Content-Security-Policy
// - dan lainnya
```

### 10.3 CORS (Cross-Origin Resource Sharing)

```javascript
app.use(cors({
  origin: 'http://localhost:3000',  // Hanya izinkan dari portal
  credentials: true
}));
```

### 10.4 Rate Limiting

```javascript
// Batasi 100 request per menit per IP
rateLimit({
  windowMs: 60 * 1000,
  max: 100
})
```

### 10.5 Input Validation dengan Joi

```javascript
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const { error } = schema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details });
}
```

---

## 11. Pertanyaan yang Mungkin Ditanyakan Dosen

### Q1: "Apa perbedaan JWT dan API Key di sistem ini?"

**Jawaban:**
JWT (JSON Web Token) digunakan untuk autentikasi user di portal dashboard, memiliki waktu expire (1 jam), dan berisi informasi user yang ter-encode. API Key digunakan khusus untuk endpoint fraud scoring, tidak expire secara otomatis, dan lebih cocok untuk integrasi machine-to-machine.

---

### Q2: "Bagaimana cara sistem mendeteksi fraud?"

**Jawaban:**
Sistem menggunakan pendekatan rule-based dengan 4 aturan utama:
1. **Blacklist Check**: Cek apakah account/IP/merchant ada di daftar hitam
2. **Balance Check**: Pastikan saldo mencukupi
3. **Velocity Check**: Deteksi transaksi yang terlalu cepat (>6 dalam 5 menit)
4. **Daily Limit**: Cek apakah melebihi limit harian

Setiap aturan berkontribusi pada risk score (0-100), dan decision diambil berdasarkan threshold.

---

### Q3: "Mengapa password disimpan sebagai hash, bukan plaintext?"

**Jawaban:**
Untuk keamanan. Jika database bocor, password asli tidak bisa diketahui karena bcrypt hash bersifat one-way (tidak bisa di-decrypt). Selain itu, bcrypt menggunakan salt unik untuk setiap password sehingga dua user dengan password sama memiliki hash berbeda.

---

### Q4: "Apa itu middleware dan fungsinya?"

**Jawaban:**
Middleware adalah fungsi yang dieksekusi sebelum request mencapai handler utama. Di FraudShield, middleware digunakan untuk:
- `authJwt.js`: Validasi JWT token
- `apiKeyAuth.js`: Validasi API Key
- `errorHandler.js`: Menangani error secara konsisten
- `sanitizer.js`: Membersihkan input dari XSS

---

### Q5: "Jelaskan arsitektur full-stack aplikasi ini!"

**Jawaban:**
Aplikasi ini menggunakan arsitektur 3-tier:
1. **Presentation Layer**: React SPA (Single Page Application) dengan Vite
2. **Business Logic Layer**: Node.js + Express REST API
3. **Data Layer**: MySQL database

Frontend berkomunikasi dengan backend melalui HTTP REST API dengan format JSON. Autentikasi menggunakan JWT untuk portal dan API Key untuk scoring.

---

### Q6: "Apa keuntungan menggunakan REST API?"

**Jawaban:**
- **Stateless**: Setiap request independen, mudah di-scale
- **Uniform Interface**: Menggunakan HTTP methods standar (GET, POST, PUT, DELETE)
- **Platform Independent**: Bisa diakses dari web, mobile, atau sistem lain
- **Cacheable**: Response bisa di-cache untuk performa
- **Scalable**: Mudah dikembangkan dan dipelihara

---

### Q7: "Bagaimana flow registrasi dan login bekerja?"

**Jawaban:**
**Registrasi:**
1. User submit form dengan name, email, password
2. Server validasi input
3. Server hash password dengan bcrypt
4. Server simpan user ke database
5. Server generate JWT token
6. Token dikembalikan ke client

**Login:**
1. User submit email dan password
2. Server cari user berdasarkan email
3. Server bandingkan password dengan bcrypt.compare()
4. Jika cocok, generate JWT token
5. Token dikembalikan dan disimpan di localStorage

---

### Q8: "Apa itu Provider API dan siapa yang menggunakannya?"

**Jawaban:**
Provider API adalah pihak yang menyediakan layanan API untuk digunakan oleh pihak lain (consumer). Dalam konteks FraudShield:
- **Provider**: FraudShield menyediakan API fraud detection
- **Consumer**: E-commerce, payment gateway, fintech yang mengintegrasikan API untuk menilai transaksi mereka

---

## 12. Glosarium Istilah

| Istilah | Definisi |
|---------|----------|
| **API** | Application Programming Interface - antarmuka untuk komunikasi antar software |
| **REST** | Representational State Transfer - arsitektur untuk web service |
| **JWT** | JSON Web Token - token untuk autentikasi |
| **Bcrypt** | Algoritma hashing untuk password |
| **CORS** | Cross-Origin Resource Sharing - mekanisme keamanan browser |
| **Middleware** | Fungsi perantara dalam request pipeline |
| **ORM** | Object-Relational Mapping - abstraksi database |
| **SPA** | Single Page Application - aplikasi web satu halaman |
| **Risk Score** | Skor numerik (0-100) yang menunjukkan tingkat risiko |
| **Velocity** | Kecepatan/frekuensi transaksi dalam periode waktu |
| **Blacklist** | Daftar entitas yang diblokir |
| **Hash** | Hasil enkripsi satu arah dari data |
| **Salt** | Data acak yang ditambahkan sebelum hashing |
| **Token** | String unik untuk autentikasi |
| **Endpoint** | URL spesifik yang menerima request API |
| **Payload** | Data yang dikirim dalam request body |
| **Response** | Data yang dikembalikan oleh server |

---

## Catatan Penutup

Dokumen ini mencakup semua aspek teknis platform FraudShield. Untuk pemahaman yang lebih mendalam, disarankan untuk:

1. **Praktik langsung** dengan menjalankan server dan mencoba setiap endpoint
2. **Baca source code** terutama bagian scoring.service.js untuk memahami algoritma
3. **Gunakan Postman** untuk testing API secara interaktif
4. **Pahami flow** dari frontend ke backend ke database

---

*Dokumen ini dibuat untuk keperluan pembelajaran mahasiswa IT.*
*FraudShield Provider API - 2026*
