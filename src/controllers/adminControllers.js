const { pool } = require('../config/database');

// Import helper
// (ditempatkan di file ini juga atau dibuat file terpisah)
async function getLaporanPending(pool) {
    const [laporan] = await pool.query(`
        SELECT *
        FROM laporan
        WHERE status IS NULL OR status = 'pending'
        ORDER BY created_at DESC
    `);
    return laporan;
}

async function getLaporanAcc(pool) {
    const [laporan] = await pool.query(`
        SELECT *
        FROM laporan
        WHERE status = 'diterima'
        ORDER BY created_at DESC
    `);
    return laporan;
}

async function getLaporanTolak(pool) {
    const [laporan] = await pool.query(`
        SELECT *
        FROM laporan
        WHERE status = 'ditolak'
        ORDER BY created_at DESC
    `);
    return laporan;
}
async function getUsersAdmin(pool) {
    const [users] = await pool.query(`
        SELECT * FROM users WHERE role = 'admin'    
    `);
    return users;
}
async function getUsers(pool) {
    const [users] = await pool.query(`
        SELECT *  FROM users WHERE role = 'user'    
    `);
    return users;
}

class adminController {

    async getDashboard(req, res) {
        try {
            const [laporan] = await pool.query(`
                SELECT 
                *
                FROM laporan
                ORDER BY created_at DESC
            `);

            const users = await getUsers(pool);
            const usersAdmin = await getUsersAdmin(pool);
            const laporanPending = await getLaporanPending(pool);
            const laporanAcc = await getLaporanAcc(pool);
            const laporanTolak = await getLaporanTolak(pool);

            res.render('admin/dashboard', {
                id: users.id,
                user: req.session?.username,
                nama: req.session.username,
                laporan,
                usersAdmin,
                users,
                laporanPending,
                laporanAcc,
                laporanTolak,
                activePage: 'dashboard'
            });

        } catch (err) {
            console.error('❌ Error ambil data laporan:', err.message);
            res.status(500).render('error/500', {
                alert: 'Terjadi kesalahan mengambil data laporan'
            });
        }
    }

    async getPageRole(req, res) {
        try {
            const Getusers = await getUsers(pool);
            const Getadmin = await getUsersAdmin(pool);

            res.render('admin/PageRole', {
                user: req.session?.username,
                user: req.session?.id,  
                activePage: 'role',
                Getusers,
                Getadmin,
                

            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }

async getPageML(req, res) {
    try {
        const laporanPending = await getLaporanPending(pool);
        const laporanAcc = await getLaporanAcc(pool);
        const laporanTolak = await getLaporanTolak(pool);

        res.render('admin/PageML', {
            title: 'Data Laporan Bullying',
            user: req.session?.username,
            laporanPending,
            laporanAcc,
            laporanTolak,
            activePage: 'ml'
        });

    } catch (err) {
        console.error('❌ Error ambil data laporan:', err);
        res.status(500).send('Terjadi kesalahan mengambil data laporan');
    }
}


    async getRegisterAdmin(req, res) {
        res.render('admin/pageRegister', {
            user: req.session?.username,
            activePage: 'register'
        });
    }
}

module.exports = new adminController();
