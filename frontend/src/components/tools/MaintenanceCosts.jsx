import React from 'react';
import { CurrencyDollarIcon, WrenchIcon } from '@heroicons/react/24/outline';

/**
 * Componente que muestra los costos de mantenimiento de las herramientas
 * @param {Object} props
 * @param {Object} props.data - Datos de los costos de mantenimiento
 * @param {string} props.period - Período de tiempo seleccionado
 */
export const MaintenanceCosts = ({ data, period }) => {
  // Función para formatear el costo en moneda
  const formatCost = (cost) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cost);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Costos de Mantenimiento
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
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              <h4 className="ml-2 text-lg font-medium text-blue-900">
                Costo Total
              </h4>
            </div>
            <p className="mt-2 text-3xl font-semibold text-blue-600">
              {formatCost(data.costoTotal)}
            </p>
            <p className="mt-1 text-sm text-blue-500">
              en mantenimiento
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <WrenchIcon className="h-6 w-6 text-green-600" />
              <h4 className="ml-2 text-lg font-medium text-green-900">
                Mantenimientos
              </h4>
            </div>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {data.totalMantenimientos}
            </p>
            <p className="mt-1 text-sm text-green-500">
              realizados
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">
            Costos por Categoría
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
                    {formatCost(categoria.costoTotal)}
                  </span>
                  <div className="ml-4 w-32">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${(categoria.costoTotal / data.costoTotal) * 100}%` }}
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

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">
            Herramientas con Mayor Costo
          </h4>
          <div className="mt-4 space-y-4">
            {data.herramientasCostosas.map((herramienta) => (
              <div key={herramienta.SKU} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {herramienta.nombre}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    SKU: {herramienta.SKU}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    {formatCost(herramienta.costoTotal)}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    ({herramienta.mantenimientos} mantenimientos)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 