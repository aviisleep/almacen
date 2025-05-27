import api from './api';

export const toolsApi = {
  // Obtener todas las herramientas
  getAll: async () => {
    try {
      const response = await api.get('/tools');
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener herramientas:', error);
      throw error;
    }
  },

  // Obtener una herramienta por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/tools/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener herramienta ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva herramienta
  create: async (toolData) => {
    try {
      const response = await api.post('/tools', toolData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear herramienta:', error);
      throw error;
    }
  },

  // Actualizar una herramienta
update: async (id, toolData) => {
    try {
      const toolId = typeof id === 'object' ? id.id : id; // Extrae el ID si es un objeto
      if (!toolId || typeof toolId !== 'string') {
        throw new Error('ID de herramienta inválido');
      }
      const response = await api.put(`/tools/${toolId}`, toolData);
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar herramienta ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una herramienta
delete: async (id) => {
    try {
      const response = await api.delete(`/tools/${id}`);
      return {
        success: true,
        message: response.data.message || 'Herramienta eliminada correctamente'
      };
    } catch (error) {
      console.error(`Error al eliminar herramienta ${id}:`, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });

      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar herramientas. Por favor, contacta al administrador.');
      } else if (error.response?.status === 401) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 404) {
        throw new Error('La herramienta no fue encontrada.');
      } else {
        throw new Error(error.response?.data?.message || 'Error al eliminar la herramienta');
      }
    }
  },

  // Asignar una herramienta a un empleado
  assign: async (toolId, employeeId, observaciones = '') => {
    try {
      const response = await api.post(`/tools/${toolId}/assign`, { 
        employeeId,
        observaciones 
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error al asignar herramienta ${toolId} a empleado ${employeeId}:`, error);
      throw error;
    }
  },

  // Devolver una herramienta
  return: async (toolId, estado = '', observaciones = '') => {
    try {
      const response = await api.post(`/tools/${toolId}/return`, { estado, observaciones });
      return response.data.data;
    } catch (error) {
      console.error(`Error al devolver herramienta ${toolId}:`, error);
      throw error;
    }
  },

  // Obtener herramientas disponibles
  getAvailable: async () => {
    try {
      const response = await api.get('/tools/available');
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener herramientas disponibles:', error);
      throw error;
    }
  },

  // Obtener herramientas asignadas
  getAssigned: async () => {
    try {
      const response = await api.get('/tools/assigned');
      console.log('Respuesta de herramientas asignadas:', response);
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener herramientas asignadas:', error);
      throw error;
    }
  },

  // Registrar mantenimiento
  registerMaintenance: async (toolId, mantenimientoData) => {
    try {
      const response = await api.post(`/tools/${toolId}/maintenance`, mantenimientoData);
      return response.data.data;
    } catch (error) {
      console.error(`Error al registrar mantenimiento para herramienta ${toolId}:`, error);
      throw error;
    }
  },

  // Obtener herramientas más utilizadas
  getMostUsed: async (period = 'mes', limit = 5) => {
    try {
      const response = await api.get('/tools/stats/most-used', {
        params: { period, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener herramientas más utilizadas:', error);
      throw error;
    }
  },

  // Obtener usuarios que más utilizan herramientas
  getTopUsers: async (period = 'mes', limit = 5) => {
    try {
      const response = await api.get('/tools/stats/top-users', {
        params: { period, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener usuarios que más utilizan herramientas:', error);
      throw error;
    }
  },

  // Obtener tiempo promedio de uso
  getAverageUsageTime: async (period = 'mes') => {
    try {
      const response = await api.get('/tools/stats/average-usage', {
        params: { period }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener tiempo promedio de uso:', error);
      throw error;
    }
  },

  // Obtener costos de mantenimiento
  getMaintenanceCosts: async (period = 'mes') => {
    try {
      const response = await api.get('/tools/stats/maintenance-costs', {
        params: { period }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener costos de mantenimiento:', error);
      throw error;
    }
  }
}; 