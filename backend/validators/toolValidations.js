const { body, param, query } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');

// Validaciones para crear herramienta
const createToolValidation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto'),
  
  body('SKU')
    .optional()
    .isString().withMessage('El SKU debe ser texto'),
  
  body('categoria')
    .notEmpty().withMessage('La categoría es requerida')
    .isString().withMessage('La categoría debe ser texto'),
  
  body('proveedor')
    .notEmpty().withMessage('El proveedor es requerido')
    .isString().withMessage('El proveedor debe ser texto'),
  
  body('estado')
    .notEmpty().withMessage('El estado es requerido')
    .isIn(['stock', 'en_uso', 'dañada', 'mantenimiento', 'reparacion_sencilla'])
    .withMessage('Estado inválido'),
  
  body('ubicacion')
    .optional()
    .isString().withMessage('La ubicación debe ser texto'),
  
  validateRequest
];

// Validaciones para actualizar herramienta
const updateToolValidation = [
  param('id')
    .isMongoId().withMessage('ID de herramienta inválido'),
  
  body('nombre')
    .optional()
    .isString().withMessage('El nombre debe ser texto'),
  
  body('SKU')
    .optional()
    .isString().withMessage('El SKU debe ser texto'),
  
  body('categoria')
    .optional()
    .isString().withMessage('La categoría debe ser texto'),
  
  body('proveedor')
    .optional()
    .isString().withMessage('El proveedor debe ser texto'),
  
  body('estado')
    .optional()
    .isIn(['stock', 'en_uso', 'dañada', 'mantenimiento', 'reparacion_sencilla'])
    .withMessage('Estado inválido'),
  
  body('ubicacion')
    .optional()
    .isString().withMessage('La ubicación debe ser texto'),
  
  validateRequest
];

// Validaciones para asignar herramienta
const assignToolValidation = [
  param('id')
    .isMongoId().withMessage('ID de herramienta inválido'),
  
  body('employeeId')
    .isMongoId().withMessage('ID de empleado inválido'),
  
  body('observaciones')
    .optional()
    .isString().withMessage('Las observaciones deben ser texto'),
  
  validateRequest
];

// Validaciones para devolver herramienta
const returnToolValidation = [
  param('id')
    .isMongoId().withMessage('ID de herramienta inválido'),
  
  body('estado')
    .notEmpty().withMessage('El estado es requerido')
    .isIn(['stock', 'dañada', 'mantenimiento', 'reparacion_sencilla'])
    .withMessage('Estado inválido'),
  
  body('observaciones')
    .optional()
    .isString().withMessage('Las observaciones deben ser texto'),
  
  validateRequest
];

// Validaciones para mantenimiento
const maintenanceValidation = [
  param('id')
    .isMongoId().withMessage('ID de herramienta inválido'),
  
  body('descripcion')
    .notEmpty().withMessage('La descripción es requerida')
    .isString().withMessage('La descripción debe ser texto'),
  
  body('costo')
    .notEmpty().withMessage('El costo es requerido')
    .isNumeric().withMessage('El costo debe ser un número'),
  
  body('proximoMantenimiento')
    .notEmpty().withMessage('La fecha del próximo mantenimiento es requerida')
    .isISO8601().withMessage('Fecha inválida'),
  
  validateRequest
];

// Validaciones para consultas
const queryValidation = [
  query('period')
    .optional()
    .isIn(['mes', 'año', 'semestre'])
    .withMessage('Período inválido'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  validateRequest
];

module.exports = {
  createToolValidation,
  updateToolValidation,
  assignToolValidation,
  returnToolValidation,
  maintenanceValidation,
  queryValidation
}; 