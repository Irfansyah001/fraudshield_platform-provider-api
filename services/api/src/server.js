const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');

const PORT = config.port;

async function startServer() {
  try {
    // Menguji koneksi database
    console.log('Menguji koneksi database...');
    const connected = await db.testConnection();
    
    if (!connected) {
      console.error('Gagal terhubung ke database. Silakan periksa konfigurasi Anda.');
      console.error('Pastikan MySQL berjalan dan database sudah ada.');
      process.exit(1);
    }
    
    console.log('Koneksi database berhasil.');

    // Menjalankan server
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    FraudShield API Server                     ║
╠═══════════════════════════════════════════════════════════════╣
║  Status:      Running                                         ║
║  Port:        ${String(PORT).padEnd(48)}║
║  Environment: ${config.nodeEnv.padEnd(48)}║
║  API Docs:    http://localhost:${PORT}/docs${' '.repeat(25)}║
╚═══════════════════════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('Gagal menjalankan server:', error);
    process.exit(1);
  }
}

// Menangani shutdown yang baik
process.on('SIGTERM', async () => {
  console.log('SIGTERM diterima. Mematikan server dengan baik...');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT diterima. Mematikan server dengan baik...');
  await db.close();
  process.exit(0);
});

// Menangani exception yang tidak tertangkap
process.on('uncaughtException', (error) => {
  console.error('Exception Tidak Tertangkap:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise Rejection Tidak Tertangani di:', promise, 'alasan:', reason);
  process.exit(1);
});

startServer();
