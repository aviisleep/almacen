import React from 'react';
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline';

/**
 * Componente que muestra una lista de herramientas pendientes de devolución
 * @param {Object} props
 * @param {Array} props.tools - Lista de herramientas pendientes
 * @param {Function} props.onReturn - Función para manejar la devolución de una herramienta
 */
export const PendingToolsList = ({ tools, onReturn }) => {
  // Función para formatear la fecha
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para determinar el color según los días de uso
  const getDaysColor = (days) => {
    if (days > 7) return 'text-red-600';
    if (days > 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Herramientas Pendientes de Devolución
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {tools.map((tool) => (
            <li key={tool.SKU} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {tool.herramienta}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">
                      SKU: {tool.SKU}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>{tool.empleado}</p>
                  </div>
                  <div className="mt-1 flex items-center text-sm">
                    <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p className={getDaysColor(tool.diasEnUso)}>
                      {tool.diasEnUso} días en uso
                    </p>
                    <span className="mx-2 text-gray-300">|</span>
                    <p className="text-gray-500">
                      Asignado el {formatDate(tool.fechaAsignacion)}
                    </p>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => onReturn(tool)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Devolver
                  </button>
                </div>
              </div>
            </li>
          ))}
          {tools.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No hay herramientas pendientes de devolución
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}; 