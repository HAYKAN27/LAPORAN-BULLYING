const { pool } = require('../config/database');

class pelaporControllers {
    async getDashboardUsers(req, res) {
        try {
            const [laporan] = await pool.query(`
                SELECT * FROM laporan WHERE pelapor_id = ?
            `, [req.session.user_id]);  // ⬅ pakai session yang benar

            const userId = req.session.userId;
            const [users] = await pool.query(`
                SELECT *
                FROM users
                WHERE id = ?
                ORDER BY created_at DESC
            `, [req.session.user_id]);
            res.render('users/dashboard', {
                laporan,
                users,
                nama: req.session.username,
                activePage: 'dashboard',
                id: userId

            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getCreateLaporan(req, res) {
        try {
            res.render('users/createLaporan', {
                nama: req.session.username,
                activePage: 'create-laporan'
            });
        } catch (error) {
            console.error('Error rendering create laporan page:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getRiwayatUsers(req, res) {
        try {
            const [laporan] = await pool.query(`
                SELECT * FROM laporan WHERE pelapor_id = ?
        `, [req.session.user_id]);  // ⬅ pakai session yang benar

            res.render('users/riwayatLaporan', {
                laporan,
                nama: req.session.username,
                activePage: 'riwayat'
            });

        } catch (error) {
            console.error('Error fetching laporan:', error);
            res.status(500).send('Internal Server Error');
        }
    }
async detailPenolakan(req, res) {
    try {
        const laporanId = req.params.id; // ID laporan

        const [rows] = await pool.query(
                `SELECT catatan 
                FROM riwayat_laporan 
                WHERE laporan_id = ? 
                ORDER BY created_at DESC 
                LIMIT 1`,
                [laporanId]
        );

        res.json({
            success: true,
            catatan: rows.length ? rows[0].catatan : 'Tidak ada catatan'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
}


}

module.exports = new pelaporControllers();