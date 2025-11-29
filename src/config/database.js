const mysql = require('mysql2');


// Konfigurasi database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',              // Sesuaikan dengan password MySQL Anda
    database: 'dbbullying',   // Nama database sesuai schema.sql
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
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'user',
                email VARCHAR(100),
                no_hp VARCHAR(20),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);


        // Buat tabel laporan jika belum ada
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS laporan (
                laporan_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                status_pelapor ENUM('Korban', 'Saksi') NOT NULL,
                nama_korban VARCHAR(100),
                pendidikan_korban  ENUM('Guru', 'Siswa'),
                nama_pelaku VARCHAR(100),
                pendidikan_pelaku  ENUM('Guru', 'Siswa'),
                frekuensi_kejadian VARCHAR(100),
                tempat_kejadian ENUM('Di Sekolah', 'Diluar Sekolah'),
                nama_tempat_kejadian VARCHAR(150),
                tanggal_waktu_kejadian DATETIME,
                nomor_kontak VARCHAR(20),
                verifikasi BOOLEAN DEFAULT FALSE,
                status ENUM('pending', 'diterima', 'ditolak') DEFAULT 'pending',
                admin_note TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        `);

        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS riwayat_laporan (
                riwayat_id INT AUTO_INCREMENT PRIMARY KEY,
                laporan_id INT NOT NULL,
                admin_id INT NULL,
                status_lama ENUM('pending', 'diterima', 'ditolak') NOT NULL,
                status_baru ENUM('pending', 'diterima', 'ditolak') NOT NULL,
                catatan TEXT,
                tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (laporan_id) REFERENCES laporan(id) ON DELETE CASCADE,
                FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
            );

    `);


        // Seed admin user jika belum ada
        const [adminCheck] = await promisePool.query('SELECT * FROM users WHERE username = ?', ['admin']);
        if (adminCheck.length === 0) {
            await promisePool.query('INSERT INTO users (username, password, role, gmail) VALUES (?, ?, ?, ?)', ['admin', 'admin123', 'admin', 'admin@gmail.com']);
            console.log('✅ Admin user berhasil di-seed (username: admin, password: admin123)');
        }

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