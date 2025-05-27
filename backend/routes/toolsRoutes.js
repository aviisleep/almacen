const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
  assignTool,
  returnTool,
  getAvailableTools,
  getAssignedTools,
  getToolHistory,
  getMostUsedTools,
  getTopToolUsers,
  registerMaintenance
} = require('../controllers/toolsController');

const {
  createToolValidation,
  updateToolValidation,
  assignToolValidation,
  returnToolValidation,
  maintenanceValidation,
  queryValidation
} = require('../validators/toolValidations');

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas para todos los usuarios autenticados
router.get('/', getAllTools); // Listar todas las herramientas
router.get('/available', getAvailableTools); // Herramientas disponibles
router.get('/assigned', getAssignedTools); // Herramientas asignadas
router.get('/:id', getToolById); // Ver detalles de una herramienta
router.get('/:id/history', getToolHistory); // Ver historial de una herramienta
router.get('/stats/most-used', queryValidation, getMostUsedTools); // Estadísticas de uso
router.get('/stats/top-users', queryValidation, getTopToolUsers); // Usuarios más activos

// Rutas que requieren rol de administrador o supervisor
router.post('/', authorize('admin', 'supervisor'), createToolValidation, createTool); // Crear herramienta
router.put('/:id', authorize('admin', 'supervisor'), updateToolValidation, updateTool); // Actualizar herramienta
router.delete('/:id', authorize('admin'), deleteTool); // Eliminar herramienta
router.post('/:id/maintenance', authorize('admin', 'supervisor'), maintenanceValidation, registerMaintenance); // Registrar mantenimiento

// Rutas que requieren rol de administrador, supervisor o empleado
router.put('/:id/assign', authorize('admin', 'supervisor', 'empleado'), assignToolValidation, assignTool); // Asignar herramienta
router.put('/:id/return', authorize('admin', 'supervisor', 'empleado'), returnToolValidation, returnTool); // Devolver herramienta

// Compatibilidad con POST (para frontend)
router.post('/:id/assign', authorize('admin', 'supervisor', 'empleado'), assignToolValidation, assignTool);
router.post('/:id/return', authorize('admin', 'supervisor', 'empleado'), returnToolValidation, returnTool);

module.exports = router; 