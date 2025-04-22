import React, { useState, useEffect } from "react";

function EmployeeManager() {
  // Estados principales
  const [employees, setEmployees] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ nombre: "" });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false); // Estado añadido
  const [employeeForm, setEmployeeForm] = useState({ id: null, nombre: "" });
  const [deliveryForm, setDeliveryForm] = useState({
    empleadoId: null,
    productoId: null,
    cantidad: 0,
  });

  // Cargar datos iniciales desde el backend
  useEffect(() => {
    fetchEmployees();
    fetchProducts();
  }, []);

  // Obtener la lista de empleados
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employees");
      if (!response.ok) throw new Error("Error al cargar los empleados");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error al cargar los empleados: ${error.message}`);
    }
  };

  // Obtener la lista de productos
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Error al cargar los productos");
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error al cargar los productos: ${error.message}`);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar un nuevo empleado
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name.trim()) {
      alert("El nombre del empleado es obligatorio.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el empleado");
      }

      const data = await response.json();
      setEmployees([...employees, data]);
      setNewEmployee({ name: "" });
      setIsAddModalOpen(false);
      alert("Empleado agregado correctamente.");
    } catch (error) {
      alert(`Error al agregar el empleado: ${error.message}`);
    }
  };

  // Editar un empleado existente
  const handleEditEmployee = async (e) => {
    e.preventDefault();
    if (!employeeForm.name.trim()) {
      alert("El nombre del empleado es obligatorio.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${employeeForm.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: employeeForm.name }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al editar el empleado");
      }

      const updatedEmployee = await response.json();
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === updatedEmployee._id ? updatedEmployee : emp))
      );
      setEmployeeForm({ id: null, nombre: "" });
      setIsEditModalOpen(false);
      alert("Empleado editado correctamente.");
    } catch (error) {
      alert(`Error al editar el empleado: ${error.message}`);
    }
  };

  // Eliminar un empleado
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este empleado?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el empleado");
      }

      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      alert("Empleado eliminado correctamente.");
    } catch (error) {
      alert(`Error al eliminar el empleado: ${error.message}`);
    }
  };

  // Asignar un producto a un empleado
  const assignProductToEmployee = async (e) => {
    e.preventDefault();

    const { empleadoId, productoId, cantidad } = deliveryForm;

    if (!empleadoId || !productoId || cantidad <= 0) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    try {
      const product = inventory.find((p) => p._id === productoId);
      if (!product || product.cantidad < cantidad) {
        alert("No hay suficiente cantidad disponible.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/deliver-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al asignar el producto");
      }

      // Actualizar inventario local
      const updatedInventory = inventory.map((p) =>
        p._id === productoId ? { ...p, cantidad: p.cantidad - cantidad } : p
      );
      setInventory(updatedInventory);

      // Actualizar empleados localmente
      const updatedEmployees = employees.map((emp) =>
        emp._id === empleadoId
          ? {
              ...emp,
              deliveries: [
                ...(emp.deliveries || []),
                {
                  productId: productoId,
                  productName: product.nombre,
                  cantidad,
                  date: new Date().toISOString(),
                },
              ],
            }
          : emp
      );
      setEmployees(updatedEmployees);

      setDeliveryForm({ empleadoId: null, productoId: null, cantidad: 0 });
      setIsDeliveryModalOpen(false);
      alert("Producto asignado correctamente.");
    } catch (error) {
      alert(`Error al asignar el producto: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Empleados</h2>

      {/* Botón para abrir el modal de agregar empleado */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Agregar Empleado
      </button>

      {/* Botón para abrir el modal de asignar productos */}
      <button
        onClick={() => setIsDeliveryModalOpen(true)}
        className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Asignar Producto
      </button>

      {/* Modal para agregar empleado */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsAddModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto z-50">
            <h3 className="text-lg font-semibold mb-4">Agregar Empleado</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para asignar productos */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsDeliveryModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto z-50">
            <h3 className="text-lg font-semibold mb-4">Asignar Producto a Empleado</h3>
            <form onSubmit={assignProductToEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Empleado
                </label>
                <select
                  name="empleadoId"
                  value={deliveryForm.empleadoId || ""}
                  onChange={(e) =>
                    setDeliveryForm({ ...deliveryForm, empleadoId: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecciona un empleado</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Producto
                </label>
                <select
                  name="productoId"
                  value={deliveryForm.productoId || ""}
                  onChange={(e) =>
                    setDeliveryForm({ ...deliveryForm, productoId: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecciona un producto</option>
                  {inventory.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.nombre} (Stock: {product.cantidad})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={deliveryForm.cantidad || ""}
                  onChange={(e) =>
                    setDeliveryForm({ ...deliveryForm, cantidad: parseInt(e.target.value) || 0 })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar empleado */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto z-50">
            <h3 className="text-lg font-semibold mb-4">Editar Empleado</h3>
            <form onSubmit={handleEditEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={employeeForm.nombre}
                  onChange={(e) =>
                    setEmployeeForm({ ...employeeForm, nombre: e.target.value })
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

      {/* Tabla de empleados */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Lista de Empleados</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 cursor-pointer"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  {employee.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => {
                      setEmployeeForm({ id: employee._id, nombre: employee.nombre });
                      setIsEditModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detalles del empleado seleccionado */}
      {selectedEmployee && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Detalles del Empleado</h3>
          <p className="text-sm text-gray-700">
            <strong>Nombre:</strong> {selectedEmployee.name}
          </p>
          {/* Historial de entregas */}
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Historial de Entregas</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedEmployee.deliveries && selectedEmployee.deliveries.length > 0 ? (
                  selectedEmployee.deliveries.map((delivery, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {delivery.productName || 
                         (inventory.find((p) => p._id === delivery.productId)?.nombre || "Producto no encontrado")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {delivery.cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(delivery.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      No hay entregas registradas para este empleado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeManager;