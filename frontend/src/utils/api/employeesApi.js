// src/utils/employeesApi.js
import { api } from './api';

export const employeesApi = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  deliverProduct: async (employeeId, deliveryData) => {
    const response = await api.post(`/employees/${employeeId}/deliver-product`, deliveryData);
    return response.data;
  },

  assignVehicle: async (employeeId, vehicleData) => {
    const response = await api.put(`/employees/${employeeId}/asignar-employee`, vehicleData);
    return response.data;
  }
};
