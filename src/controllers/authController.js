const authController = {
    login: (req, res) => {
        const { username, password } = req.body;

        if (username === 'admin' && password === 'admin123') {
            req.session.loggedIn = true;
            req.session.username = username;
            res.render('admin/dashboard', { user: username, message: null });
        } else if (username === 'haikal123' && password === '272727') {
            req.session.loggedIn = true;
            req.session.username = username;
            res.render('index', { user: username, message: null });
        } else {
            // Pesan error dikirim ke halaman login
            let message = '';
            if (!username || username.trim() === '') {
                message = 'Username tidak boleh kosong!';
            } else if (!password || password.trim() === '') {
                message = 'Password tidak boleh kosong!';
            } else {
                message = 'Username atau password salah!';
            }

            // Render ulang halaman login + tampilkan alert
            res.render('login', { message });
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    }
};

module.exports = authController;
