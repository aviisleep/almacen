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

      // Validar firmas
      if (!formData.firmas?.encargado || !formData.firmas?.conductor) {
        throw new Error('Las firmas son obligatorias');
      }

      // Función para convertir DataURL a Blob
      const dataURLtoBlob = (dataURL) => {
        if (!dataURL || typeof dataURL !== 'string') {
          console.error('DataURL inválido:', dataURL);
          return null;
        }

        try {
          // Verificar que el DataURL tenga el formato correcto
          if (!dataURL.startsWith('data:')) {
            console.error('DataURL no comienza con "data:"');
            return null;
          }

          const arr = dataURL.split(',');
          if (arr.length !== 2) {
            console.error('DataURL mal formado');
            return null;
          }

          const mimeMatch = arr[0].match(/:(.*?);/);
          if (!mimeMatch) {
            console.error('No se pudo extraer el tipo MIME del DataURL');
            return null;
          }

          const mime = mimeMatch[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          
          return new Blob([u8arr], { type: mime });
        } catch (error) {
          console.error('Error convirtiendo firma:', error);
          return null;
        }
      };

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

      // Agregar firmas como Blobs
      const blobEncargado = dataURLtoBlob(formData.firmas.encargado);
      const blobConductor = dataURLtoBlob(formData.firmas.conductor);

      if (!blobEncargado || !blobConductor) {
        throw new Error('Error al procesar las firmas. Por favor, asegúrese de que las firmas sean válidas.');
      }

      dataToSend.append('firmaEncargado', blobEncargado, 'firma-encargado.png');
      dataToSend.append('firmaConductor', blobConductor, 'firma-conductor.png');

      // Realizar la solicitud POST
      const response = await api.post('/ingresos', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al crear ingreso:', {
        message: error.message,
        formData: {
          ...formData,
          fotosEntrada: `Array(${formData.fotosEntrada?.length || 0})`,
          firmas: '[Object]',
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