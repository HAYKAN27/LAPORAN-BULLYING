const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const checkAuth = require('../middleware/auth')
const checkAdmin = require('../middleware/checkAdmin');
const AuthController = require('../controllers/authController');
const usersController = require('../controllers/usersControllers');

// method untuk menampilkan halaman admin
router.get('/dashboard', checkAuth, checkAdmin, adminController.getDashboard.bind(adminController));
router.get('/page-ml', checkAuth, checkAdmin, (req, res) => adminController.getPageML(req, res));
router.get('/page-role', checkAuth, checkAdmin, (req, res) => adminController.getPageRole(req, res));
router.get('/page-register', checkAuth, checkAdmin, (req, res) => adminController.getRegisterAdmin(req, res));

// account managgement Routes
router.post('/registerUsers', checkAuth, checkAdmin, usersController.createUsers);
router.post('/deleteUsers/:id', checkAuth, checkAdmin, usersController.deletedUsers);      
router.post('/updateUsers/:id', checkAuth, checkAdmin, usersController.updatePassword);

module.exports = router;    