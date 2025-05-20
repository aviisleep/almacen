import React, { useState, useEffect } from "react";

function EmployeeManager() {
  // Estados principales
  const [employees, setEmployees] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    birthDate: ""
  });
  const [selectedEmployee, setSelectedEmployee] = useState({
    deliveries: [] // Inicializa con array vacío
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    position: "",
    birthDate: ""
  });
  const [deliveryForm, setDeliveryForm] = useState({
    empleadoId: null,
    productoId: null,
    productName: "",
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
      setInventory(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error al cargar los productos: ${error.message}`);
      setInventory([]);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Si el campo que se cambia es el producto, también actualizamos el productName
    if (name === 'productoId') {
      // Busca el producto en el inventario
      const selectedProduct = inventory.find(p => p._id === value);
  
      // Actualiza el estado de newEmployee, agregando el productName basado en el producto seleccionado
      setNewEmployee((prev) => ({
        ...prev,
        [name]: value,  // Actualiza el producto seleccionado
        productName: selectedProduct ? selectedProduct.nombre : '', // Asigna el nombre del producto
      }));
    } else {
      // Si no es el producto, solo actualiza el valor como en el código original
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Agregar un nuevo empleado
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name.trim()) {
      alert("El nombre del empleado es obligatorio.");
      return;
    }
    fetchEmployees();
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
      setNewEmployee({ name: "", email: "", phone: "", position: "" });
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
    fetchEmployees();
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${employeeForm.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeForm),
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
      setEmployeeForm({ id: null, name: "", email: "", phone: "", position: "" });
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
    e.preventDefault()
    
    const { empleadoId, productoId, cantidad } = deliveryForm;

    if (!empleadoId || !productoId || !cantidad || cantidad <= 0) {
      alert("Por favor complete todos los campos correctamente");
      return;
    }

    try {
      const product = inventory.find((p) => p._id === productoId);
      
      if (!product || product.cantidad < cantidad) {
        alert("No hay suficiente cantidad disponible.");
        return;
      }

 // Preparar datos para enviar al backend (ajustar a lo que espera el modelo)
    const deliveryData = {
      empleadoId: empleadoId,
      productId: productoId,  // El modelo espera productId
      productName: product.nombre, // Asegurar que el nombre del producto se envía
      cantidad: cantidad,     // El modelo espera cantidad, no cantidad
      date: new Date().toISOString()
    };

 // Enviar solicitud al backend
  
      const response = await fetch("http://localhost:5000/api/employees/deliver-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la respuesta del servidor");
      }

       // Actualizar estados locales
      const result = await response.json();

      // 1. Actualizar inventario
    const updatedInventory = inventory.map(p => 
      p._id === productoId ? { ...p, cantidad: p.cantidad - cantidad } : p
    );
    setInventory(updatedInventory);
    
    // 2. Actualizar lista de empleados
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp._id === empleadoId 
          ? { ...emp, deliveries: [...(emp.deliveries || []), result.delivery] } 
          : emp
      )
    );
     
    // 3. Actualizar empleado seleccionado si es el mismo
    if (selectedEmployee?._id === empleadoId) {
      setSelectedEmployee(prev => ({
        ...prev,
        deliveries: [...(prev.deliveries || []), result.delivery]
      }));
    }

    fetchEmployees(); // Refrescar la lista de empleados después de la entrega

    // Cerrar modal y resetear formulario
    setIsDeliveryModalOpen(false);
    setDeliveryForm({ empleadoId: null, productoId: null, cantidad: 0 });
    
    alert("Producto asignado correctamente");
    
  } catch (error) {
    console.error("Error:", error);
    alert(`Error al asignar producto: ${error.message}`);
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
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={newEmployee.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={newEmployee.email || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            name="phone"
            value={newEmployee.phone || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cargo</label>
          <input
            type="text"
            name="position"
            value={newEmployee.position || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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

        {/* Selección del producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Producto
          </label>
          <select
            name="productoId"
            value={deliveryForm.productoId || ""}
            onChange={(e) => {
              const selectedProduct = inventory.find(p => p._id === e.target.value);
              setDeliveryForm({ 
                ...deliveryForm, 
                productoId: e.target.value,
                productName: selectedProduct ? selectedProduct.nombre : '' // Asignar el nombre del producto
              });
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Selecciona un producto</option>
            {inventory.map((product) => (
              <option key={product._id} value={product._id}>
                {product.nombre} - {product.cantidad} disponibles
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            name="cantidad"
            value={deliveryForm.cantidad}
            onChange={(e) =>
              setDeliveryForm({ ...deliveryForm, cantidad: +e.target.value })
            }
            min="1"
            max={
              inventory.find(
                (product) => product._id === deliveryForm.productoId
              )?.cantidad || 0
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => setIsDeliveryModalOpen(false)}
            className="py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        {/* Campo Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <input
            type="text"
            name="name"
            value={employeeForm.name}
            onChange={(e) =>
              setEmployeeForm({ ...employeeForm, name: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Campo Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={employeeForm.email}
            onChange={(e) =>
              setEmployeeForm({ ...employeeForm, email: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Campo Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={employeeForm.phone}
            onChange={(e) =>
              setEmployeeForm({ ...employeeForm, phone: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Campo Cargo/Posición */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cargo/Posición
          </label>
          <input
            type="text"
            name="position"
            value={employeeForm.position}
            onChange={(e) =>
              setEmployeeForm({ ...employeeForm, position: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Campo Fecha de Nacimiento (si aplica) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            name="birthDate"
            value={employeeForm.birthDate || ''}
            onChange={(e) =>
              setEmployeeForm({ ...employeeForm, birthDate: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-4">
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
                      setEmployeeForm({
                        id: employee._id,
                        name: employee.name,         // <-- Campo correcto
                        email: employee.email || "",
                        phone: employee.phone || "",
                        position: employee.position || "",
                        birthDate: employee.birthDate || ""
                      });
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
    
    {/* Historial de entregas - Versión segura */}
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
          {selectedEmployee.deliveries?.length > 0 ? (
            selectedEmployee.deliveries
              .filter(delivery => delivery) // Filtra entregas undefined
              .map((delivery) => (
                <tr key={delivery?.productId || delivery?._id || Math.random()}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery?.productName || 
                    (inventory.find((p) => p?._id === delivery?.productId)?.nombre || "Producto no especificado")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery?.cantidad ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery?.date ? new Date(delivery.date).toLocaleDateString() : "Sin fecha"}
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