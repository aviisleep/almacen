import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTools } from '../../contexts/ToolsContext';
import { formatCurrency } from '../../utils/format';
import { FaEdit, FaTrash, FaUser, FaHistory, FaTools } from 'react-icons/fa';
import ToolModal from './ToolModal';
import { toast } from 'react-toastify';

export const ToolsList = () => {
  const { 
    tools, 
    loading: contextLoading, 
    error: contextError, 
    loadTools,
    deleteTool,
    assignTool,
    returnTool,
    updateTool,
    employees
  } = useTools();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [returnEstado, setReturnEstado] = useState('stock');
  const [localLoading, setLocalLoading] = useState(false);

  // Función para traducir estados
  const translateStatus = (status) => {
    const statusMap = {
      'stock': 'En Stock',
      'en_uso': 'En Uso',
      'dañada': 'Dañada',
      'mantenimiento': 'En Mantenimiento',
      'reparacion_sencilla': 'En Reparación Sencilla'
    };
    return statusMap[status] || status;
  };

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

  const handleSaveEdit = async (toolId, updatedData) => {
    try {
      await updateTool(toolId, updatedData);
      toast.success('Herramienta actualizada correctamente');
      await loadTools(true);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error al actualizar la herramienta:', error);
      toast.error(error.message || 'Error al actualizar la herramienta');
    }
  };

  const handleDelete = async (toolId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta herramienta?')) {
      try {
        setLocalLoading(true);
        await deleteTool(toolId);
        toast.success('Herramienta eliminada correctamente');
        await loadTools(true);
      } catch (error) {
        console.error('Error al eliminar la herramienta:', error);
        toast.error(error.message || 'Error al eliminar la herramienta');
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleAssign = (tool) => {
    setSelectedTool(tool);
    setShowAssignModal(true);
  };

  const handleSaveAssign = async () => {
    if (!selectedEmployee) {
      toast.error('Debes seleccionar un empleado');
      return;
    }

    try {
      await assignTool(selectedTool._id, selectedEmployee, observaciones);
      toast.success('Herramienta asignada correctamente');
      setShowAssignModal(false);
      setSelectedEmployee('');
      setObservaciones('');
      await loadTools(true);
    } catch (error) {
      console.error('Error al asignar la herramienta:', error);
      toast.error(error.message || 'Error al asignar la herramienta');
    }
  };

  const handleReturn = (tool) => {
    setSelectedTool(tool);
    setShowReturnModal(true);
  };

  const handleSaveReturn = async () => {
    try {
      await returnTool(selectedTool._id, returnEstado, observaciones);
      toast.success('Herramienta devuelta correctamente');
      setShowReturnModal(false);
      setReturnEstado('stock');
      setObservaciones('');
      await loadTools(true);
    } catch (error) {
      console.error('Error al devolver la herramienta:', error);
      toast.error(error.message || 'Error al devolver la herramienta');
    }
  };

  const getEmployeeName = (employee) => {
    return employee?.name || 'Empleado no disponible';
  };

  if (contextLoading || localLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (contextError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar las herramientas: {contextError.message}</p>
      </div>
    );
  }

  if (!tools || tools.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <FaTools className="text-gray-400 text-4xl" />
        </div>
        <p className="text-gray-500 mb-4">No hay herramientas registradas</p>
        <button
          onClick={() => navigate('/herramientas/nueva')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Agregar Nueva Herramienta
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Herramientas</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/herramientas/nueva')}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            <FaTools /> Nueva Herramienta
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              showHistory ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FaHistory /> {showHistory ? 'Ocultar Historial' : 'Mostrar Historial'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div key={tool._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-gray-800">{tool.nombre}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tool.estado)}`}>
                    {translateStatus(tool.estado)}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">SKU:</span> {tool.sku}</p>
                  <p><span className="font-medium">Precio:</span> {formatCurrency(tool.precio)}</p>
                  <p><span className="font-medium">Categoría:</span> {tool.categoria}</p>
                  <p><span className="font-medium">Proveedor:</span> {tool.proveedor}</p>
                  {tool.ubicacion && (
                    <p><span className="font-medium">Ubicación:</span> {tool.ubicacion}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleEdit(tool)}
                  className="text-yellow-600 hover:text-yellow-800 p-1"
                  title="Editar"
                >
                  <FaEdit size={16} />
                </button>
                
                {tool.estado === 'stock' ? (
                  <button
                    onClick={() => handleAssign(tool)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Asignar"
                  >
                    <FaUser size={16} />
                  </button>
                ) : tool.estado === 'en_uso' && (
                  <button
                    onClick={() => handleReturn(tool)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title="Devolver"
                  >
                    <FaHistory size={16} />
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(tool._id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Eliminar"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>

            {tool.assignedTo && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                <p className="font-medium">Asignada a:</p>
                <p>{getEmployeeName(tool.assignedTo)}</p>
                {tool.historial && tool.historial.length > 0 && (
                  <p className="text-gray-500 text-xs">
                    Desde: {new Date(tool.historial[tool.historial.length - 1].fecha).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {showHistory && tool.historial && tool.historial.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <h4 className="font-semibold text-sm mb-2">Historial reciente</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {tool.historial.slice().reverse().slice(0, 3).map((entry, index) => (
                    <div key={index} className="text-xs border-l-2 border-gray-300 pl-2">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{entry.accion}</span>
                        <span className="text-gray-500">
                          {new Date(entry.fecha).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.employeeName && (
                        <p>Empleado: {entry.employeeName}</p>
                      )}
                      {entry.observaciones && (
                        <p className="text-gray-600 truncate">Obs: {entry.observaciones}</p>
                      )}
                      {entry.costo && (
                        <p className="text-gray-600">Costo: {formatCurrency(entry.costo)}</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Asignar Herramienta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empleado *</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar empleado</option>
                  {employees?.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} {employee.position ? `(${employee.position})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Detalles de la asignación..."
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAssign}
                  disabled={!selectedEmployee}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar Asignación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Devolución */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Devolver Herramienta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado al devolver *</label>
                <select
                  value={returnEstado}
                  onChange={(e) => setReturnEstado(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="stock">En Stock</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="dañada">Dañada</option>
                  <option value="reparacion_sencilla">En Reparación Sencilla</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Detalles de la devolución..."
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveReturn}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Confirmar Devolución
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};