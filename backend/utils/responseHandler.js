/**
 * Función para enviar una respuesta exitosa
 * @param {Object} res - Objeto response de Express
 * @param {number} statusCode - Código de estado HTTP
 * @param {Object} data - Datos a enviar en la respuesta
 */
const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    success: true,
    ...data
  });
};

/**
 * Función para manejar errores
 * @param {Object} res - Objeto response de Express
 * @param {Error} error - Objeto de error
 * @param {string} defaultMessage - Mensaje de error por defecto
 */
const handleError = (res, error, defaultMessage = 'Error interno del servidor') => {
  console.error('Error:', error);
  
  const statusCode = error.statusCode || 500;
  const message = error.message || defaultMessage;
  
  res.status(statusCode).json({
    success: false,
    message,
    error: error.stack || message
  });
};

module.exports = {
  sendResponse,
  handleError
}; 