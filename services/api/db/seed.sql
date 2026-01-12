-- Data Awal FraudShield
-- Opsional: Jalankan script ini untuk mengisi data tes awal

USE fraudshield;

-- Memasukkan user admin (email: admin@fraudshield.id, password: Admin@123456)
-- Hash password menggunakan bcrypt dengan 10 salt rounds
INSERT INTO users (name, email, password_hash, role) VALUES
('Administrator', 'admin@fraudshield.id', '$2b$10$rICGCAkdwGyc6B.ykExmhOmHt.Vx.x7CbGLRGWD.IqfLFYt5kEQKy', 'admin');

-- Memasukkan user tes biasa (email: developer@example.com, password: Password@123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Test Developer', 'developer@example.com', '$2b$10$rICGCAkdwGyc6B.ykExmhOmHt.Vx.x7CbGLRGWD.IqfLFYt5kEQKy', 'user');

-- Catatan: API key harus dibuat melalui API untuk memastikan hashing yang benar
-- Berikut ini hanya untuk referensi struktur

-- Memasukkan contoh entri blacklist untuk user ID 2 (developer)
INSERT INTO blacklist_entries (user_id, type, value, reason, active) VALUES
(2, 'ACCOUNT_ID', 'blocked_account_123', 'Akun fraudster yang diketahui', TRUE),
(2, 'IP', '192.168.1.100', 'IP mencurigakan dari investigasi fraud', TRUE),
(2, 'COUNTRY', 'XX', 'Kode negara berisiko tinggi', TRUE),
(2, 'MERCHANT_ID', 'suspicious_merchant_001', 'Dilaporkan karena fraud', TRUE);

-- Catatan Kredensial:
-- Admin: admin@fraudshield.id / Admin@123456
-- User: developer@example.com / Password@123
--
-- Setelah menjalankan schema dan seed, Anda bisa:
-- 1. Login sebagai admin untuk mengelola semua data
-- 2. Login sebagai developer untuk menguji fitur user biasa
-- 3. Membuat API key melalui POST /keys
-- 4. Menggunakan API key tersebut untuk menguji endpoint /v1/score
