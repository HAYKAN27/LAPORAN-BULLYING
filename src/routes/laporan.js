const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const checkAuth = require('../middleware/auth');

router.post('/lapor', checkAuth, laporanController.createLaporan);

module.exports = router;