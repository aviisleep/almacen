const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // minutos a milisegundos
  max: process.env.RATE_LIMIT_MAX, // límite de peticiones por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde'
  }
});

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 horas
};

// Middleware de seguridad
const securityMiddleware = [
  // Protección básica de headers
  helmet(),
  
  // Prevenir XSS attacks
  xss(),
  
  // Prevenir HTTP Parameter Pollution
  hpp(),
  
  // Sanitizar datos de MongoDB
  mongoSanitize(),
  
  // Configurar CORS
  cors(corsOptions),
  
  // Rate limiting
  limiter
];

module.exports = securityMiddleware; 