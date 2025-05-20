const express = require('express');
const router = express.Router();
const salidaController = require('../controllers/salidaController');
const { salida, handleUploadErrors } = require('../middleware/uploadMiddleware');

// Ruta para crear salida con manejo de archivos
router.post(
  '/',
  salida, // Middleware de subida específico para salidas
  handleUploadErrors,
  salidaController.crearSalida
);

// Otras rutas
router.get('/', salidaController.obtenerSalidas);
router.get('/:id', salidaController.obtenerSalida);
router.put('/:id', salidaController.actualizarSalida);
router.delete('/:id', salidaController.eliminarSalida);

module.exports = router;