import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toolsApi } from '../../utils/api/toolsApi';
import { useTools } from '../../contexts/ToolsContext';

export const ToolReturnForm = ({ onSuccess }) => {
  const { employees } = useTools();
  const [assignedTools, setAssignedTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Cargar solo herramientas asignadas
  useEffect(() => {
    const loadAssignedTools = async () => {
      try {
        console.log('Iniciando carga de herramientas asignadas...');
        const response = await toolsApi.getAssigned();
        console.log('Respuesta de herramientas asignadas:', response);
        
        if (response?.data && Array.isArray(response.data)) {
          setAssignedTools(response.data);
        } else if (Array.isArray(response)) {
          setAssignedTools(response);
        } else {
          console.error('Formato de respuesta inesperado:', response);
          setAssignedTools([]);
        }
      } catch (error) {
        console.error('Error al cargar herramientas asignadas:', error);
        setAssignedTools([]);
      }
    };

    loadAssignedTools();
  }, []);

  // Función para obtener el nombre del empleado
  const getEmployeeName = (employeeId) => {
    if (!employeeId || !Array.isArray(employees)) {
      return 'N/A';
    }

    const id = typeof employeeId === 'object' ? employeeId._id : employeeId;
    const employee = employees.find(emp => emp?._id === id);
    return employee?.name || 'N/A';
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Datos de devolución:', data);

      const response = await toolsApi.return(
        data.herramientaId,
        data.estado,
        data.observaciones
      );

      console.log('Respuesta de devolución:', response);

      if (response?.success) {
        onSuccess?.();
        reset();
        // Recargar la lista de herramientas asignadas
        const updatedTools = await toolsApi.getAssigned();
        setAssignedTools(Array.isArray(updatedTools) ? updatedTools : []);
      } else {
        setError(response?.message || 'Error al devolver la herramienta');
      }
    } catch (error) {
      console.error('Error al devolver herramienta:', error);
      setError(error.response?.data?.message || 'Error al devolver la herramienta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Devolver Herramienta
      </h3>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Cargando herramientas asignadas...</p>
        </div>
      ) : !Array.isArray(assignedTools) || assignedTools.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-600">No hay herramientas asignadas para devolver</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Herramienta
            </label>
            <select
              {...register('herramientaId', { required: 'Selecciona una herramienta' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              disabled={loading}
            >
              <option value="">Selecciona una herramienta</option>
              {assignedTools.map((tool) => {
                if (!tool) return null;
                
                const empleadoAsignado = tool.empleadoAsignado;
                
                return (
                  <option key={tool._id} value={tool._id}>
                    {tool.nombre} - {tool.SKU} (Asignada a: {getEmployeeName(empleadoAsignado)})
                  </option>
                );
              })}
            </select>
            {errors.herramientaId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.herramientaId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              {...register('estado', { required: 'Selecciona el estado' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              disabled={loading}
            >
              <option value="">Selecciona el estado</option>
              <option value="stock">Disponible en Stock (Verde)</option>
              <option value="dañada">Dañada - Reparación Mayor (Rojo)</option>
              <option value="reparacion_sencilla">Reparación Sencilla (Naranja)</option>
              <option value="mantenimiento">En Centro de Reparaciones (Azul)</option>
            </select>
            {errors.estado && (
              <p className="mt-1 text-sm text-red-600">
                {errors.estado.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observaciones
            </label>
            <textarea
              {...register('observaciones')}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Observaciones sobre la devolución..."
              disabled={loading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !Array.isArray(assignedTools) || assignedTools.length === 0}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Devolviendo...' : 'Devolver Herramienta'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}; 