import React, { useState, useEffect } from "react";
import { useTools } from '../contexts/ToolsContext';
import { employeesApi } from '../utils/api/employeesApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeManager() {
  const { 
    employees, 
    loading: contextLoading, 
    error: contextError, 
    loadEmployees,
    loadTools
  } = useTools();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Formularios
  const [employeeForm, setEmployeeForm] = useState({
    _id: null,
    name: "",
    email: "",
    phone: "",
    position: "",
    birthDate: "",
    active: true
  });

  const [deliveryForm, setDeliveryForm] = useState({
    empleadoId: null,
    productoId: null,
    cantidad: 0,
  });

  // Agregar nuevo empleado
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!employeeForm.name) {
      setError('El nombre es un campo obligatorio');
      return;
    }

    if (!employeeForm.position) {
      setError('El cargo es un campo obligatorio');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar datos para enviar
      const employeeData = {
        name: employeeForm.name,
        email: employeeForm.email || null,
        phone: employeeForm.phone || null,
        position: employeeForm.position,
        birthDate: employeeForm.birthDate ? formatDateForAPI(employeeForm.birthDate) : null,
        active: employeeForm.active
      };

      const response = await employeesApi.create(employeeData);
      
      if (response?.success) {
        await loadEmployees(); // Recargar empleados después de crear uno nuevo
        setEmployeeForm({
          _id: null,
          name: "",
          email: "",
          phone: "",
          position: "",
          birthDate: "",
          active: true
        });
        setIsAddModalOpen(false);
        toast.success('Empleado creado exitosamente');
      } else {
        throw new Error(response?.message || "Error al crear el empleado");
      }
    } catch (error) {
      console.error("Error al crear empleado:", error);
      if (error.error === "EMAIL_DUPLICATE") {
        toast.error("Ya existe un empleado con este email. Por favor, use un email diferente.");
      } else {
        toast.error(error.message || "Error al crear el empleado");
      }
    } finally {
      setLoading(false);
    }
  };

  // Editar empleado existente
  const handleEditEmployee = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!employeeForm._id) {
      setError('ID de empleado no válido');
      return;
    }

    if (!employeeForm.name) {
      setError('El nombre es un campo obligatorio');
      return;
    }

    if (!employeeForm.position) {
      setError('El cargo es un campo obligatorio');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar datos para enviar
      const employeeData = {
        name: employeeForm.name,
        email: employeeForm.email || null,
        phone: employeeForm.phone || null,
        position: employeeForm.position,
        birthDate: employeeForm.birthDate ? formatDateForAPI(employeeForm.birthDate) : null,
        active: employeeForm.active
      };
      
      const response = await employeesApi.update(employeeForm._id, employeeData);

      if (response?.success) {
        await loadEmployees(); // Recargar empleados después de editar
        setEmployeeForm({
          _id: null,
          name: "",
          email: "",
          phone: "",
          position: "",
          birthDate: "",
          active: true
        });
        setIsEditModalOpen(false);
        toast.success('Empleado actualizado exitosamente');
      } else {
        throw new Error(response?.message || 'Error al editar el empleado');
      }
    } catch (error) {
      console.error("Error al editar empleado:", error);
      if (error.error === "EMAIL_DUPLICATE") {
        toast.error("Ya existe un empleado con este email. Por favor, use un email diferente.");
      } else {
        toast.error(error.message || 'Error al editar el empleado');
      }
    } finally {
      setLoading(false);
    }
  };

  // Eliminar empleado
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este empleado?")) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await employeesApi.delete(id);
      
      if (response?.success) {
        // Forzar una recarga completa de los empleados
        await loadEmployees();
        // Actualizar también las herramientas si es necesario
        await loadTools();
        toast.success('Empleado eliminado exitosamente');
      } else {
        throw new Error(response?.message || "Error al eliminar el empleado");
      }
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      toast.error(error.message || "Error al eliminar el empleado");
    } finally {
      setLoading(false);
    }
  };

  // Asignar producto a empleado
  const assignProductToEmployee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await employeesApi.deliverProduct(
        deliveryForm.empleadoId,
        deliveryForm.productoId,
        deliveryForm.cantidad
      );

      if (response?.success) {
        await Promise.all([
          loadEmployees(),
          loadTools()
        ]);
        setDeliveryForm({
          empleadoId: null,
          productoId: null,
          cantidad: 0
        });
        setIsDeliveryModalOpen(false);
        toast.success('Producto asignado exitosamente');
      } else {
        throw new Error(response?.message || "Error al asignar el producto");
      }
    } catch (error) {
      console.error("Error al asignar producto:", error);
      toast.error(error.message || "Error al asignar el producto");
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Formatear fecha para API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString();
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading || contextLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || contextError) {
    const errorMessage = error?.message || contextError?.message || 'Ha ocurrido un error';
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Agregar Empleado
        </button>
      </div>

      {/* Lista de empleados */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
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
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      console.log('Empleado seleccionado:', employee);
                      setSelectedEmployee(employee);
                      setEmployeeForm({
                        _id: employee._id,
                        name: employee.name || "",
                        email: employee.email || "",
                        phone: employee.phone || "",
                        position: employee.position || "",
                        birthDate: formatDateForInput(employee.birthDate),
                        active: employee.active || false
                      });
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
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

      {/* Modal para agregar/editar empleado */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">
              {isAddModalOpen ? 'Agregar Empleado' : 'Editar Empleado'}
            </h2>
            <form onSubmit={isAddModalOpen ? handleAddEmployee : handleEditEmployee}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                  <input
                    type="text"
                    name="name"
                    value={employeeForm.name || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={employeeForm.email || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={employeeForm.phone || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cargo</label>
                  <input
                    type="text"
                    name="position"
                    value={employeeForm.position || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formatDateForInput(employeeForm.birthDate)}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={employeeForm.active || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Activo</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setEmployeeForm({
                      _id: null,
                      name: "",
                      email: "",
                      phone: "",
                      position: "",
                      birthDate: "",
                      active: true
                    });
                  }}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isAddModalOpen ? 'Agregar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para asignar producto */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Asignar Producto</h2>
            <form onSubmit={assignProductToEmployee}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Empleado</label>
                  <select
                    value={deliveryForm.empleadoId || ''}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, empleadoId: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar empleado</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Producto</label>
                  <select
                    value={deliveryForm.productoId || ''}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, productoId: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar producto</option>
                    {contextInventory?.map(prod => (
                      <option key={prod._id} value={prod._id}>{prod.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={deliveryForm.cantidad}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, cantidad: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeliveryModalOpen(false);
                    setDeliveryForm({
                      empleadoId: null,
                      productoId: null,
                      cantidad: 0
                    });
                  }}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeManager; 