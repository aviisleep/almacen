const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');

// Rutas para vehículos
router.get('/', vehiculoController.getVehiculos); // Obtener todos los vehículos
router.get('/:id', vehiculoController.getVehiculoById); // Obtener un vehículo por ID
router.post('/', vehiculoController.createVehiculo); // Crear un nuevo vehículo
router.put('/:id', vehiculoController.updateVehiculo);
router.put('/:id/asignar-employees', vehiculoController.assignEmpleadoToVehiculo); // Asignar un empleado a un vehículo
router.put('/:id/assign-products', vehiculoController.assignProductToVehicle); // Asignar productos a un vehículo
router.put('/:id/update-status', vehiculoController.updateEstadoVehiculo); // Cambiar el estado de un vehículo
router.delete('/:id', vehiculoController.deleteVehiculo); // Eliminar un vehículo

module.exports = router;