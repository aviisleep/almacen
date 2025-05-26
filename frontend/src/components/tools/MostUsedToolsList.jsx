import React from 'react';
import { ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';

/**
 * Componente que muestra una lista de las herramientas más utilizadas
 * @param {Object} props
 * @param {Array} props.tools - Lista de herramientas más utilizadas
 * @param {string} props.period - Período de tiempo seleccionado
 */
export const MostUsedToolsList = ({ tools, period }) => {
  // Función para formatear el tiempo de uso
  const formatUsageTime = (hours) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  };

  // Función para calcular el porcentaje de uso relativo
  const calculateUsagePercentage = (hours, maxHours) => {
    return (hours / maxHours) * 100;
  };

  // Encontrar el máximo tiempo de uso para la barra de progreso
  const maxHours = Math.max(...tools.map(tool => tool.tiempoUso));

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Herramientas Más Utilizadas
          </h3>
          <span className="text-sm text-gray-500">
            Período: {period}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {tools.map((tool) => (
            <li key={tool.SKU} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <ChartBarIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {tool.herramienta}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">
                      SKU: {tool.SKU}
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Tiempo de uso
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {formatUsageTime(tool.tiempoUso)}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div
                          style={{ width: `${calculateUsagePercentage(tool.tiempoUso, maxHours)}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>
                      {tool.vecesAsignada} veces asignada
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {tools.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No hay datos disponibles para el período seleccionado
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}; 