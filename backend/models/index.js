const mongoose = require('mongoose');

// Importa todos tus esquemas
const ProductSchema = require('./Product').schema;
const EmployeeSchema = require('./Employee').schema;
const VehiculoSchema = require('./Vehiculo').schema;

// Registra los modelos solo si no existen
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
const Vehiculo = mongoose.models.Vehiculo || mongoose.model('Vehiculo', VehiculoSchema);

module.exports = {
  Product,
  Employee,
  Vehiculo
};