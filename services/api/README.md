# Layanan API FraudShield

Layanan API deteksi penipuan siap produksi yang dibangun dengan Node.js, Express, dan MySQL.

## Fitur

- 🔐 **Autentikasi JWT** - Manajemen akun developer yang aman
- 🔑 **Manajemen API Key** - Membuat, melihat, dan mencabut API key
- 🚫 **Manajemen Blacklist** - Operasi CRUD untuk aturan pencegahan penipuan
- 📊 **Penilaian Real-time** - Penilaian risiko transaksi secara instan
- 📚 **Dokumentasi Swagger** - Dokumentasi API interaktif
- 🛡️ **Keamanan** - Helmet, CORS, rate limiting, dan hashing password yang aman

## Mulai Cepat

### Prasyarat

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm atau yarn

### Instalasi

1. **Clone dan masuk ke direktori layanan API**

```bash
cd services/api
```

2. **Install dependensi**

```bash
npm install
```

3. **Konfigurasi variabel environment**

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi Anda:

```env
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_anda
DB_NAME=fraudshield
JWT_SECRET=kunci-jwt-rahasia-anda-ganti-di-produksi
JWT_EXPIRES_IN=1h
```

4. **Buat database dan jalankan migrasi**

```bash
mysql -u root -p < db/schema.sql
```

Atau hubungkan ke MySQL dan jalankan:

```sql
SOURCE db/schema.sql;
```

5. **Jalankan server**

Mode development (dengan hot reload):
```bash
npm run dev
```

Mode produksi:
```bash
npm start
```

Server akan berjalan di `http://localhost:4000`

### Dokumentasi API

Buka `http://localhost:4000/docs` di browser Anda untuk mengakses Swagger UI interaktif.

## Endpoint API

### Autentikasi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Mendaftarkan akun developer baru |
| POST | `/auth/login` | Login dan mendapatkan token JWT |
| GET | `/me` | Mendapatkan profil pengguna saat ini (JWT diperlukan) |

### API Keys (JWT Diperlukan)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/keys` | Membuat API key baru |
| GET | `/keys` | Melihat semua API key |
| DELETE | `/keys/:id` | Mencabut API key |

### Blacklist CRUD (JWT Diperlukan)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/blacklist` | Membuat entri blacklist |
| GET | `/blacklist` | Melihat entri blacklist (dengan filter) |
| GET | `/blacklist/:id` | Mendapatkan entri spesifik |
| PUT | `/blacklist/:id` | Memperbarui entri |
| DELETE | `/blacklist/:id` | Menghapus entri |

### Penilaian Penipuan (API Key Diperlukan)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/v1/score` | Menilai transaksi untuk risiko penipuan |

### Admin Panel (JWT + Role Admin Diperlukan)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/admin/stats` | Statistik global sistem |
| GET | `/admin/users` | Daftar semua users |
| POST | `/admin/users` | Membuat user baru |
| PUT | `/admin/users/:id` | Memperbarui user |
| DELETE | `/admin/users/:id` | Menghapus user beserta datanya |
| GET | `/admin/keys` | Daftar semua API keys |
| PATCH | `/admin/keys/:id/toggle` | Toggle status API key |
| DELETE | `/admin/keys/:id` | Menghapus API key |
| GET | `/admin/blacklist` | Daftar semua blacklist |
| PATCH | `/admin/blacklist/:id/toggle` | Toggle status entry |
| DELETE | `/admin/blacklist/:id` | Menghapus entry |
| GET | `/admin/transactions` | Daftar semua transaksi |
| GET | `/admin/audit-logs` | Audit logs aktivitas admin |

## User Roles

| Role | Deskripsi |
|------|-----------|
| `user` | Pengguna biasa, akses dashboard dan data miliknya sendiri |
| `admin` | Administrator, akses penuh ke semua data dan admin panel |

**Default Admin Credentials (setelah menjalankan seed.sql):**
- Email: `admin@fraudshield.id`
- Password: `Admin@123456`

## Aturan Penilaian

Mesin penilaian penipuan menerapkan aturan-aturan berikut:

1. **Aturan Blacklist** - TOLAK KERAS jika account_id, merchant_id, IP, atau country ada di blacklist
2. **Dana Tidak Cukup** - TOLAK KERAS jika amount > available_balance
3. **Aturan Velocity** - Peningkatan risiko berdasarkan frekuensi transaksi (jendela 5 menit)
   - \>3 transaksi: +40 risiko
   - \>6 transaksi: +80 risiko
4. **Aturan Limit Harian** - Peningkatan risiko berdasarkan volume transaksi harian
   - \>1.000.000: +30 risiko
   - \>2.000.000: +70 risiko

### Ambang Keputusan

- **APPROVE (SETUJU)**: risk_score < 50
- **REVIEW (TINJAU)**: risk_score 50-79
- **DECLINE (TOLAK)**: risk_score >= 80 atau aturan TOLAK KERAS terpicu

## Contoh cURL

### 1. Mendaftarkan akun developer baru

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Developer",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Respons:**
```json
{
  "user": {
    "id": 1,
    "name": "John Developer",
    "email": "john@example.com",
    "created_at": "2025-01-11T10:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}
```

### 2. Login untuk mendapatkan access token

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### 3. Membuat API key (memerlukan JWT)

```bash
curl -X POST http://localhost:4000/keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_JWT_ANDA" \
  -d '{
    "name": "Production Key"
  }'
```

**Respons:**
```json
{
  "id": 1,
  "name": "Production Key",
  "prefix": "fs_live_abc1",
  "status": "ACTIVE",
  "created_at": "2025-01-11T10:05:00.000Z",
  "api_key": "fs_live_abc123def456..."
}
```

⚠️ **Penting**: Simpan nilai `api_key`! Ini hanya ditampilkan sekali saat pembuatan.

### 4. Membuat entri blacklist (memerlukan JWT)

```bash
curl -X POST http://localhost:4000/blacklist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_JWT_ANDA" \
  -d '{
    "type": "ACCOUNT_ID",
    "value": "fraudster_123",
    "reason": "Akun penipu yang diketahui"
  }'
```

**Respons:**
```json
{
  "id": 1,
  "type": "ACCOUNT_ID",
  "value": "fraudster_123",
  "reason": "Akun penipu yang diketahui",
  "active": true,
  "created_at": "2025-01-11T10:10:00.000Z",
  "updated_at": "2025-01-11T10:10:00.000Z"
}
```

### 5. Menilai transaksi (memerlukan API Key)

```bash
curl -X POST http://localhost:4000/v1/score \
  -H "Content-Type: application/json" \
  -H "X-API-Key: API_KEY_ANDA" \
  -d '{
    "external_txn_id": "txn_abc123",
    "account_id": "acc_user456",
    "amount": 150.00,
    "currency": "USD",
    "available_balance": 500.00,
    "merchant_id": "merchant_789",
    "ip": "192.168.1.1",
    "country": "US"
  }'
```

**Respons (Disetujui):**
```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "decision": "APPROVE",
  "risk_score": 0,
  "triggered_rules": [],
  "processed_at": "2025-01-11T10:15:00.000Z"
}
```

**Respons (Ditolak - Masuk Blacklist):**
```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440001",
  "decision": "DECLINE",
  "risk_score": 90,
  "triggered_rules": [
    {
      "rule": "BLACKLIST",
      "severity": "CRITICAL",
      "reason": "ACCOUNT_ID \"fraudster_123\" masuk blacklist: Akun penipu yang diketahui"
    }
  ],
  "processed_at": "2025-01-11T10:15:30.000Z"
}
```

### 6. Melihat entri blacklist dengan filter

```bash
# Melihat semua entri
curl http://localhost:4000/blacklist \
  -H "Authorization: Bearer TOKEN_JWT_ANDA"

# Filter berdasarkan tipe
curl "http://localhost:4000/blacklist?type=IP" \
  -H "Authorization: Bearer TOKEN_JWT_ANDA"

# Filter berdasarkan status aktif
curl "http://localhost:4000/blacklist?active=true" \
  -H "Authorization: Bearer TOKEN_JWT_ANDA"
```

### 7. Memperbarui entri blacklist

```bash
curl -X PUT http://localhost:4000/blacklist/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_JWT_ANDA" \
  -d '{
    "reason": "Alasan yang diperbarui",
    "active": false
  }'
```

### 8. Menghapus entri blacklist

```bash
curl -X DELETE http://localhost:4000/blacklist/1 \
  -H "Authorization: Bearer TOKEN_JWT_ANDA"
```

### 9. Mencabut API key

```bash
curl -X DELETE http://localhost:4000/keys/1 \
  -H "Authorization: Bearer TOKEN_JWT_ANDA"
```

## Penanganan Error

Semua error mengikuti format yang konsisten:

```json
{
  "error": {
    "code": "KODE_ERROR",
    "message": "Pesan yang dapat dibaca manusia",
    "details": []
  }
}
```

### Kode Error Umum

| Kode | HTTP Status | Deskripsi |
|------|-------------|-----------|
| `VALIDATION_ERROR` | 400 | Validasi request gagal |
| `UNAUTHORIZED` | 401 | Autentikasi tidak valid atau tidak ada |
| `FORBIDDEN` | 403 | Akses ditolak |
| `NOT_FOUND` | 404 | Resource tidak ditemukan |
| `CONFLICT` | 409 | Resource sudah ada |
| `RATE_LIMIT_EXCEEDED` | 429 | Terlalu banyak request |
| `INTERNAL_ERROR` | 500 | Error server |

## Struktur Proyek

```
services/api/
├── src/
│   ├── app.js              # Setup aplikasi Express
│   ├── server.js           # Entry point server
│   ├── config/
│   │   ├── env.js          # Konfigurasi environment
│   │   └── db.js           # Koneksi database
│   ├── middleware/
│   │   ├── authJwt.js      # Autentikasi JWT
│   │   ├── apiKeyAuth.js   # Autentikasi API key
│   │   └── errorHandler.js # Penanganan error
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── me.routes.js
│   │   ├── keys.routes.js
│   │   ├── blacklist.routes.js
│   │   └── score.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── me.controller.js
│   │   ├── keys.controller.js
│   │   ├── blacklist.controller.js
│   │   └── score.controller.js
│   ├── services/
│   │   ├── key.service.js
│   │   ├── blacklist.service.js
│   │   ├── scoring.service.js
│   │   └── transaction.service.js
│   └── utils/
│       ├── crypto.js       # Utilitas kriptografi
│       ├── validators.js   # Validasi request
│       └── response.js     # Helper respons
├── db/
│   ├── schema.sql          # Skema database
│   └── seed.sql            # Data sampel (opsional)
├── docs/
│   └── openapi.yaml        # Spesifikasi OpenAPI
├── package.json
├── .env.example
└── README.md
```

## Praktik Keamanan Terbaik

- Password di-hash dengan bcrypt (10+ salt rounds)
- API key disimpan sebagai hash SHA256 dengan perbandingan waktu-konstan
- Token JWT kedaluwarsa setelah 1 jam (dapat dikonfigurasi)
- Helmet.js untuk header keamanan HTTP
- Rate limiting pada endpoint publik
- Validasi input pada semua endpoint
- Akses data terbatas per pengguna (pengguna hanya dapat mengakses data mereka sendiri)

## Lisensi

MIT
