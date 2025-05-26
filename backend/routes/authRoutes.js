const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  registerUser,
  login,
  changePassword,
  getMe,
  updateMe,
  deactivateUser
} = require('../controllers/authController');

// Rutas públicas
router.post('/login', login);

// Rutas protegidas (requieren autenticación)
router.use(protect);
router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/change-password', changePassword);

// Rutas que requieren rol de administrador
router.post('/register', authorize('admin'), registerUser);
router.put('/:id/deactivate', authorize('admin'), deactivateUser);

module.exports = router; 