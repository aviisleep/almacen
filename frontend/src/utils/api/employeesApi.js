// src/utils/employeesApi.js
import api from './api';

export const employeesApi = {
  getAll: async () => {
    try {
      const response = await api.get('/employees');
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener empleado ${id}:`, error);
      throw error;
    }
  },

  create: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error al crear empleado:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  update: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar empleado ${id}:`, error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar empleado ${id}:`, error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  getAvailableEmployees: async () => {
    try {
      const response = await api.get('/employees/available');
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener empleados disponibles:', error);
      throw error;
    }
  },

  assignVehicle: async (employeeId, vehicleId) => {
    try {
      const response = await api.post(`/employees/${employeeId}/assign-vehicle/${vehicleId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al asignar vehículo ${vehicleId} a empleado ${employeeId}:`, error);
      throw error;
    }
  },

  deliverProduct: async (employeeId, productId, quantity) => {
    try {
      const response = await api.post(`/employees/${employeeId}/deliver-product/${productId}`, { quantity });
      return response.data.data;
    } catch (error) {
      console.error(`Error al entregar producto ${productId} a empleado ${employeeId}:`, error);
      throw error;
    }
  }
};
