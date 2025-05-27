// routes/employeesRoutes.js

const express = require("express");
const { body, param, validationResult } = require("express-validator");
const employeesController = require("../controllers/employeesController");

const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");

// Middleware para validar resultados
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener todos los empleados
router.get('/', employeesController.getAllEmployees);

// Obtener un empleado por ID
router.get(
  '/:id',
  asyncHandler(employeesController.getEmployeeById)
);

// Crear un nuevo empleado con validación
router.post(
  "/",
  [
    body('name').notEmpty().withMessage('El nombre es requerido'),
  body('position').notEmpty().withMessage('El cargo es requerido'),
  body('email').optional().isEmail().withMessage('Email no válido'),
  body('phone').optional().isMobilePhone().withMessage('Teléfono no válido'),
  body('Birthday').optional().isISO8601().withMessage('Fecha no válida')
  ],
  validate,
  employeesController.createEmployee
);

// Actualizar un empleado por ID
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("ID de empleado inválido"),
    body("name").optional().trim(),
    body("email").optional().isEmail().withMessage("Correo electrónico inválido."),
    body("position").optional().trim(),
  ],
  validate,
  employeesController.updateEmployee
);

// Eliminar un empleado por ID
router.delete(
  "/:id",
  [
    param("id").isMongoId().withMessage("ID de empleado inválido"),
  ],
  validate,
  employeesController.deleteEmployee
);

// Entregar producto a un empleado
router.post(
  "/:id/deliver-product",
  [
    param("id").isMongoId().withMessage("ID de empleado inválido"),
    body("productId").isMongoId().withMessage("ID de producto inválido"),
    body("cantidad").isInt({ min: 1 }).withMessage("Cantidad debe ser mayor a 0")
  ],
  validate,
  employeesController.assignProductToEmployee
);

module.exports = router;