const express = require('express');
const { body, param, validationResult } = require('express-validator');
const employeesController = require('../controllers/employeesController');

const router = express.Router();

// Get all employees
router.get('/', employeesController.getAllEmployees);

// Get a single employee by ID
router.get('/:id', employeesController.getEmployeeById);

// Create a new employee
router.post(
    '/',
    [
      body('name')
        .notEmpty()
        .withMessage('El nombre del empleado es obligatorio.')
        .trim(), // Elimina espacios innecesarios
    ],
    employeesController.createEmployee
  );

// Update an employee by ID
router.put('/:id', employeesController.updateEmployee);

// Delete an employee by ID
router.delete('/:id', employeesController.deleteEmployee);

// Entregar un producto a un empleado
router.post(
    '/:id/deliver-product',
    [
      param('id').isMongoId().withMessage('ID de empleado inválido'),
      body('productoId').isMongoId().withMessage('ID de producto inválido'),
      body('cantidad')
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un número positivo'),
    ],
    employeesController.deliverProductToEmployee
  );

// Asignar un vehículo a un empleado
router.put(
    '/:id/asignar-employee',
    [
      param('id').isMongoId().withMessage('ID de empleado inválido'),
      body('vehicleId').isMongoId().withMessage('ID de vehículo inválido'),
    ],
    employeesController.assignVehicleToEmployee
  );

module.exports = router;