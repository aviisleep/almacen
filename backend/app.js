const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();


// Middleware  
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());

// Importar rutas
const employeeRoutes = require('./routes/employeesRoutes');
const productRoutes = require('./routes/productRoutes');
const bayRoutes = require('./routes/baysRoutes');
const proveedoresRoutes = require('./routes/proveedoresRoutes'); 
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const ingresoSalidaRoutes = require('./routes/ingresoSalidaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Usar rutas
app.use('/api/employees', employeeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bays', bayRoutes);
app.use('/api/proveedores', proveedoresRoutes); 
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/entrada-salida', ingresoSalidaRoutes);
app.use('/api', dashboardRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));