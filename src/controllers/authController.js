const db = require('../config/database');

const authController = {

    login: async (req, res) => {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.render('auth/pagelogin', {
                alert: "Username dan password wajib diisi!"
            });
        }   

        const query = 'SELECT * FROM users WHERE username = ?';

        try {
            const [results] = await db.pool.query(query, [username]);

            if (!results || results.length === 0) {
                console.log(`Login gagal: user tidak ditemukan -> ${username}`);
                return res.render('auth/pagelogin', { alert: 'Username atau password salah!' });
            }

            const user = results[0];

            if (password !== user.password) {
                console.log(`Login gagal: password salah -> ${username}`);
                return res.render('auth/pagelogin', { alert: 'Username atau password salah!' });
            }

            // Sukses: set session
            req.session.loggedIn = true;
            req.session.user_id = user.id;
            req.session.username = user.username;   
            req.session.role = user.role;

            console.log(`Login sukses: ${user.username} (role=${user.role})`);

            if (user.role && user.role.toLowerCase().trim() === 'admin') {
                return res.redirect('/admin/dashboard');
            }
            // atau login sebagai users
            return res.redirect('/users/dashboard');
        } catch (err) {
            console.error('Error saat login:', err.message);
            return res.render('auth/pagelogin', { alert: 'Terjadi kesalahan server!' });
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error('❌ Logout error:', err.message);
            res.redirect('/');
        });
    }
};

module.exports = authController;
