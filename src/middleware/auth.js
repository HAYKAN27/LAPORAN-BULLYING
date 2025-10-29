const checkAuth = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu!' });
    }
};

module.exports = checkAuth;