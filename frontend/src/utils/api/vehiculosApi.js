const BASE_URL = 'http://localhost:5000/api/vehiculos'; // Ajusta si tu endpoint cambia

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al procesar la solicitud.');
  }
  return response.json();
};

// Obtener todos los vehículos
export const getVehiculos = async () => {
  const response = await fetch(`${BASE_URL}`);
  return handleResponse(response);
};

// Obtener un vehículo por ID
export const getVehiculoById = async (vehiculoId) => {
  const response = await fetch(`${BASE_URL}/${vehiculoId}`);
  return handleResponse(response);
};

// Crear un nuevo vehículo
export const createVehiculo = async (vehiculoData) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehiculoData),
  });
  return handleResponse(response);
};

// Actualizar un vehículo
export const updateVehiculo = async (vehiculoId, updatedData) => {
  const response = await fetch(`${BASE_URL}/${vehiculoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  return handleResponse(response);
};

// Asignar un empleado a un vehículo
export const assignEmpleadoToVehiculo = async (vehiculoId, empleadoData) => {
  const response = await fetch(`${BASE_URL}/${vehiculoId}/asignar-employees`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleadoData),
  });
  return handleResponse(response);
};

// Asignar productos a un vehículo
export const assignProductToVehicle = async (vehiculoId, productosData) => {
  const response = await fetch(`${BASE_URL}/${vehiculoId}/assign-products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productosData),
  });
  return handleResponse(response);
};

// Cambiar el estado de un vehículo
export const updateEstadoVehiculo = async (vehiculoId, nuevoEstado) => {
  const response = await fetch(`${BASE_URL}/${vehiculoId}/update-status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado }),
  });
  return handleResponse(response);
};

// Eliminar un vehículo
export const deleteVehiculo = async (vehiculoId) => {
  const response = await fetch(`${BASE_URL}/${vehiculoId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};
