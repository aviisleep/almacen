import React, { useState, useEffect } from "react";
import api from '../utils/api/api';

function VehicleManager() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    placa: "",
    compañia: "",
    tipoVehiculo: "Trailer",
    estado: "cotizacion",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Cargar vehículos desde el backend
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehiculos");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error al cargar los vehículos:", error.message);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  // Crear o editar un vehículo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newVehicle.tipoVehiculo) {
      alert("Por favor selecciona un tipo de vehículo.");
      return;
    }
    try {
      const method = newVehicle._id ? "put" : "post";
      const url = newVehicle._id ? `/vehiculos/${newVehicle._id}` : "/vehiculos";
      
      const response = await api[method](url, newVehicle);
      await fetchVehicles(); // Recargar la lista después de crear/editar
      setIsCreateModalOpen(false);
      setNewVehicle({
        placa: "",
        compañia: "",
        tipoVehiculo: "Trailer",
        estado: "cotizacion",
      });
    } catch (error) {
      console.error("Error al guardar el vehículo:", error.message);
      alert("Error al guardar el vehículo. Por favor, intenta nuevamente.");
    }
  };

  // Abrir modal de edición
const handleEdit = (vehicle) => {
  setNewVehicle(vehicle);
  setIsCreateModalOpen(true);
};

  // Eliminar un vehículo
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este vehículo?")) return;
    try {
      const response = await api.delete(`/vehiculos/${id}`);
      await fetchVehicles();
      alert("Vehículo eliminado correctamente.");
    } catch (error) {
      alert(`Error al eliminar el vehículo: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Vehículos</h2>

      {/* Botón para abrir el modal */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
      >
        Crear Vehículo
      </button>

      {/* Modal para crear vehículos */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsCreateModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto z-50">
            <h3 className="text-lg font-semibold mb-4">Crear Vehículo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Placa
                </label>
                <input
                  type="text"
                  name="placa"
                  value={newVehicle.placa}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compañia
                </label>
                <input
                  type="text"
                  name="compañia"
                  value={newVehicle.compañia}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">
                  Tipo de Vehiculo
                </label>
                <select
                  name="tipoVehiculo"
                  value={newVehicle.tipoVehiculo}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Trailer">Trailer</option>
                  <option value="Van">Van</option>
                  <option value="Botellero">Botellero</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  name="estado"
                  value={newVehicle.estado}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="cotizacion">Cotización</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="reparado">Reparado</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de vehículos */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Placa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Compañia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vehicles.map((vehicle) => (
            <tr key={vehicle._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vehicle.placa}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vehicle.compañia}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vehicle.tipoVehiculo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vehicle.estado}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <button
    title="Editar"
    onClick={() => handleEdit(vehicle)}
    className="text-yellow-500 hover:text-yellow-700 mr-2"
  >
    ✏️
  </button>
  <button
    title="Eliminar"
    onClick={() => handleDelete(vehicle._id)}
    className="text-red-500 hover:text-red-700"
  >
    🗑️
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleManager;