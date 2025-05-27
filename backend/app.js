const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');
const config = require('./config/config');

dotenv.config();
connectDB();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Orígenes permitidos
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

// Middleware
app.use(helmet()); // Seguridad básica
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Aumentar el límite de listeners si es necesario
require('events').EventEmitter.defaultMaxListeners = 20;

// Importar rutas
const employeeRoutes = require('./routes/employeesRoutes');
const productRoutes = require('./routes/productRoutes');
const bayRoutes = require('./routes/baysRoutes');
const proveedoresRoutes = require('./routes/proveedoresRoutes'); 
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ingresoRoutes = require('./routes/ingresoRoutes');
const salidaRoutes = require('./routes/salidaRoutes');
const quotationsRoutes = require('./routes/quotationsRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bays', bayRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/salidas', salidaRoutes);
app.use('/api/quotations', quotationsRoutes);
app.use('/api/tools', toolsRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware de manejo de errores
app.use(errorHandler);

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

module.exports = app;