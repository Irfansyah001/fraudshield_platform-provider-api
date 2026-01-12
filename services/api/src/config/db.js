const mysql = require('mysql2/promise');
const config = require('./env');

// Membuat connection pool database
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Menjalankan query dengan parameter
 * @param {string} sql - String query SQL
 * @param {Array} params - Parameter query
 * @returns {Promise<Array>} Hasil query
 */
async function query(sql, params = []) {
  // Gunakan pool.query() untuk query dinamis dengan WHERE clause yang berubah
  // pool.execute() adalah prepared statement yang tidak cocok untuk dynamic query
  const [results] = await pool.query(sql, params);
  return results;
}

/**
 * Mengambil satu baris data
 * @param {string} sql - String query SQL
 * @param {Array} params - Parameter query
 * @returns {Promise<Object|null>} Satu baris atau null
 */
async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}

/**
 * Menjalankan insert dan mengembalikan ID yang dimasukkan
 * @param {string} sql - Statement SQL insert
 * @param {Array} params - Parameter query
 * @returns {Promise<number>} ID baris yang dimasukkan
 */
async function insert(sql, params = []) {
  const [result] = await pool.query(sql, params);
  return result.insertId;
}

/**
 * Menjalankan update/delete dan mengembalikan jumlah baris yang terpengaruh
 * @param {string} sql - Statement SQL update/delete
 * @param {Array} params - Parameter query
 * @returns {Promise<number>} Jumlah baris yang terpengaruh
 */
async function execute(sql, params = []) {
  const [result] = await pool.query(sql, params);
  return result.affectedRows;
}

/**
 * Menguji koneksi database
 * @returns {Promise<boolean>} Status koneksi
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error('Koneksi database gagal:', error.message);
    return false;
  }
}

/**
 * Menutup connection pool
 */
async function close() {
  await pool.end();
}

module.exports = {
  pool,
  query,
  queryOne,
  insert,
  execute,
  testConnection,
  close,
};
