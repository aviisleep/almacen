import React from 'react';
import { ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

/**
 * Componente que muestra el tiempo promedio de uso de las herramientas
 * @param {Object} props
 * @param {Object} props.data - Datos del tiempo promedio de uso
 * @param {string} props.period - Período de tiempo seleccionado
 */
export const AverageUsageTime = ({ data, period }) => {
  // Función para formatear el tiempo
  const formatTime = (hours) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.round((hours % 24) * 10) / 10;
      return `${days}d ${remainingHours}h`;
    }
    return `${Math.round(hours * 10) / 10}h`;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Tiempo Promedio de Uso
          </h3>
          <span className="text-sm text-gray-500">
            Período: {period}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 text-blue-600" />
              <h4 className="ml-2 text-lg font-medium text-blue-900">
                Tiempo Promedio
              </h4>
            </div>
            <p className="mt-2 text-3xl font-semibold text-blue-600">
              {formatTime(data.tiempoPromedio)}
            </p>
            <p className="mt-1 text-sm text-blue-500">
              por herramienta
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
              <h4 className="ml-2 text-lg font-medium text-green-900">
                Tiempo Total
              </h4>
            </div>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {formatTime(data.tiempoTotal)}
            </p>
            <p className="mt-1 text-sm text-green-500">
              de todas las herramientas
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">
            Distribución por Categoría
          </h4>
          <div className="mt-4 space-y-4">
            {data.categorias.map((categoria) => (
              <div key={categoria.nombre} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {categoria.nombre}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    {formatTime(categoria.tiempoPromedio)}
                  </span>
                  <div className="ml-4 w-32">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${(categoria.tiempoPromedio / data.tiempoPromedio) * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 