const express = require('express');
const router = express.Router();

// Importa los controladores

const {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} = require('../controllers/proveedoresController');

// Obtener todos los proveedores
router.get('/', obtenerProveedores);

// Obtener un proveedor por ID
router.get('/:id', obtenerProveedorPorId);

// Crear un nuevo proveedor
router.post('/', crearProveedor);

// Actualizar un proveedor existente
router.put('/:id', actualizarProveedor);

// Eliminar un proveedor
router.delete('/:id', eliminarProveedor);

module.exports = router;