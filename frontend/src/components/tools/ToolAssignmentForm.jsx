import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTools } from '../../contexts/ToolsContext';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

export const ToolAssignmentForm = ({ onSuccess }) => {
  const { 
    tools, 
    employees, 
    loading: contextLoading, 
    loadTools,
    assignTool 
  } = useTools();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTools, setFilteredTools] = useState([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  // Memoizar empleados activos
  const activeEmployees = useMemo(() => {
    return employees.filter(employee => employee.active);
  }, [employees]);

  // Función de búsqueda con debounce
  const debouncedSearch = useCallback(
    debounce((term, toolsList) => {
      const filtered = toolsList.filter(tool => 
        tool.estado === 'stock' && 
        (tool.nombre.toLowerCase().includes(term.toLowerCase()) ||
         tool.SKU.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredTools(filtered);
    }, 300),
    []
  );

  // Efecto para manejar la búsqueda
  useEffect(() => {
    if (tools.length > 0) {
      debouncedSearch(searchTerm, tools);
    }
  }, [searchTerm, tools, debouncedSearch]);

  // Memoizar herramientas disponibles para evitar recálculos innecesarios
  const availableTools = useMemo(() => {
    return tools.filter(tool => tool.estado === 'stock');
  }, [tools]);

  // Función para manejar la asignación de herramientas
  const handleAssignTool = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Asignar la herramienta usando el contexto
      await assignTool(
        data.herramientaId,
        data.empleadoId,
        data.observaciones
      );

      // Actualizar la lista de herramientas
      await loadTools(true);

      // Notificar éxito
      toast.success('Herramienta asignada correctamente');
      onSuccess?.();
      reset();
    } catch (error) {
      console.error('Error al asignar herramienta:', error);
      const errorMessage = error.response?.data?.message || 'Error al asignar la herramienta';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [assignTool, loadTools, onSuccess, reset]);

  // Estado de carga inicial
  if (contextLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  // Verificar si hay datos disponibles
  if (availableTools.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">No hay herramientas disponibles para asignar</p>
      </div>
    );
  }

  if (activeEmployees.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">No hay empleados activos disponibles</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleAssignTool)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Buscar Herramienta
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o SKU..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Herramienta
        </label>
        <select
          {...register('herramientaId', { 
            required: 'Selecciona una herramienta',
            validate: value => value !== '' || 'Debes seleccionar una herramienta'
          })}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          disabled={loading || isSubmitting}
        >
          <option value="">Selecciona una herramienta</option>
          {filteredTools.map((tool) => (
            <option key={tool._id} value={tool._id}>
              {tool.nombre} - {tool.SKU}
            </option>
          ))}
        </select>
        {errors.herramientaId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.herramientaId.message}
          </p>
        )}
        {filteredTools.length === 0 && searchTerm && (
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron herramientas con ese criterio de búsqueda
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Empleado
        </label>
        <select
          {...register('empleadoId', { 
            required: 'Selecciona un empleado',
            validate: value => value !== '' || 'Debes seleccionar un empleado'
          })}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          disabled={loading || isSubmitting}
        >
          <option value="">Selecciona un empleado</option>
          {activeEmployees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name} {employee.position ? `- ${employee.position}` : ''}
            </option>
          ))}
        </select>
        {errors.empleadoId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.empleadoId.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Observaciones
        </label>
        <textarea
          {...register('observaciones', {
            maxLength: {
              value: 500,
              message: 'Las observaciones no pueden exceder los 500 caracteres'
            }
          })}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Observaciones sobre la asignación..."
          disabled={loading || isSubmitting}
        />
        {errors.observaciones && (
          <p className="mt-1 text-sm text-red-600">
            {errors.observaciones.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
            reset();
            setError(null);
          }}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading || isSubmitting}
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Asignando...
            </>
          ) : (
            'Asignar'
          )}
        </button>
      </div>
    </form>
  );
}; 