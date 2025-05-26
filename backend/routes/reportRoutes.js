const express = require('express');
const router = express.Router();
const { 
  getPendingTools,
  getMostUsedTools,
  getTopToolUsers,
  getAverageUsageTime,
  getMaintenanceCosts
} = require('../controllers/reportController');
const { verifyToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// Obtener herramientas pendientes de devolución
router.get('/pending-tools', getPendingTools);

// Obtener herramientas más utilizadas
router.get('/most-used-tools', getMostUsedTools);

// Obtener empleados que más herramientas usan
router.get('/top-tool-users', getTopToolUsers);

// Obtener tiempo promedio de uso
router.get('/average-usage-time', getAverageUsageTime);

// Obtener costos de mantenimiento
router.get('/maintenance-costs', getMaintenanceCosts);

module.exports = router; 