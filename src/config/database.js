const mysql = require('mysql2');

// Konfigurasi database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',              // Sesuaikan dengan password MySQL Anda
    database: 'dblaporan_bullying',   // Nama database sesuai schema.sql
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Buat koneksi pool
const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// Fungsi untuk mengecek koneksi database
async function checkConnection() {
    try {
        const [rows] = await promisePool.query('SELECT 1');
        console.log('✅ Koneksi ke database berhasil!');
        return true;
    } catch (error) {
        console.error('❌ Error koneksi database:', error.message);
        throw error;
    }
}

// Fungsi untuk memastikan database dan tabel ada
async function initializeDatabase() {
    try {
        // Buat database jika belum ada
        await promisePool.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await promisePool.query(`USE ${dbConfig.database}`);
        
        // Buat tabel users jika belum ada
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin','user') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Buat tabel laporan jika belum ada
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS laporan (
                id INT AUTO_INCREMENT PRIMARY KEY,
                status_pelapor ENUM('Korban', 'Saksi') NOT NULL,
                nama_korban VARCHAR(100) NOT NULL,
                pendidikan ENUM('Guru', 'Siswa') NOT NULL,
                nama_pelaku VARCHAR(100) NOT NULL,
                frekuensi_kejadian TEXT,
                tempat_kejadian ENUM('Di Sekolah', 'Diluar Sekolah') NOT NULL,
                nama_tempat VARCHAR(100) NOT NULL,
                tanggal_waktu DATETIME NOT NULL,
                bukti_file_path VARCHAR(255),
                nomor_telepon VARCHAR(15),
                pelapor_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (pelapor_id) REFERENCES users(id)
            )
        `);

        console.log('✅ Database dan tabel berhasil diinisialisasi!');
    } catch (error) {
        console.error('❌ Error saat inisialisasi database:', error.message);
        throw error;
    }
}

// Export semua yang dibutuhkan
module.exports = {
    pool: promisePool,
    checkConnection,
    initializeDatabase
};