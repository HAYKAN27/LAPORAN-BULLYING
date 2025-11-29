const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth')
const AuthController = require('../controllers/authController');
const UsersController = require('../controllers/pelaporControllers');




//PAGE USERS
router.get('/dashboard', checkAuth, UsersController.getDashboardUsers.bind(UsersController));
router.get('/createLaporan', checkAuth, UsersController.getCreateLaporan.bind(UsersController));
router.get('/riwayat', checkAuth, UsersController.getRiwayatUsers.bind(UsersController));







module.exports = router;