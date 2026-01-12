# FraudShield Provider

Monorepo yang berisi layanan platform deteksi penipuan FraudShield.

## Gambaran Umum

FraudShield adalah platform API deteksi penipuan yang menyediakan penilaian risiko transaksi secara real-time untuk developer dan bisnis.

## Struktur Repository

```
fraudshield-provider/
├── services/
│   ├── api/              # Layanan API (Node.js + Express + MySQL)
│   └── portal/           # Portal Developer (Direncanakan)
└── docs/
    └── ARCHITECTURE.md   # Dokumentasi arsitektur sistem
```

## Layanan

### Layanan API (`services/api`)

Layanan backend inti yang menyediakan:
- Autentikasi developer (JWT)
- Manajemen API key
- Manajemen blacklist (CRUD)
- Penilaian penipuan real-time

**Status**: Sudah Diimplementasi

Lihat [services/api/README.md](services/api/README.md) untuk dokumentasi lengkap.

### Layanan Portal (`services/portal`)

Aplikasi web untuk developer dalam mengelola pengaturan deteksi penipuan.

**Status**: Direncanakan

Lihat [services/portal/README.md](services/portal/README.md) untuk fitur yang direncanakan.

## Memulai

### Mulai Cepat

```bash
# Masuk ke direktori layanan API
cd services/api

# Install dependensi
npm install

# Konfigurasi environment
cp .env.example .env
# Edit .env dengan kredensial database Anda

# Jalankan migrasi database
mysql -u root -p < db/schema.sql

# Jalankan server development
npm run dev
```

API akan tersedia di `http://localhost:4000`

Dokumentasi API: `http://localhost:4000/docs`

## Teknologi yang Digunakan

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **Autentikasi**: JWT (jsonwebtoken)
- **Hashing Password**: bcrypt
- **Validasi**: Joi
- **Dokumentasi**: Swagger/OpenAPI 3.0
- **Keamanan**: Helmet, CORS, Rate Limiting
