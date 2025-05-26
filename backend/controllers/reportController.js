const Product = require('../models/product');
const Employee = require('../models/employee');
const mongoose = require('mongoose');

// Obtener herramientas pendientes de devolución
const getPendingTools = async (req, res) => {
  try {
    const tools = await Product.find({
      esHerramienta: true,
      estado: 'En Uso'
    }).populate('asignaciones.empleado', 'nombre apellido');

    const pendingTools = tools.map(tool => {
      const activeAssignment = tool.asignaciones.find(a => !a.fechaDevolucion);
      return {
        herramienta: tool.nombre,
        SKU: tool.SKU,
        empleado: activeAssignment?.empleado?.nombre + ' ' + activeAssignment?.empleado?.apellido,
        fechaAsignacion: activeAssignment?.fechaAsignacion,
        diasEnUso: Math.floor((new Date() - new Date(activeAssignment?.fechaAsignacion)) / (1000 * 60 * 60 * 24))
      };
    });

    res.json({
      success: true,
      data: pendingTools
    });
  } catch (error) {
    console.error("Error al obtener herramientas pendientes:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

// Obtener herramientas más utilizadas
const getMostUsedTools = async (req, res) => {
  try {
    const { limit = 10, period = 'month' } = req.query;
    const dateFilter = getDateFilter(period);

    const tools = await Product.aggregate([
      {
        $match: {
          esHerramienta: true,
          'asignaciones.fechaAsignacion': { $gte: dateFilter }
        }
      },
      {
        $project: {
          nombre: 1,
          SKU: 1,
          totalAsignaciones: { $size: '$asignaciones' },
          tiempoTotalUso: {
            $sum: {
              $map: {
                input: '$asignaciones',
                as: 'asignacion',
                in: {
                  $cond: {
                    if: { $eq: ['$$asignacion.fechaDevolucion', null] },
                    then: { $subtract: [new Date(), '$$asignacion.fechaAsignacion'] },
                    else: { $subtract: ['$$asignacion.fechaDevolucion', '$$asignacion.fechaAsignacion'] }
                  }
                }
              }
            }
          }
        }
      },
      { $sort: { totalAsignaciones: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: tools
    });
  } catch (error) {
    console.error("Error al obtener herramientas más utilizadas:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

// Obtener empleados que más herramientas usan
const getTopToolUsers = async (req, res) => {
  try {
    const { limit = 10, period = 'month' } = req.query;
    const dateFilter = getDateFilter(period);

    const employees = await Employee.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'asignaciones.empleado',
          as: 'herramientas'
        }
      },
      {
        $project: {
          nombre: 1,
          apellido: 1,
          totalHerramientas: {
            $size: {
              $filter: {
                input: '$herramientas',
                as: 'herramienta',
                cond: {
                  $and: [
                    { $eq: ['$$herramienta.esHerramienta', true] },
                    { $gte: ['$$herramienta.asignaciones.fechaAsignacion', dateFilter] }
                  ]
                }
              }
            }
          }
        }
      },
      { $sort: { totalHerramientas: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error("Error al obtener empleados que más herramientas usan:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

// Obtener tiempo promedio de uso
const getAverageUsageTime = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const dateFilter = getDateFilter(period);

    const stats = await Product.aggregate([
      {
        $match: {
          esHerramienta: true,
          'asignaciones.fechaAsignacion': { $gte: dateFilter }
        }
      },
      {
        $project: {
          nombre: 1,
          SKU: 1,
          tiempoPromedio: {
            $avg: {
              $map: {
                input: '$asignaciones',
                as: 'asignacion',
                in: {
                  $cond: {
                    if: { $eq: ['$$asignacion.fechaDevolucion', null] },
                    then: { $subtract: [new Date(), '$$asignacion.fechaAsignacion'] },
                    else: { $subtract: ['$$asignacion.fechaDevolucion', '$$asignacion.fechaAsignacion'] }
                  }
                }
              }
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error al obtener tiempo promedio de uso:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

// Obtener costos de mantenimiento
const getMaintenanceCosts = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const dateFilter = getDateFilter(period);

    const maintenanceStats = await Product.aggregate([
      {
        $match: {
          esHerramienta: true,
          'historial.accion': 'Mantenimiento',
          'historial.fecha': { $gte: dateFilter }
        }
      },
      {
        $project: {
          nombre: 1,
          SKU: 1,
          totalMantenimientos: {
            $size: {
              $filter: {
                input: '$historial',
                as: 'registro',
                cond: { $eq: ['$$registro.accion', 'Mantenimiento'] }
              }
            }
          },
          ultimoMantenimiento: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$historial',
                  as: 'registro',
                  cond: { $eq: ['$$registro.accion', 'Mantenimiento'] }
                }
              },
              -1
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: maintenanceStats
    });
  } catch (error) {
    console.error("Error al obtener costos de mantenimiento:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

// Función auxiliar para obtener el filtro de fecha según el período
function getDateFilter(period) {
  const now = new Date();
  switch (period) {
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setMonth(now.getMonth() - 1));
  }
}

module.exports = {
  getPendingTools,
  getMostUsedTools,
  getTopToolUsers,
  getAverageUsageTime,
  getMaintenanceCosts
}; 