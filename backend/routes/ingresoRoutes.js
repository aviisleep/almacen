const express = require('express');
const router = express.Router();
const ingresoController = require('../controllers/ingresoController');
const { ingreso: uploadIngresoFiles, handleUploadErrors } = require('../middleware/uploadMiddleware');

console.log('uploadIngresoFiles:', uploadIngresoFiles);
console.log('handleUploadErrors:', handleUploadErrors);
// Ruta para crear ingreso con manejo de archivos
router.post(
  '/',
  uploadIngresoFiles, // Middleware para subir archivos
  handleUploadErrors, // Middleware para manejar errores
  ingresoController.crearIngreso // Controlador final - ¡DEBE existir!
);

// Rutas para ingresos
router.get('/', ingresoController.obtenerIngresos);
router.get('/:id', ingresoController.obtenerIngreso);
router.put('/:id', ingresoController.actualizarIngreso);
router.delete('/:id', ingresoController.eliminarIngreso);

module.exports = router;