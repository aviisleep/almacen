const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Middleware  
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Aumentar el límite de listeners si es necesario
require('events').EventEmitter.defaultMaxListeners = 20;

// Importar rutas
const employeeRoutes = require('./routes/employeesRoutes');
const productRoutes = require('./routes/productRoutes');
const bayRoutes = require('./routes/baysRoutes');
const proveedoresRoutes = require('./routes/proveedoresRoutes'); 
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const ingresoSalidaRoutes = require('./routes/ingresoSalidaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ingresoRoutes = require('./routes/ingresoRoutes');
const salidaRoutes = require('./routes/salidaRoutes');
const quotationsRoutes = require('./routes/quotationsRoutes');

// Usar rutas
app.use('/api/employees', employeeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bays', bayRoutes);
app.use('/api/proveedores', proveedoresRoutes); 
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/entrada-salida', ingresoSalidaRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/salidas', salidaRoutes);
app.use('/api/quotations', quotationsRoutes);


// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));