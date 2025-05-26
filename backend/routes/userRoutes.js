const express = require('express');
const router = express.Router();
const { getProfile, getUsers, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Rutas protegidas
router.get('/profile', protect, getProfile);
router.get('/users', protect, getUsers);
router.put('/change-password', protect, changePassword);

module.exports = router; 