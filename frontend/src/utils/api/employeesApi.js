// src/utils/employeesApi.js
const BASE_URL = 'http://localhost:5000/api/employees'; // Endpoint raíz para empleados

// Función genérica para manejar errores
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la solicitud.');
  }
  return response.json();
};

// Obtener todos los empleados
export const getAllEmployees = async () => {
  const response = await fetch(`${BASE_URL}`);
  return handleResponse(response);
};

// Obtener un solo empleado por ID
export const getEmployeeById = async (employeeId) => {
  const response = await fetch(`${BASE_URL}/${employeeId}`);
  return handleResponse(response);
};

// Crear un nuevo empleado
export const createEmployee = async (employeeData) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employeeData),
  });
  return handleResponse(response);
};

// Actualizar un empleado
export const updateEmployee = async (employeeId, updatedData) => {
  const response = await fetch(`${BASE_URL}/${employeeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  return handleResponse(response);
};

// Eliminar un empleado
export const deleteEmployee = async (employeeId) => {
  const response = await fetch(`${BASE_URL}/${employeeId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Entregar un producto a un empleado
export const deliverProductToEmployee = async (employeeId, deliveryData) => {
  const response = await fetch(`${BASE_URL}/${employeeId}/deliver-product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deliveryData),
  });
  return handleResponse(response);
};

// Asignar vehículo a un empleado
export const assignVehicleToEmployee = async (employeeId, vehicleData) => {
  const response = await fetch(`${BASE_URL}/${employeeId}/asignar-employee`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicleData),
  });
  return handleResponse(response);
};
