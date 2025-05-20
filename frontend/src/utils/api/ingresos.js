import api from './api'; // Importa la instancia de Axios

export const ingresosApi = {
  // Obtener todos los ingresos
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/ingresos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener ingresos:', {
        error: error.message,
        params,
      });
      throw error;
    }
  },

  // Obtener un ingreso por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/ingresos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ingreso ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo ingreso
  create: async (formData) => {
    try {
      const dataToSend = new FormData();

      // Validar campos requeridos
      if (!formData.compania || !formData.conductor || !formData.vehiculo) {
        throw new Error('Faltan campos requeridos: compania, conductor o vehiculo');
      }

      // Agregar campos simples
      dataToSend.append('compania', formData.compania);
      if (formData.observaciones) {
        dataToSend.append('observaciones', formData.observaciones);
      }

      // Agregar objetos anidados como JSON
      dataToSend.append('conductor', JSON.stringify(formData.conductor));
      dataToSend.append('vehiculo', JSON.stringify(formData.vehiculo));

      // Agregar reparaciones solicitadas como JSON
      dataToSend.append(
        'reparacionesSolicitadas',
        JSON.stringify(formData.reparacionesSolicitadas)
      );

      // Agregar fotos
      if (formData.fotosEntrada?.length > 0) {
        formData.fotosEntrada.forEach((file) => {
          dataToSend.append('fotos', file);
        });
      }

      // Agregar firmas
      if (formData.firmas?.encargado) {
        dataToSend.append('firmaEncargado', formData.firmas.encargado, 'firma-encargado.png');
      }
      if (formData.firmas?.conductor) {
        dataToSend.append('firmaConductor', formData.firmas.conductor, 'firma-conductor.png');
      }

      // Realizar la solicitud POST
      const response = await api.post('/ingresos', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Especifica el tipo de contenido
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al crear ingreso:', {
        message: error.message,
        formData: {
          ...formData,
          fotosEntrada: `Array(${formData.fotosEntrada?.length || 0})`,
          firmas: '[Object]', // Ocultamos contenido de firmas para no saturar consola
        },
      });
      throw error;
    }
  },

  // Actualizar un ingreso existente
  update: async (id, data) => {
    try {
      const response = await api.put(`/ingresos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar ingreso ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un ingreso
  delete: async (id) => {
    try {
      const response = await api.delete(`/ingresos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar ingreso ${id}:`, error);
      throw error;
    }
  },
};