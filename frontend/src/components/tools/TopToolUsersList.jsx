import React from 'react';
import { UserGroupIcon, WrenchIcon } from '@heroicons/react/24/outline';

/**
 * Componente que muestra una lista de los empleados que más utilizan herramientas
 * @param {Object} props
 * @param {Array} props.users - Lista de empleados que más utilizan herramientas
 * @param {string} props.period - Período de tiempo seleccionado
 */
export const TopToolUsersList = ({ users, period }) => {
  // Función para calcular el porcentaje de uso relativo
  const calculateUsagePercentage = (count, maxCount) => {
    return (count / maxCount) * 100;
  };

  // Encontrar el máximo número de herramientas usadas para la barra de progreso
  const maxTools = Math.max(...users.map(user => user.herramientasUsadas));

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Empleados que Más Utilizan Herramientas
          </h3>
          <span className="text-sm text-gray-500">
            Período: {period}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.empleado} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <UserGroupIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {user.empleado}
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Herramientas usadas
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {user.herramientasUsadas} herramientas
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div
                          style={{ width: `${calculateUsagePercentage(user.herramientasUsadas, maxTools)}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <WrenchIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>
                      {user.herramientasActivas} herramientas activas
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {users.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No hay datos disponibles para el período seleccionado
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}; 