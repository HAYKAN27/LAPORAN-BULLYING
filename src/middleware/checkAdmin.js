const checkAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        return next();
    }
    return res.status(403).send("Akses ditolak (bukan admin)");
};

module.exports = checkAdmin;
