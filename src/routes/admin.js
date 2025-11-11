const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');

// Dashboard
router.get('/dashboard', adminController.getDashboard.bind(adminController));

// Page ML
router.get('/page-ml', (req, res) => adminController.getPageML(req, res));

module.exports = router;