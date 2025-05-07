const express = require('express');
const router = express.Router();
const salidaController = require('../controllers/salidaController');
const { upload } = require('../middleware/uploadMiddleware');

// Configuración para múltiples archivos
const uploadFields = upload.fields([
    { name: 'fotos', maxCount: 15 },
    { name: 'firmaEncargado', maxCount: 1 },
    { name: 'firmaConductor', maxCount: 1 }
]);

// Rutas para salidas
router.post('/', uploadFields, salidaController.crearSalida);
router.get('/', salidaController.obtenerSalidas);
router.get('/ingreso/:ingresoId', salidaController.obtenerSalidaPorIngreso);
router.get('/:id', salidaController.obtenerSalida);

module.exports = router;