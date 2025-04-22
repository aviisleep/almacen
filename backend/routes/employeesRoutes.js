const express = require('express');
const employeesController = require('../controllers/employeesController');

const router = express.Router();

// Get all employees
router.get('/', employeesController.getAllEmployees);

// Get a single employee by ID
router.get('/:id', employeesController.getEmployeeById);

// Create a new employee
router.post('/', employeesController.createEmployee);

// Update an employee by ID
router.put('/:id', employeesController.updateEmployee);

// Delete an employee by ID
router.delete('/:id', employeesController.deleteEmployee);

// Entregar un producto a un empleado
router.post('/:id/deliver-product', employeesController.deliverProductToEmployee);

// Asignar un vehículo a un empleado
router.post('/:id/assign-vehicle', employeesController.assignVehicleToEmployee);

module.exports = router;