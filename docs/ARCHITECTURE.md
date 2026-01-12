# Arsitektur FraudShield

## Gambaran Umum

FraudShield adalah platform API deteksi penipuan yang menyediakan penilaian risiko transaksi secara real-time untuk developer dan bisnis.

## Arsitektur Sistem

### Komponen Tingkat Tinggi

```
┌─────────────────────────────────────────────────────────────────┐
│                     Platform FraudShield                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │  Layanan Portal   │        │   Layanan API     │              │
│  │   (React SPA)     │───────▶│  (Node.js/Express)│              │
│  └──────────────────┘        └────────┬─────────┘               │
│                                       │                          │
│                              ┌────────▼─────────┐               │
│                              │      MySQL        │               │
│                              │    Database       │               │
│                              └──────────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Layanan

### Layanan API (`services/api`)

- REST API untuk penilaian penipuan
- Autentikasi developer (JWT) dengan role-based access control (RBAC)
- Manajemen API key
- Manajemen blacklist
- Pemrosesan transaksi
- **Admin API** untuk pengelolaan sistem oleh administrator

### Layanan Portal (`services/portal`)

- Dashboard developer untuk monitoring dan manajemen
- Antarmuka manajemen API key
- Pemantauan transaksi dan penggunaan
- **Panel Admin** untuk pengelolaan users, API keys, blacklist, dan transaksi

## Sistem Role & Permission

### Role Users

| Role | Deskripsi | Akses |
|------|-----------|-------|
| `user` | Developer/pengguna biasa | Dashboard pribadi, API keys sendiri, blacklist sendiri |
| `admin` | Administrator sistem | Semua akses user + panel admin + CRUD semua data |

### Middleware Authentication

```
Request → authJwt (validasi token) → requireAdmin (cek role) → Controller
```

## Alur Data

### Alur Autentikasi

```
1. User register/login → API mengembalikan JWT token dengan payload {userId, email, name, role}
2. User menyimpan token di localStorage
3. Setiap request ke protected endpoint menyertakan header: Authorization: Bearer <token>
4. Middleware authJwt memvalidasi token dan menambahkan req.user
5. Untuk endpoint admin, middleware requireAdmin mengecek req.user.role === 'admin'
```

### Alur Penilaian (Scoring)

```
1. Request dengan X-API-Key header → Validasi API key
2. Payload transaksi diterima → Scoring service menghitung risk score
3. Cek blacklist → Tambah penalty jika ada match
4. Simpan transaksi ke database
5. Return risk_score, risk_level, dan signals
```

## Skema Database

### Tabel Utama

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data pengguna dengan role (user/admin) dan status (active/suspended) |
| `api_keys` | API keys milik users untuk akses endpoint scoring |
| `blacklist_entries` | Daftar entity yang diblokir (IP, account, device, dll) |
| `transactions` | Log transaksi yang sudah di-scoring |
| `api_usage_logs` | Log penggunaan API per user/key |
| `admin_audit_logs` | Audit trail aktivitas admin |
| `password_resets` | Token reset password |

## Pertimbangan Keamanan

- **Password Hashing**: bcrypt dengan cost factor 10
- **JWT Tokens**: Expiry 24 jam, payload minimal
- **Rate Limiting**: 100 request/15 menit untuk endpoint publik
- **XSS Protection**: Sanitasi input dan deteksi pattern berbahaya
- **CORS**: Konfigurasi origin yang diizinkan
- **Helmet**: Security headers standar
- **Audit Logging**: Semua aksi admin dicatat dengan IP dan user agent

## Arsitektur Deployment

```
Production:
- API: Node.js dengan PM2 atau container
- Portal: Static hosting (Vercel, Netlify, S3+CloudFront)
- Database: MySQL managed (RDS, Cloud SQL, PlanetScale)
```

## Monitoring & Observabilitas

- **Request Logging**: Semua request dicatat dengan timestamp, user, endpoint
- **Admin Audit Logs**: CRUD operations oleh admin dicatat lengkap
- **API Usage Tracking**: Penggunaan per user/key untuk billing dan analytics
