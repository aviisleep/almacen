// src/routes/ingresoSalidaRoutes.js

const express = require('express');
const router = express.Router();
const ingresoSalidaController = require('../controllers/ingresoSalida');

// Rutas
router.get('/api/entrada-salida', ingresoSalidaController.getAllIngresoSalida);
router.post('/api/entrada-salida', ingresoSalidaController.createIngresoSalida);
router.put('/api/entrada-salida/:id', ingresoSalidaController.updateIngresoSalida);
router.delete('/api/entrada-salida/:id', ingresoSalidaController.deleteIngresoSalida);

module.exports = router;