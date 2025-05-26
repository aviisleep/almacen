import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTools } from '../../contexts/ToolsContext';
import { toast } from 'react-toastify';

export const ToolForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addTool } = useTools();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Convertir el precio a número y asegurar que todos los campos requeridos estén presentes
      const toolData = {
        ...data,
        precio: parseFloat(data.precio),
        estado: data.estado || 'stock' // Valor por defecto
      };

      // Crear la herramienta
      await addTool(toolData);

      // Notificar éxito y resetear el formulario
      toast.success('Herramienta creada correctamente');
      onSuccess?.();
      reset();
    } catch (error) {
      setError('Error al crear la herramienta');
      console.error(error);
      toast.error(error.message || 'Error al crear la herramienta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Agregar Nueva Herramienta
      </h3>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            {...register('nombre', { required: 'El nombre es requerido' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">
              {errors.nombre.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <input
            type="text"
            {...register('categoria', { required: 'La categoría es requerida' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
            placeholder="Ej: Herramientas Eléctricas"
          />
          {errors.categoria && (
            <p className="mt-1 text-sm text-red-600">
              {errors.categoria.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Proveedor
          </label>
          <input
            type="text"
            {...register('proveedor', { required: 'El proveedor es requerido' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
            placeholder="Ej: Ferretería Central"
          />
          {errors.proveedor && (
            <p className="mt-1 text-sm text-red-600">
              {errors.proveedor.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            {...register('precio', { 
              required: 'El precio es requerido',
              min: { value: 0, message: 'El precio debe ser mayor a 0' }
            })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          />
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600">
              {errors.precio.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            {...register('estado', { required: 'El estado es requerido' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          >
            <option value="stock">En Stock</option>
            <option value="en_uso">En Uso</option>
            <option value="mantenimiento">En Mantenimiento</option>
            <option value="dañada">Dañada</option>
            <option value="reparacion_sencilla">En Reparación Sencilla</option>
          </select>
          {errors.estado && (
            <p className="mt-1 text-sm text-red-600">
              {errors.estado.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register('descripcion')}
            rows="3"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => onSuccess?.()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Herramienta'}
          </button>
        </div>
      </form>
    </div>
  );
}; 