import React, { useState, useEffect } from "react";

export default function ProveedorManager() {
  const [proveedores, setProveedores] = useState([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: "",
    empresa: "",
    direccion: "",
    numero: null,
    nit: "",
    metodoPago: {
      numeroCuenta: "",
      nombreBanco: "",
    },
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [proveedorEnEdicion, setProveedorEnEdicion] = useState(null);

  // Cargar proveedores desde el backend
  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/proveedores");
      const data = await response.json();
      console.log("Datos recibidos del backend:", data);
      setProveedores(data);
    } catch (error) {
      console.error("Error al cargar los proveedores:", error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("metodoPago.")) {
      const campo = name.split(".")[1];
      setNuevoProveedor((prev) => ({
        ...prev,
        metodoPago: { ...prev.metodoPago, [campo]: value || "" },
      }));
    } else {
      setNuevoProveedor((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Crear un nuevo proveedor
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/proveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProveedor),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el proveedor");
      }

      const data = await response.json();
      setProveedores([...proveedores, data.data]);
      setNuevoProveedor({
        nombre: "",
        empresa: "",
        direccion: "",
        numero: null,
        nit: "",
        metodoPago: {
          numeroCuenta: "",
          nombreBanco: "",
        },
      });
      setIsCreateModalOpen(false);
      alert("Proveedor creado correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  // Editar un proveedor
  const openEditModal = (proveedor) => {
    setProveedorEnEdicion({ ...proveedor });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/proveedores/${proveedorEnEdicion._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(proveedorEnEdicion),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al editar el proveedor");
      }

      const data = await response.json();
      setProveedores((prevProveedores) =>
        prevProveedores.map((p) => (p._id === data.data._id ? data.data : p))
      );
      setIsEditModalOpen(false);
      alert("Proveedor editado correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  // Eliminar un proveedor
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/proveedores/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el proveedor");
      }

      setProveedores(proveedores.filter((p) => p._id !== id));
      alert("Proveedor eliminado correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  // Abrir modal de detalles
  const openDetailsModal = (proveedor) => {
    setSelectedProveedor(proveedor);
    setIsDetailsModalOpen(true);
  };

  // Cerrar modal de detalles
  const closeDetailsModal = () => {
    setSelectedProveedor(null);
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Botón para abrir el modal de creación */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-4"
      >
        Crear Proveedor
      </button>

      {/* Tabla de proveedores */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empresa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dirección
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
  {proveedores.length > 0 ? (
    proveedores
      .filter((proveedor) => proveedor && proveedor._id) // Filtra elementos inválidos
      .map((proveedor) => (
        <tr key={proveedor._id}>
          <td
            className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer"
            onClick={() => openDetailsModal(proveedor)}
          >
            {proveedor.nombre}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proveedor.empresa}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proveedor.direccion}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proveedor.numero}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex space-x-2">
            <button
              title="Editar"
              className="text-yellow-500 hover:text-yellow-700"
              onClick={() => openEditModal(proveedor)}
            >
              ✏️
            </button>
            <button
              title="Eliminar"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(proveedor._id)}
            >
              🗑️
            </button>
          </td>
        </tr>
      ))
  ) : (
    <tr>
      <td colSpan="4" className="text-center">
        No hay proveedores disponibles.
      </td>
    </tr>
  )}
</tbody>
      </table>

      {/* Modal para crear proveedores */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsCreateModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto z-50">
            <h3 className="text-lg font-semibold mb-4">Crear Proveedor</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={nuevoProveedor.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={nuevoProveedor.empresa}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={nuevoProveedor.direccion}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número</label>
                <input
                  type="number"
                  name="numero"
                  value={nuevoProveedor.numero}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">NIT</label>
                <input
                  type="text"
                  name="nit"
                  value={nuevoProveedor.nit}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Cuenta</label>
                <input
                  type="text"
                  name="metodoPago.numeroCuenta"
                  value={nuevoProveedor.metodoPago.numeroCuenta}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Banco</label>
                <input
                  type="text"
                  name="metodoPago.nombreBanco"
                  value={nuevoProveedor.metodoPago.nombreBanco}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
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
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar proveedores */}
      {isEditModalOpen && proveedorEnEdicion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto z-50">
            <h3 className="text-lg font-semibold mb-4">Editar Proveedor</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={proveedorEnEdicion.nombre}
                  onChange={(e) =>
                    setProveedorEnEdicion((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={proveedorEnEdicion.empresa}
                  onChange={(e) =>
                    setProveedorEnEdicion((prev) => ({ ...prev, empresa: e.target.value }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={proveedorEnEdicion.direccion}
                  onChange={(e) =>
                    setProveedorEnEdicion((prev) => ({ ...prev, direccion: e.target.value }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número</label>
                <input
                  type="number"
                  name="numero"
                  value={proveedorEnEdicion.numero}
                  onChange={(e) =>
                    setProveedorEnEdicion((prev) => ({ ...prev, numero: e.target.value }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">NIT</label>
                <input
                  type="text"
                  name="nit"
                  value={proveedorEnEdicion.nit}
                  onChange={(e) =>
                    setProveedorEnEdicion((prev) => ({ ...prev, nit: e.target.value }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Cuenta</label>
                <input
                  type="text"
                  name="metodoPago.numeroCuenta"
                  value={proveedorEnEdicion.metodoPago.numeroCuenta}
                  onChange={(e) =>
                    setProveedorEnEdicion((prev) => ({
                      ...prev,
                      metodoPago: { ...prev.metodoPago, numeroCuenta: e.target.value },
                    }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Banco</label>
                <input
                  type="text"
                  name="metodoPago.nombreBanco"
                  value={proveedorEnEdicion.metodoPago.nombreBanco}
                  onChange={(e) =>
                    setProveedorEnEdicion((prev) => ({
                      ...prev,
                      metodoPago: { ...prev.metodoPago, nombreBanco: e.target.value },
                    }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para ver detalles del proveedor */}
      {isDetailsModalOpen && selectedProveedor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeDetailsModal}
          ></div>
          <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto z-50">
            <h3 className="text-lg font-semibold mb-4">Detalles del Proveedor</h3>
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {selectedProveedor.nombre}</p>
              <p><strong>Empresa:</strong> {selectedProveedor.empresa}</p>
              <p><strong>Dirección:</strong> {selectedProveedor.direccion}</p>
              <p><strong>Número:</strong> {selectedProveedor.numero}</p>
              <p><strong>NIT:</strong> {selectedProveedor.nit}</p>
              <p><strong>Número de Cuenta:</strong> {selectedProveedor.metodoPago.numeroCuenta}</p>
              <p><strong>Nombre del Banco:</strong> {selectedProveedor.metodoPago.nombreBanco}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeDetailsModal}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}