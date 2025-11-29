const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const adminController = require('../controllers/adminControllers'); 
const checkAuth = require('../middleware/auth');

router.post('/lapor', checkAuth, laporanController.createLaporan);
router.post('/delete/:id', checkAuth, laporanController.deleteLaporan);
router.post('/acc/:id', checkAuth, laporanController.accLaporan);
router.post('/tolak/:id', checkAuth, laporanController.tolakLaporan);







module.exports = router;