const authController = {
    login: (req, res) => {
        const { username, password } = req.body;
    
        
        // Contoh sederhana (ganti dengan validasi database)
        if (username === 'admin' && password === 'admin123') {
            req.session.loggedIn = true;
            req.session.username = username;
            res.render('index', { user: req.session.username });
            // res.json({ success: true, message: 'Login berhasil!' });
            
        } else if(username === 'haikal123' && password === '272727'){
            req.session.loggedIn = true;
            req.session.username = username;
            res.render('index', { user: req.session.username });
            // res.json({ success: true, message: 'Login berhasil!' });
        }
        else {
            // Reset session untuk keamanan
            if (req.session) {
                req.session.loggedIn = false;
                req.session.username = null;
            }

            // Cek apakah username kosong
            if (!username || username.trim() === '') {
                return res.status(401).json({
                    success: false,
                    message: 'Username tidak boleh kosong!',
                    error: 'EMPTY_USERNAME'
                });
            }

            // Cek apakah password kosong
            if (!password || password.trim() === '') {
                return res.status(401).json({
                    success: false,
                    message: 'Password tidak boleh kosong!',
                    error: 'EMPTY_PASSWORD'
                });
            }

            // Jika username dan password diisi tapi salah
            res.status(401).json({
                success: false,
                message: 'Username atau password salah! Silakan coba lagi.',
                error: 'INVALID_CREDENTIALS'
            });
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.json({ success: true, message: 'Logout berhasil! cuyyyy' });
    }
};

module.exports = authController;