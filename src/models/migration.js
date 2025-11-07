const db = require('../config/database');

async function createTables() {
    try {
        // Buat tabel users
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabel users berhasil dibuat atau sudah ada');

        // Buat tabel laporan
        await db.query(`
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

    

        return true;
    } catch (error) {
        console.error('❌ Error saat membuat tabel:', error);
        throw error;
    }
}

// Export fungsi untuk digunakan di app.js
module.exports = {
    createTables
};