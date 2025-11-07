const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', {
        title: "Dashboard Admin",
        user: req.session?.username
    });
});

module.exports = router;
