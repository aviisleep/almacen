module.exports = [
    body('cantidad')
      .exists().withMessage('El campo cantidad es requerido')
      .isInt({ gt: 0 }).withMessage('Debe ser un número mayor a 0'),
  ];