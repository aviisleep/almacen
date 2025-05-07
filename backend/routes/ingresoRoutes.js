const express = require('express');
const router = express.Router();
const ingresoController = require('../controllers/ingresoController');
const { upload } = require('../middleware/uploadMiddleware');

// Configuración para múltiples archivos
const uploadFields = upload.fields([
    { name: 'fotos', maxCount: 15 },
    { name: 'firmaEncargado', maxCount: 1 },
    { name: 'firmaConductor', maxCount: 1 }
]);

// Rutas para ingresos
router.post('/', uploadFields, ingresoController.crearIngreso);
router.get('/', ingresoController.obtenerIngresos);
router.get('/:id', ingresoController.obtenerIngreso);
router.put('/:id', ingresoController.actualizarIngreso);
router.delete('/:id', ingresoController.eliminarIngreso);

module.exports = router;