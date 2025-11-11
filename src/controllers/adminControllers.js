const { pool } = require('../config/database');

class adminController {
    getDashboard(req, res) {
        res.render('admin/dashboard', {
            title: "Dashboard Admin",
            user: req.session?.username
        });
    }
    getPageML(req, res) {
        res.render('admin/PageML', {
            title: "Page Machine Learning",
            user: req.session?.username
        });
    }
    async getPageML(req, res) {
        try {
            // Query ambil data laporan + join ke users
            const [laporan] = await pool.query(`
                 SELECT 
                    id,
                    status_pelapor,
                    nama_korban,
                    pendidikan,
                    nama_pelaku,
                    frekuensi_kejadian,
                    tempat_kejadian,
                    nama_tempat,
                    tanggal_waktu,
                    bukti_file_path,
                    nomor_telepon,
                    created_at
                FROM laporan
                ORDER BY created_at DESC
            `);

            // Render EJS dan kirim data laporan
            res.render('admin/PageML', {
                title: 'Data Laporan Bullying',
                user: req.session?.username,
                laporan : laporan
            });
        } catch (err) {
            console.error('❌ Error ambil data laporan:', err.message);
            res.status(500).send('Terjadi kesalahan mengambil data laporan');
        }
    }
}

module.exports  = new adminController();