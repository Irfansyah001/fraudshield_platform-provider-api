# 🧪 Panduan Testing FraudShield
## Testing Website dan Postman - Langkah Detail Lengkap

---

## Daftar Isi

1. [Persiapan Environment](#1-persiapan-environment)
2. [Testing dengan Browser (Portal)](#2-testing-dengan-browser-portal)
3. [Testing dengan Postman - Setup](#3-testing-dengan-postman---setup)
4. [Testing Endpoint Authentication](#4-testing-endpoint-authentication)
5. [Testing Endpoint User Profile](#5-testing-endpoint-user-profile)
6. [Testing Endpoint API Keys](#6-testing-endpoint-api-keys)
7. [Testing Endpoint Blacklist](#7-testing-endpoint-blacklist)
8. [Testing Endpoint Statistics](#8-testing-endpoint-statistics)
9. [Testing Endpoint Fraud Scoring](#9-testing-endpoint-fraud-scoring)
10. [Testing Portal Website](#10-testing-portal-website)
11. [Automated Testing dengan Script](#11-automated-testing-dengan-script)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Persiapan Environment

### 1.1 Prasyarat

Pastikan sudah terinstall:
- ✅ Node.js versi 18 atau lebih baru
- ✅ MySQL versi 8.0
- ✅ Postman (download di https://www.postman.com/downloads/)
- ✅ Browser modern (Chrome/Firefox/Edge)

### 1.2 Setup Database

```bash
# Masuk ke MySQL
mysql -u root -p

# Jalankan schema
source C:/Users/syahi/Downloads/fraudshield-provider/services/api/db/schema.sql
```

### 1.3 Setup API Server

```powershell
# Masuk ke folder API
cd C:\Users\syahi\Downloads\fraudshield-provider\services\api

# Install dependencies
npm install

# Pastikan file .env sudah dikonfigurasi
# Minimal isi:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=password_anda
# DB_NAME=fraudshield
# JWT_SECRET=secret_minimal_32_karakter_random
# API_KEY_HASH_SECRET=secret_lain_32_karakter_random

# Jalankan server
npm run dev
```

**Verifikasi:** Buka http://localhost:4000/health di browser, harus muncul:
```json
{"status":"ok"}
```

### 1.4 Setup Portal Server

```powershell
# Masuk ke folder Portal
cd C:\Users\syahi\Downloads\fraudshield-provider\services\portal

# Install dependencies
npm install

# Jalankan server
npm run dev
```

**Verifikasi:** Buka http://localhost:3000 di browser, harus muncul halaman home FraudShield.

---

## 2. Testing dengan Browser (Portal)

### 2.1 Test Halaman Publik

| No | Test Case | Langkah | Expected Result |
|----|-----------|---------|-----------------|
| 1 | Home Page | Buka http://localhost:3000 | Tampil halaman utama dengan hero section |
| 2 | Pricing Page | Klik menu "Harga" atau buka /pricing | Tampil halaman pricing |
| 3 | Docs Page | Klik menu "Dokumentasi" atau buka /docs | Tampil halaman dokumentasi |
| 4 | Getting Started | Buka /getting-started | Tampil panduan memulai |

### 2.2 Test Flow Registrasi

| No | Langkah | Expected Result |
|----|---------|-----------------|
| 1 | Buka http://localhost:3000/register | Form registrasi tampil |
| 2 | Isi Nama: "Test User" | Field terisi |
| 3 | Isi Email: "test@example.com" | Field terisi |
| 4 | Isi Password: "Password123!" | Field terisi (masked) |
| 5 | Klik tombol "Daftar" | Redirect ke /dashboard |
| 6 | Cek navbar | Nama user tampil |

### 2.3 Test Flow Login

| No | Langkah | Expected Result |
|----|---------|-----------------|
| 1 | Logout terlebih dahulu (jika sudah login) | Redirect ke home |
| 2 | Buka http://localhost:3000/login | Form login tampil |
| 3 | Isi Email: "test@example.com" | Field terisi |
| 4 | Isi Password: "Password123!" | Field terisi |
| 5 | Klik tombol "Masuk" | Redirect ke /dashboard |

### 2.4 Test Dashboard

**Catatan UI terbaru (Portal):**
- Menu umum (Ringkasan, API Keys, Blacklist, Penggunaan, Pengaturan) berada di **top navbar** pada desktop.
- Pada mobile, menu umum tampil sebagai **bar menu horizontal** (scroll) tepat di bawah header.
- Menu **Admin Panel** (Admin Dashboard s/d Audit Logs) hanya muncul untuk role **admin** dan berada di **sidebar**.

| No | Test Case | Langkah | Expected Result |
|----|-----------|---------|-----------------|
| 1 | Overview | Klik menu "Ringkasan" di top navbar (desktop) / bar menu horizontal (mobile) | Tampil statistik umum |
| 2 | API Keys | Klik menu "API Keys" di top navbar (desktop) / bar menu horizontal (mobile) | Tampil daftar API keys |
| 3 | Blacklist | Klik menu "Blacklist" di top navbar (desktop) / bar menu horizontal (mobile) | Tampil daftar blacklist |
| 4 | Usage | Klik menu "Penggunaan" di top navbar (desktop) / bar menu horizontal (mobile) | Tampil statistik usage |
| 5 | Settings | Klik menu "Pengaturan" di top navbar (desktop) / bar menu horizontal (mobile) | Tampil form pengaturan |
| 6 | Layout | Scroll halaman dan resize window (desktop ↔ mobile) | Tidak ada elemen bertumpuk; header tetap sticky dan konten rapi |

### 2.5 Test Admin Panel (Khusus Admin)

> Jalankan hanya bila akun yang login memiliki role **admin**.

| No | Test Case | Langkah | Expected Result |
|----|-----------|---------|-----------------|
| 1 | Sidebar Admin Muncul | Login sebagai admin lalu buka `/admin` | Sidebar admin tampil di desktop; pada mobile dapat dibuka via tombol menu |
| 2 | Admin Dashboard | Klik "Admin Dashboard" di sidebar admin | Halaman admin dashboard tampil |
| 3 | Kelola Users | Klik "Kelola Users" di sidebar admin | Halaman kelola user tampil |
| 4 | Semua API Keys | Klik "Semua API Keys" di sidebar admin | Halaman daftar API keys (admin) tampil |
| 5 | Semua Blacklist | Klik "Semua Blacklist" di sidebar admin | Halaman daftar blacklist (admin) tampil |
| 6 | Transaksi | Klik "Transaksi" di sidebar admin | Halaman transaksi tampil |
| 7 | Audit Logs | Klik "Audit Logs" di sidebar admin | Halaman audit logs tampil |
| 8 | Non-Overlap Sidebar | Scroll area menu di sidebar admin | Bagian user info & tombol keluar tetap rapi, tidak menimpa menu |

---

## 3. Testing dengan Postman - Setup

### 3.1 Buat Collection Baru

1. Buka Postman
2. Klik **"New"** → **"Collection"**
3. Beri nama: **"FraudShield API Testing"**
4. Klik **"Create"**

### 3.2 Setup Environment Variables

1. Klik ikon **gear** (Settings) di pojok kanan atas
2. Klik **"Add"** untuk membuat environment baru
3. Beri nama: **"FraudShield Local"**
4. Tambahkan variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| base_url | http://localhost:4000 | http://localhost:4000 |
| portal_url | http://localhost:3000 | http://localhost:3000 |
| access_token | (kosong) | (kosong) |
| api_key | (kosong) | (kosong) |
| user_email | test_{{$randomInt}}@example.com | (kosong) |
| user_password | TestPass123! | TestPass123! |

5. Klik **"Save"**
6. Pilih environment **"FraudShield Local"** di dropdown

### 3.3 Struktur Folder di Collection

Buat folder-folder berikut di collection:
```
FraudShield API Testing/
├── 1. Health Check/
├── 2. Authentication/
├── 3. User Profile/
├── 4. API Keys/
├── 5. Blacklist/
├── 6. Statistics/
├── 7. Fraud Scoring/
└── 8. Portal Proxy/
```

---

## 4. Testing Endpoint Authentication

### 4.1 Health Check

**Request:**
```
GET {{base_url}}/health
```

**Setup di Postman:**
1. Klik kanan folder "1. Health Check" → Add Request
2. Name: "Health Check"
3. Method: GET
4. URL: `{{base_url}}/health`

**Expected Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

### 4.2 Register New User

**Request:**
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "John Developer",
  "email": "{{user_email}}",
  "password": "{{user_password}}"
}
```

**Setup di Postman:**
1. Folder "2. Authentication" → Add Request
2. Name: "Register"
3. Method: POST
4. URL: `{{base_url}}/auth/register`
5. Tab Body → raw → JSON
6. Isi body:
```json
{
  "name": "John Developer",
  "email": "{{$randomEmail}}",
  "password": "{{user_password}}"
}
```

7. Tab "Tests" → Tambahkan script:
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.success && response.data.access_token) {
        pm.environment.set("access_token", response.data.access_token);
        pm.environment.set("user_email", response.data.user.email);
    }
}

pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has access_token", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.have.property("access_token");
});
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Developer",
      "email": "john@example.com"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer"
  }
}
```

---

### 4.3 Login

**Request:**
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "{{user_email}}",
  "password": "{{user_password}}"
}
```

**Setup di Postman:**
1. Add Request → Name: "Login"
2. Method: POST
3. URL: `{{base_url}}/auth/login`
4. Body:
```json
{
  "email": "{{user_email}}",
  "password": "{{user_password}}"
}
```

5. Tests:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.access_token) {
        pm.environment.set("access_token", response.data.access_token);
    }
}

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has access_token", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.have.property("access_token");
});
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Developer",
      "email": "john@example.com"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer"
  }
}
```

---

### 4.4 Login dengan Kredensial Salah

**Request:**
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "{{user_email}}",
  "password": "wrongpassword"
}
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email atau password salah"
  }
}
```

---

### 4.5 Forgot Password

**Request:**
```
POST {{base_url}}/auth/forgot-password
Content-Type: application/json

{
  "email": "{{user_email}}"
}
```

**Tests:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.reset_token) {
        pm.environment.set("reset_token", response.data.reset_token);
    }
}

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Jika email terdaftar, token reset telah dibuat",
    "reset_token": "abc123..." 
  }
}
```

---

### 4.6 Reset Password

**Request:**
```
POST {{base_url}}/auth/reset-password
Content-Type: application/json

{
  "token": "{{reset_token}}",
  "new_password": "NewPassword456!"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Password berhasil direset"
  }
}
```

---

## 5. Testing Endpoint User Profile

### 5.1 Get Current User (Me)

**Request:**
```
GET {{base_url}}/me
Authorization: Bearer {{access_token}}
```

**Setup di Postman:**
1. Folder "3. User Profile" → Add Request
2. Name: "Get Profile"
3. Method: GET
4. URL: `{{base_url}}/me`
5. Tab Authorization:
   - Type: Bearer Token
   - Token: `{{access_token}}`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Developer",
    "email": "john@example.com",
    "created_at": "2026-01-12T10:00:00.000Z"
  }
}
```

---

### 5.2 Update Profile

**Request:**
```
PUT {{base_url}}/me
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "John Developer Updated"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Developer Updated",
    "email": "john@example.com"
  }
}
```

---

### 5.3 Change Password

**Request:**
```
PUT {{base_url}}/me/password
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "current_password": "{{user_password}}",
  "new_password": "NewSecurePass789!"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Password berhasil diubah"
  }
}
```

---

### 5.4 Get Profile tanpa Token (Negative Test)

**Request:**
```
GET {{base_url}}/me
(tanpa Authorization header)
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token tidak ditemukan"
  }
}
```

---

## 6. Testing Endpoint API Keys

### 6.1 List API Keys

**Request:**
```
GET {{base_url}}/keys
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": []
}
```

---

### 6.2 Create New API Key

**Request:**
```
POST {{base_url}}/keys
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "Production Key"
}
```

**Tests:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.data && response.data.api_key) {
        pm.environment.set("api_key", response.data.api_key);
        pm.environment.set("api_key_id", response.data.id);
    }
}

pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has api_key", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.have.property("api_key");
});
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Production Key",
    "prefix": "fs_live_a1b2",
    "api_key": "fs_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "status": "ACTIVE",
    "created_at": "2026-01-12T10:00:00.000Z"
  }
}
```

> ⚠️ **PENTING:** Salin dan simpan `api_key` - ini hanya ditampilkan SEKALI!

---

### 6.3 List API Keys (After Create)

**Request:**
```
GET {{base_url}}/keys
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Production Key",
      "prefix": "fs_live_a1b2",
      "status": "ACTIVE",
      "last_used_at": null,
      "created_at": "2026-01-12T10:00:00.000Z"
    }
  ]
}
```

---

### 6.4 Revoke API Key

**Request:**
```
DELETE {{base_url}}/keys/{{api_key_id}}
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "API key berhasil direvoke"
  }
}
```

---

## 7. Testing Endpoint Blacklist

### 7.1 List Blacklist Entries

**Request:**
```
GET {{base_url}}/blacklist
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": []
}
```

---

### 7.2 Create Blacklist Entry

**Request:**
```
POST {{base_url}}/blacklist
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "type": "ACCOUNT_ID",
  "value": "fraudster_12345",
  "reason": "Confirmed fraud case"
}
```

**Tests:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.data && response.data.id) {
        pm.environment.set("blacklist_id", response.data.id);
    }
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "type": "ACCOUNT_ID",
    "value": "fraudster_12345",
    "reason": "Confirmed fraud case",
    "active": true,
    "created_at": "2026-01-12T10:00:00.000Z"
  }
}
```

---

### 7.3 Create Blacklist - Different Types

**Test berbagai tipe blacklist:**

| Type | Value Example | Description |
|------|---------------|-------------|
| ACCOUNT_ID | fraudster_12345 | Block account tertentu |
| MERCHANT_ID | merchant_xyz | Block merchant tertentu |
| IP | 192.168.1.100 | Block IP address |
| COUNTRY | XX | Block country code |

---

### 7.4 Get Blacklist Entry by ID

**Request:**
```
GET {{base_url}}/blacklist/{{blacklist_id}}
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "type": "ACCOUNT_ID",
    "value": "fraudster_12345",
    "reason": "Confirmed fraud case",
    "active": true,
    "created_at": "2026-01-12T10:00:00.000Z",
    "updated_at": "2026-01-12T10:00:00.000Z"
  }
}
```

---

### 7.5 Update Blacklist Entry

**Request:**
```
PUT {{base_url}}/blacklist/{{blacklist_id}}
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "reason": "Updated: Multiple fraud attempts",
  "active": true
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "type": "ACCOUNT_ID",
    "value": "fraudster_12345",
    "reason": "Updated: Multiple fraud attempts",
    "active": true
  }
}
```

---

### 7.6 List Blacklist with Filter

**Request:**
```
GET {{base_url}}/blacklist?type=ACCOUNT_ID
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "ACCOUNT_ID",
      "value": "fraudster_12345",
      "reason": "Updated: Multiple fraud attempts",
      "active": true
    }
  ]
}
```

---

### 7.7 Delete Blacklist Entry

**Request:**
```
DELETE {{base_url}}/blacklist/{{blacklist_id}}
Authorization: Bearer {{access_token}}
```

**Expected Response (204 No Content):**
```
(Tidak ada response body - ini adalah behavior yang benar untuk operasi DELETE)
```

> ✅ **Catatan:** HTTP 204 No Content adalah response standar untuk DELETE yang berhasil.
> Artinya: "Operasi berhasil, tidak ada konten yang perlu dikembalikan."

---

## 8. Testing Endpoint Statistics

> ⚠️ **PENTING: Stats akan kosong jika belum ada transaksi!**
>
> Data statistik diambil dari tabel `transactions` dan `api_usage_logs` yang terisi saat:
> 1. Anda melakukan request ke `POST /v1/score` (fraud scoring)
> 2. Request API lainnya yang di-log
>
> **Urutan testing yang benar:**
> 1. Buat API Key terlebih dahulu (Section 6)
> 2. Lakukan beberapa request scoring (Section 9)
> 3. Baru kemudian cek stats (Section 8)
>
> Jika stats masih kosong, itu **bukan error** - hanya berarti belum ada data transaksi.

---

### 8.1 Get Dashboard Stats

**Request:**
```
GET {{base_url}}/stats/dashboard
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK) - Jika sudah ada transaksi:**
```json
{
  "success": true,
  "data": {
    "total_requests": 150,
    "approved": 120,
    "reviewed": 20,
    "declined": 10,
    "avg_risk_score": 25.5
  }
}
```

**Expected Response (200 OK) - Jika belum ada transaksi:**
```json
{
  "success": true,
  "data": {
    "total_requests": 0,
    "total_requests_change": "0%",
    "fraud_detected": 0,
    "fraud_detected_change": "0%",
    "safe_requests": 0,
    "avg_response_time": 0
  }
}
```

---

### 8.2 Get Usage Stats

**Request:**
```
GET {{base_url}}/stats/usage
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK) - Jika sudah ada transaksi:**
```json
{
  "success": true,
  "data": {
    "total_requests": 150,
    "period": "current_month"
  }
}
```

**Expected Response (200 OK) - Jika belum ada transaksi:**
```json
{
  "success": true,
  "data": {
    "total": 0,
    "limit": 50000,
    "remaining": 50000,
    "fraud_detected": 0,
    "avg_response_time": 0,
    "success_rate": 100
  }
}
```

---

### 8.3 Get Daily Stats

**Request:**
```
GET {{base_url}}/stats/daily
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK) - Jika sudah ada transaksi:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-12",
      "total": 50,
      "approved": 40,
      "reviewed": 7,
      "declined": 3
    },
    {
      "date": "2026-01-11",
      "total": 45,
      "approved": 38,
      "reviewed": 5,
      "declined": 2
    }
  ]
}
```

**Expected Response (200 OK) - Jika belum ada transaksi:**
```json
{
  "success": true,
  "data": {
    "usage": []
  }
}
```

---

### 8.4 Get Endpoint Stats

**Request:**
```
GET {{base_url}}/stats/endpoints
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK) - Jika sudah ada transaksi:**
```json
{
  "success": true,
  "data": [
    {
      "endpoint": "/v1/score",
      "method": "POST",
      "count": 100,
      "avg_response_time_ms": 45
    },
    {
      "endpoint": "/keys",
      "method": "GET",
      "count": 25,
      "avg_response_time_ms": 12
    }
  ]
}
```

**Expected Response (200 OK) - Jika belum ada transaksi:**
```json
{
  "success": true,
  "data": {
    "endpoints": []
  }
}
```

---

### 8.5 Get Recent Transactions

**Request:**
```
GET {{base_url}}/stats/transactions
Authorization: Bearer {{access_token}}
```

**Expected Response (200 OK) - Jika sudah ada transaksi:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "external_txn_id": "TXN-001",
      "account_id": "ACC-123",
      "amount": 500000,
      "risk_score": 25,
      "decision": "APPROVE",
      "created_at": "2026-01-12T10:00:00.000Z"
    }
  ]
}
```

**Expected Response (200 OK) - Jika belum ada transaksi:**
```json
{
  "success": true,
  "data": {
    "transactions": []
  }
}
```

---

## 9. Testing Endpoint Fraud Scoring

### 9.1 Persiapan

Sebelum testing scoring, pastikan:
1. ✅ Sudah memiliki API Key (buat baru jika sudah di-revoke)
2. ✅ API Key tersimpan di environment variable `api_key`

---

### 9.2 Basic Score Request (APPROVE)

**Request:**
```
POST {{base_url}}/v1/score
Content-Type: application/json
X-API-Key: {{api_key}}

{
  "external_txn_id": "TXN-2026-001",
  "account_id": "ACC-GOOD-12345",
  "amount": 50000,
  "currency": "IDR",
  "available_balance": 1000000,
  "merchant_id": "MERCHANT-001",
  "ip": "103.123.45.67",
  "country": "ID"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "decision": "APPROVE",
    "risk_score": 0,
    "triggered_rules": [],
    "processed_at": "2026-01-12T10:00:00.000Z"
  }
}
```

---

### 9.3 Score Request - Insufficient Balance (DECLINE)

**Request:**
```
POST {{base_url}}/v1/score
Content-Type: application/json
X-API-Key: {{api_key}}

{
  "external_txn_id": "TXN-2026-002",
  "account_id": "ACC-LOW-BALANCE",
  "amount": 1000000,
  "currency": "IDR",
  "available_balance": 500000,
  "merchant_id": "MERCHANT-001",
  "ip": "103.123.45.67",
  "country": "ID"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "request_id": "...",
    "decision": "DECLINE",
    "risk_score": 90,
    "triggered_rules": [
      {
        "rule": "INSUFFICIENT_FUNDS",
        "severity": "CRITICAL",
        "reason": "Transaction amount (1000000) exceeds available balance (500000)"
      }
    ],
    "processed_at": "..."
  }
}
```

---

### 9.4 Score Request - Blacklisted Account (DECLINE)

**Persiapan:** Buat blacklist entry terlebih dahulu
```
POST {{base_url}}/blacklist
Authorization: Bearer {{access_token}}

{
  "type": "ACCOUNT_ID",
  "value": "ACC-FRAUD-999",
  "reason": "Known fraudster"
}
```

**Request:**
```
POST {{base_url}}/v1/score
Content-Type: application/json
X-API-Key: {{api_key}}

{
  "external_txn_id": "TXN-2026-003",
  "account_id": "ACC-FRAUD-999",
  "amount": 50000,
  "currency": "IDR",
  "available_balance": 1000000,
  "merchant_id": "MERCHANT-001",
  "ip": "103.123.45.67",
  "country": "ID"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "request_id": "...",
    "decision": "DECLINE",
    "risk_score": 90,
    "triggered_rules": [
      {
        "rule": "BLACKLIST",
        "severity": "CRITICAL",
        "reason": "ACCOUNT_ID \"ACC-FRAUD-999\" is blacklisted: Known fraudster"
      }
    ],
    "processed_at": "..."
  }
}
```

---

### 9.5 Score Request - High Velocity (REVIEW/DECLINE)

Kirim 5+ transaksi dalam waktu cepat dengan account yang sama:

**Request (kirim berulang 5x dengan cepat):**
```
POST {{base_url}}/v1/score
Content-Type: application/json
X-API-Key: {{api_key}}

{
  "external_txn_id": "TXN-VELOCITY-{{$randomInt}}",
  "account_id": "ACC-VELOCITY-TEST",
  "amount": 10000,
  "currency": "IDR",
  "available_balance": 1000000
}
```

**Expected Response setelah 4+ transaksi:**
```json
{
  "success": true,
  "data": {
    "decision": "REVIEW",
    "risk_score": 40,
    "triggered_rules": [
      {
        "rule": "VELOCITY",
        "severity": "MEDIUM",
        "reason": "Medium velocity: 4 transactions in last 5 minutes (threshold: 3)"
      }
    ]
  }
}
```

---

### 9.6 Score Request - Invalid API Key (Error)

**Request:**
```
POST {{base_url}}/v1/score
Content-Type: application/json
X-API-Key: invalid_key_12345

{
  "external_txn_id": "TXN-2026-ERR",
  "account_id": "ACC-12345",
  "amount": 50000,
  "currency": "IDR",
  "available_balance": 1000000
}
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "API key tidak valid"
  }
}
```

---

### 9.7 Score Request - Missing Required Fields (Error)

**Request:**
```
POST {{base_url}}/v1/score
Content-Type: application/json
X-API-Key: {{api_key}}

{
  "external_txn_id": "TXN-2026-ERR"
}
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {"field": "account_id", "message": "account_id is required"},
      {"field": "amount", "message": "amount is required"},
      {"field": "currency", "message": "currency is required"},
      {"field": "available_balance", "message": "available_balance is required"}
    ]
  }
}
```

---

## 10. Testing Portal Website

### 10.1 Test via Proxy (/api)

Portal menggunakan proxy sehingga request ke `/api/*` diteruskan ke backend.

**Request di Postman:**
```
GET {{portal_url}}/api/health
```

**Expected Response:**
```json
{
  "status": "ok"
}
```

---

### 10.2 Full Flow Test via Portal Proxy

**1. Register via Portal:**
```
POST {{portal_url}}/api/auth/register

{
  "name": "Portal Test User",
  "email": "portal_test@example.com",
  "password": "PortalPass123!"
}
```

**2. Login via Portal:**
```
POST {{portal_url}}/api/auth/login

{
  "email": "portal_test@example.com",
  "password": "PortalPass123!"
}
```

**3. Create API Key via Portal:**
```
POST {{portal_url}}/api/keys
Authorization: Bearer {{access_token}}

{
  "name": "Portal Created Key"
}
```

**4. Fraud Scoring via Portal:**
```
POST {{portal_url}}/api/v1/score
X-API-Key: {{api_key}}

{
  "external_txn_id": "PORTAL-TXN-001",
  "account_id": "ACC-PORTAL",
  "amount": 100000,
  "currency": "IDR",
  "available_balance": 500000
}
```

---

## 11. Automated Testing dengan Script

### 11.1 Script Smoke Test (PowerShell)

Lokasi: `services/portal/scripts/portal-smoke.ps1`

**Jalankan:**
```powershell
cd C:\Users\syahi\Downloads\fraudshield-provider\services\portal
Set-ExecutionPolicy -Scope Process Bypass -Force
.\scripts\portal-smoke.ps1
```

**Output jika berhasil:**
```
--- PORTAL PROXY SMOKE TEST ALL PASS ---
{
    "base":  "http://127.0.0.1:3000/api",
    "email":  "portal_smoke_12345@example.com",
    "steps":  [
        "auth/register",
        "auth/login",
        "me:get",
        "me:put",
        "me/password:put",
        "auth/login (new password)",
        "keys:get",
        "keys:post",
        "v1/score:post",
        "stats:*",
        "blacklist:crud",
        "auth/forgot-password + auth/reset-password",
        "auth/login (reset password)"
    ]
}
```

---

### 11.2 Postman Collection Runner

1. Klik **"Runner"** di pojok kiri bawah Postman
2. Pilih collection **"FraudShield API Testing"**
3. Pilih environment **"FraudShield Local"**
4. Klik **"Run FraudShield API Testing"**
5. Lihat hasil: ✅ Pass / ❌ Fail untuk setiap request

---

## 12. Troubleshooting

### 12.1 Error: Connection Refused

**Gejala:**
```
Error: connect ECONNREFUSED 127.0.0.1:4000
```

**Solusi:**
- Pastikan server API sudah berjalan: `npm run dev` di folder `services/api`
- Cek port 4000 tidak digunakan aplikasi lain

---

### 12.2 Error: 401 Unauthorized

**Gejala:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token tidak ditemukan"
  }
}
```

**Solusi:**
- Pastikan sudah login dan mendapat token
- Cek Authorization header sudah benar: `Bearer <token>`
- Cek token belum expire (1 jam)

---

### 12.3 Error: 401 Invalid API Key

**Gejala:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "API key tidak valid"
  }
}
```

**Solusi:**
- Pastikan API key sudah dibuat dan disimpan
- Cek API key belum di-revoke
- Cek header: `X-API-Key: <full_api_key>`

---

### 12.4 Error: Database Connection

**Gejala:**
```
Error: Access denied for user 'root'@'localhost'
```

**Solusi:**
- Cek kredensial di file `.env`
- Pastikan MySQL service berjalan
- Cek user memiliki permission ke database

---

### 12.5 Portal Tidak Bisa Akses API

**Gejala:**
- Portal tampil tapi tidak bisa login
- Network error di console browser

**Solusi:**
- Pastikan API server berjalan di port 4000
- Cek Vite proxy configuration di `vite.config.js`
- Cek CORS setting di API

---

## Checklist Testing Lengkap

### API Endpoints

- [ ] Health Check
- [ ] Register
- [ ] Login
- [ ] Forgot Password
- [ ] Reset Password
- [ ] Get Profile
- [ ] Update Profile
- [ ] Change Password
- [ ] List API Keys
- [ ] Create API Key
- [ ] Revoke API Key
- [ ] List Blacklist
- [ ] Create Blacklist
- [ ] Get Blacklist
- [ ] Update Blacklist
- [ ] Delete Blacklist
- [ ] Dashboard Stats
- [ ] Usage Stats
- [ ] Daily Stats
- [ ] Endpoint Stats
- [ ] Recent Transactions
- [ ] Fraud Scoring - Approve
- [ ] Fraud Scoring - Decline (Balance)
- [ ] Fraud Scoring - Decline (Blacklist)
- [ ] Fraud Scoring - Review (Velocity)

### Portal Website

- [ ] Home Page
- [ ] Pricing Page
- [ ] Docs Page
- [ ] Getting Started
- [ ] Register Form
- [ ] Login Form
- [ ] Dashboard Overview
- [ ] Dashboard API Keys
- [ ] Dashboard Blacklist
- [ ] Dashboard Usage
- [ ] Dashboard Settings
- [ ] Logout

### Integration

- [ ] Portal Proxy /api/health
- [ ] Full flow via Portal

---

*Dokumen ini adalah panduan lengkap testing FraudShield.*
*Gunakan bersama dengan Postman untuk testing yang efektif.*
