const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  changePassword,
  updateMe,
  deactivateUser
} = require('../controllers/authController');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.put('/me', protect, updateMe);

// Rutas de administrador
router.put('/:id/deactivate', protect, authorize('admin'), deactivateUser);

module.exports = router; 