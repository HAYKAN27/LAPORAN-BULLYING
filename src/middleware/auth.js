const checkAuth = (req, res, next) => {
    if (req.session && req.session.loggedIn) {
        return next();
    }

    // Redirect kembali ke halaman login
    return res.redirect('/');
};

module.exports = checkAuth;
