import React, { useState } from 'react';

function Bays() {
  const [bays, setBays] = useState([
    { id: 1, name: 'Bahía 1', vehicles: [] },
    { id: 2, name: 'Bahía 2', vehicles: [] },
    { id: 3, name: 'Bahía 3', vehicles: [] },
    { id: 4, name: 'Bahía 4', vehicles: [] },
    { id: 5, name: 'Bahía 5', vehicles: [] },
    { id: 6, name: 'Bahía 6', vehicles: [] },
  ]);

  const [newVehicleAssignment, setNewVehicleAssignment] = useState({
    bayId: null,
    vehicleName: '',
  });

  const [searchResult, setSearchResult] = useState(null);

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicleAssignment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchVehicle = async () => {
      const { vehicleName } = newVehicleAssignment;
  
      if (!vehicleName) {
        alert('Por favor, ingresa el nombre del vehículo para buscar.');
        return;
      }
  
      try {
        const response = await fetch(`/api/vehicles?name=${vehicleName}`);
        if (!response.ok) {
          throw new Error('Error al buscar el vehículo.');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const foundVehicle = data.find((vehicle) => vehicle.name === vehicleName);
          setSearchResult(foundVehicle || null);
          if (foundVehicle) {
            alert(`Vehículo encontrado: ${foundVehicle.name}`);
          } else {
            alert('Vehículo no encontrado.');
          }
        } else {
          alert('Respuesta inesperada del servidor.');
        }
      } catch (error) {
        console.error(error);
        alert('Hubo un error al buscar el vehículo.');
      }
    };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    const { bayId, vehicleName } = newVehicleAssignment;

    if (!bayId || !vehicleName) {
      alert('Por favor, selecciona una bahía e ingresa el nombre del vehículo.');
      return;
    }

    if (!searchResult) {
      alert('Por favor, busca y selecciona un vehículo válido antes de asignarlo.');
      return;
    }

    const updatedBays = bays.map((bay) =>
      bay.id === parseInt(bayId)
        ? {
            ...bay,
            vehicles: [...bay.vehicles, { id: searchResult.id, name: searchResult.name }],
          }
        : bay
    );

    setBays(updatedBays);
    setNewVehicleAssignment({ bayId: null, vehicleName: '' });
    setSearchResult(null);
    alert('Vehículo asignado con éxito.');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Bahías</h2>

      <form onSubmit={handleVehicleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bahía</label>
          <select
            name="bayId"
            value={newVehicleAssignment.bayId}
            onChange={handleVehicleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Selecciona una bahía</option>
            {bays.map((bay) => (
              <option key={bay.id} value={bay.id}>
                {bay.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Vehículo</label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="vehicleName"
              value={newVehicleAssignment.vehicleName}
              onChange={handleVehicleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={searchVehicle}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Asignar Vehículo
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Bahías y Vehículos</h3>
        {bays.map((bay) => (
          <div key={bay.id} className="mb-4">
            <h4 className="text-md font-bold">{bay.name}</h4>
            <ul className="list-disc pl-5">
              {bay.vehicles.map((vehicle) => (
                <li key={vehicle.id}>{vehicle.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bays;
