import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTools } from '../../contexts/ToolsContext';
import { formatCurrency } from '../../utils/format';
import { FaEdit, FaTrash, FaUser, FaHistory } from 'react-icons/fa';
import ToolModal from './ToolModal';
import { toast } from 'react-toastify';

export const ToolsList = () => {
  const { tools, employees, loading, error, assignTool, returnTool, deleteTool, updateTool, loadTools } = useTools();
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [returnEstado, setReturnEstado] = useState('disponible');

  const getStatusColor = (status) => {
    switch (status) {
      case 'stock':
        return 'bg-green-100 text-green-800';
      case 'en_uso':
        return 'bg-blue-100 text-blue-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'dañada':
        return 'bg-red-100 text-red-800';
      case 'reparacion_sencilla':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (tool) => {
    setSelectedTool(tool);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (toolData) => {
    try {
      await updateTool(selectedTool._id, toolData);
      setShowEditModal(false);
      setSelectedTool(null);
      toast.success('Herramienta actualizada correctamente');
      await loadTools(true); // Recargar la lista de herramientas
    } catch (error) {
      console.error('Error al actualizar la herramienta:', error);
      toast.error(error.message || 'Error al actualizar la herramienta');
    }
  };

  const handleDelete = async (toolId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta herramienta? Esta acción no se puede deshacer.')) {
      try {
        await deleteTool(toolId);
        toast.success('Herramienta eliminada correctamente');
        await loadTools(true);
      } catch (error) {
        console.error('Error al eliminar la herramienta:', error);
        toast.error(error.message || 'Error al eliminar la herramienta');
      }
    }
  };

  const handleAssign = async (toolId) => {
    setSelectedTool(toolId);
    setShowAssignModal(true);
  };

  const handleSaveAssign = async () => {
    try {
      await assignTool(selectedTool, selectedEmployee, observaciones);
      setShowAssignModal(false);
      setSelectedTool(null);
      setSelectedEmployee('');
      setObservaciones('');
      toast.success('Herramienta asignada correctamente');
      await loadTools(true); // Recargar la lista de herramientas
    } catch (error) {
      console.error('Error al asignar la herramienta:', error);
      toast.error(error.message || 'Error al asignar la herramienta');
    }
  };

  const handleReturn = async (toolId) => {
    setSelectedTool(toolId);
    setShowReturnModal(true);
  };

  const handleSaveReturn = async () => {
    try {
      await returnTool(selectedTool, returnEstado, observaciones);
      setShowReturnModal(false);
      setSelectedTool(null);
      setReturnEstado('disponible');
      setObservaciones('');
      toast.success('Herramienta devuelta correctamente');
      await loadTools(true); // Recargar la lista de herramientas
    } catch (error) {
      console.error('Error al devolver la herramienta:', error);
      toast.error(error.message || 'Error al devolver la herramienta');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar las herramientas: {error.message}</p>
      </div>
    );
  }

  if (!tools || tools.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay herramientas disponibles</p>
        <button
          onClick={() => navigate('/herramientas/nueva')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Agregar Nueva Herramienta
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Herramientas</h2>
        <div className="space-x-2">
          <button
            onClick={() => navigate('/herramientas/nueva')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Nueva Herramienta
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showHistory ? 'Ocultar Historial' : 'Mostrar Historial'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div key={tool._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{tool.nombre}</h3>
                <p className="text-sm text-gray-600">SKU: {tool.sku}</p>
                <p className="text-sm">Precio: {formatCurrency(tool.precio)}</p>
                <span className={`inline-block px-2 py-1 rounded text-sm ${getStatusColor(tool.estado)}`}>
                  {tool.estado}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(tool)}
                  className="text-yellow-500 hover:text-yellow-700"
                  title="Editar"
                >
                  <FaEdit />
                </button>
                {tool.estado === 'stock' && (
                  <button
                    onClick={() => handleAssign(tool._id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Asignar"
                  >
                    <FaUser />
                  </button>
                )}
                {tool.estado === 'en_uso' && (
                  <button
                    onClick={() => handleReturn(tool._id)}
                    className="text-green-500 hover:text-green-700"
                    title="Devolver"
                  >
                    <FaEdit />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(tool._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Eliminar"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {tool.empleadoAsignado && (
              <div className="mt-2 text-sm">
                <p className="font-semibold">Asignado a:</p>
                <p>{tool.empleadoAsignado.nombre}</p>
                <p className="text-gray-600">
                  Desde: {new Date(tool.fechaAsignacion).toLocaleDateString()}
                </p>
              </div>
            )}

            {showHistory && tool.historial && tool.historial.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Historial</h4>
                <div className="space-y-2">
                  {tool.historial.map((entry, index) => (
                    <div key={index} className="text-sm border-l-2 border-gray-200 pl-2">
                      <p className="font-medium">{entry.accion}</p>
                      <p>Empleado: {entry.empleado?.nombre || 'N/A'}</p>
                      <p>Fecha: {new Date(entry.fecha).toLocaleDateString()}</p>
                      {entry.observaciones && (
                        <p className="text-gray-600">Obs: {entry.observaciones}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <ToolModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTool(null);
          }}
          tool={selectedTool}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal de Asignación */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Asignar Herramienta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Empleado</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar empleado</option>
                  {employees && employees.length > 0 ? (
                    employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name} {employee.position ? `- ${employee.position}` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No hay empleados disponibles</option>
                  )}
                </select>
                {!selectedEmployee && (
                  <p className="mt-1 text-sm text-red-600">Debes seleccionar un empleado</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedTool(null);
                    setSelectedEmployee('');
                    setObservaciones('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAssign}
                  disabled={!selectedEmployee}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                >
                  Asignar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Devolución */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Devolver Herramienta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  value={returnEstado}
                  onChange={(e) => setReturnEstado(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="disponible">Disponible</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="dañada">Dañada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowReturnModal(false);
                    setSelectedTool(null);
                    setReturnEstado('disponible');
                    setObservaciones('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveReturn}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Devolver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 