const Tool = require('../models/tool');
const Employee = require('../models/Employee');
const { sendResponse, handleError } = require('../utils/responseHandler');

// Obtener todas las herramientas
const getAllTools = async (req, res) => {
  try {
    const tools = await Tool.find({ activa: true });
    sendResponse(res, 200, { data: tools });
  } catch (error) {
    handleError(res, error, 'Error al obtener herramientas');
  }
};

// Obtener una herramienta por ID
const getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return sendResponse(res, 404, { message: 'Herramienta no encontrada' });
    }
    sendResponse(res, 200, { data: tool });
  } catch (error) {
    handleError(res, error, 'Error al obtener herramienta');
  }
};

// Obtener herramientas disponibles
const getAvailableTools = async (req, res) => {
  try {
    const tools = await Tool.find({ estado: 'stock' }).populate('assignedTo', 'name');
    sendResponse(res, 200, { data: tools });
  } catch (error) {
    handleError(res, error, 'Error al obtener herramientas disponibles');
  }
};

// Obtener herramientas asignadas
const getAssignedTools = async (req, res) => {
  try {
    const tools = await Tool.find({ estado: 'en_uso' }).populate('assignedTo', 'name');
    sendResponse(res, 200, { data: tools });
  } catch (error) {
    handleError(res, error, 'Error al obtener herramientas asignadas');
  }
};

// Obtener historial de una herramienta
const getToolHistory = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return sendResponse(res, 404, { message: 'Herramienta no encontrada' });
    }
    sendResponse(res, 200, { data: tool.historial });
  } catch (error) {
    handleError(res, error, 'Error al obtener historial');
  }
};

// Obtener herramientas más utilizadas
const getMostUsedTools = async (req, res) => {
  try {
    const { period = 'mes', limit = 5 } = req.query;
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - (period === 'mes' ? 1 : period === 'año' ? 12 : 6));

    const tools = await Tool.aggregate([
      { $match: { 'historial.fecha': { $gte: dateLimit } } },
      {
        $project: {
          nombre: 1,
          SKU: 1,
          usoCount: {
            $size: {
              $filter: {
                input: '$historial',
                as: 'h',
                cond: { $gte: ['$$h.fecha', dateLimit] }
              }
            }
          }
        }
      },
      { $sort: { usoCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    sendResponse(res, 200, { data: tools });
  } catch (error) {
    handleError(res, error, 'Error al obtener herramientas más utilizadas');
  }
};

// Obtener usuarios que más utilizan herramientas
const getTopToolUsers = async (req, res) => {
  try {
    const { period = 'mes', limit = 5 } = req.query;
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - (period === 'mes' ? 1 : period === 'año' ? 12 : 6));

    const users = await Tool.aggregate([
      { $unwind: '$historial' },
      { $match: { 'historial.fecha': { $gte: dateLimit } } },
      {
        $group: {
          _id: '$historial.empleado',
          usoCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'empleado'
        }
      },
      {
        $project: {
          _id: 1,
          nombre: { $arrayElemAt: ['$empleado.nombre', 0] },
          usoCount: 1
        }
      },
      { $sort: { usoCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    sendResponse(res, 200, { data: users });
  } catch (error) {
    handleError(res, error, 'Error al obtener usuarios que más utilizan herramientas');
  }
};

// Obtener tiempo promedio de uso
const getAverageUsageTime = async (req, res) => {
  try {
    const { period = 'mes' } = req.query;
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - (period === 'mes' ? 1 : period === 'año' ? 12 : 6));

    const stats = await Tool.aggregate([
      { $match: { 'historial.fecha': { $gte: dateLimit } } },
      {
        $project: {
          nombre: 1,
          SKU: 1,
          tiempoPromedio: {
            $avg: {
              $map: {
                input: {
                  $filter: {
                    input: '$historial',
                    as: 'h',
                    cond: { $gte: ['$$h.fecha', dateLimit] }
                  }
                },
                as: 'registro',
                in: {
                  $subtract: [
                    { $ifNull: ['$$registro.fechaDevolucion', new Date()] },
                    '$$registro.fecha'
                  ]
                }
              }
            }
          }
        }
      }
    ]);

    const promedioTiempoUso = stats.reduce((acc, curr) => acc + (curr.tiempoPromedio || 0), 0) / stats.length;

    sendResponse(res, 200, {
      data: {
        promedioTiempoUso: promedioTiempoUso / (1000 * 60 * 60) // Convertir a horas
      }
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener tiempo promedio de uso');
  }
};

// Obtener costos de mantenimiento
const getMaintenanceCosts = async (req, res) => {
  try {
    const { period = 'mes' } = req.query;
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - (period === 'mes' ? 1 : period === 'año' ? 12 : 6));

    const maintenanceStats = await Tool.aggregate([
      { $match: { 'mantenimientos.fecha': { $gte: dateLimit } } },
      {
        $project: {
          nombre: 1,
          SKU: 1,
          costoTotal: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$mantenimientos',
                    as: 'm',
                    cond: { $gte: ['$$m.fecha', dateLimit] }
                  }
                },
                as: 'mantenimiento',
                in: '$$mantenimiento.costo'
              }
            }
          }
        }
      }
    ]);

    const costoTotal = maintenanceStats.reduce((acc, curr) => acc + (curr.costoTotal || 0), 0);

    sendResponse(res, 200, {
      data: {
        costoTotal
      }
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener costos de mantenimiento');
  }
};

// Crear una nueva herramienta
const createTool = async (req, res) => {
  try {
    const tool = new Tool(req.body);
    const savedTool = await tool.save();
    sendResponse(res, 201, {
      data: savedTool,
      message: 'Herramienta creada correctamente'
    });
  } catch (error) {
    handleError(res, error, 'Error al crear herramienta');
  }
};

// Actualizar una herramienta
const updateTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!tool) {
      return sendResponse(res, 404, { message: 'Herramienta no encontrada' });
    }
    sendResponse(res, 200, {
      data: tool,
      message: 'Herramienta actualizada correctamente'
    });
  } catch (error) {
    handleError(res, error, 'Error al actualizar herramienta');
  }
};

// Eliminar una herramienta (soft delete)
const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { activa: false },
      { new: true }
    );
    if (!tool) {
      return sendResponse(res, 404, { message: 'Herramienta no encontrada' });
    }
    sendResponse(res, 200, {
      message: 'Herramienta eliminada correctamente'
    });
  } catch (error) {
    handleError(res, error, 'Error al eliminar herramienta');
  }
};

// Asignar herramienta
const assignTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return sendResponse(res, 404, { message: 'Herramienta no encontrada' });
    }
    await tool.assign(req.body.employeeId, req.body.observaciones);
    sendResponse(res, 200, {
      data: tool,
      message: 'Herramienta asignada correctamente'
    });
  } catch (error) {
    handleError(res, error, 'Error al asignar herramienta');
  }
};

// Devolver herramienta
const returnTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return sendResponse(res, 404, { message: 'Herramienta no encontrada' });
    }
    await tool.return(req.body.estado, req.body.observaciones);
    sendResponse(res, 200, {
      data: tool,
      message: 'Herramienta devuelta correctamente'
    });
  } catch (error) {
    handleError(res, error, 'Error al devolver herramienta');
  }
};

// Registrar mantenimiento
const registerMaintenance = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return sendResponse(res, 404, { message: 'Herramienta no encontrada' });
    }
    await tool.registerMaintenance(
      req.body.descripcion,
      req.body.costo,
      req.body.proximoMantenimiento
    );
    sendResponse(res, 200, {
      data: tool,
      message: 'Mantenimiento registrado correctamente'
    });
  } catch (error) {
    handleError(res, error, 'Error al registrar mantenimiento');
  }
};

module.exports = {
  getAllTools,
  getToolById,
  getAvailableTools,
  getAssignedTools,
  getToolHistory,
  getMostUsedTools,
  getTopToolUsers,
  getAverageUsageTime,
  getMaintenanceCosts,
  createTool,
  updateTool,
  deleteTool,
  assignTool,
  returnTool,
  registerMaintenance
};
