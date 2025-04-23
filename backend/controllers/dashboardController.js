// src/controllers/dashboardController.js
const Employee = require('../models/Employee');
const Product = require('../models/Product');
const Bay = require('../models/Bay');
const Vehicle = require('../models/Vehiculo');

const getDashboardStats = async (req, res) => {
  try {
    // Contar empleados
    const totalEmployees = await Employee.countDocuments();

    // Contar productos en stock
    const totalProductsInStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$cantidad' } } },
    ]);
    const totalStock = totalProductsInStock.length > 0 ? totalProductsInStock[0].total : 0;

    // Contar bahías ocupadas
    const totalBaysOccupied = await Bay.countDocuments({ estado: 'ocupada' });

    // Contar vehículos asignados
    const totalVehiclesAssigned = await Vehicle.countDocuments({ estado: 'cotizacion' });

    res.status(200).json({
      totalEmployees,
      totalProductsInStock: totalStock,
      totalBaysOccupied,
      totalVehiclesAssigned,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error.message);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { getDashboardStats };