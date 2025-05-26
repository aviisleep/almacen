import React, { useState } from 'react';
import { ToolsList } from '../components/tools/ToolsList';
import { ToolsStats } from '../components/tools/ToolsStats';
import { ToolForm } from '../components/tools/ToolForm';
import { ToolAssignmentForm } from '../components/tools/ToolAssignmentForm';
import { ToolReturnForm } from '../components/tools/ToolReturnForm';
import { PendingToolsList } from '../components/tools/PendingToolsList';
import { MostUsedToolsList } from '../components/tools/MostUsedToolsList';
import { TopToolUsersList } from '../components/tools/TopToolUsersList';
import { AverageUsageTime } from '../components/tools/AverageUsageTime';
import { MaintenanceCosts } from '../components/tools/MaintenanceCosts';
import { toolsApi } from '../utils/api/toolsApi';

/**
 * Página principal para la gestión de herramientas
 */
export const HerramientasPage = () => {
  const [activeTab, setActiveTab] = useState('lista');
  const [showNewToolForm, setShowNewToolForm] = useState(false);

  const handleSuccess = () => {
    setShowNewToolForm(false);
    // Aquí podrías recargar los datos si es necesario
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Herramientas</h1>
        <p className="mt-2 text-sm text-gray-600">
          Administra el inventario de herramientas, asigna y registra devoluciones
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('lista')}
            className={`${
              activeTab === 'lista'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Lista de Herramientas
          </button>
          <button
            onClick={() => setActiveTab('asignacion')}
            className={`${
              activeTab === 'asignacion'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Asignación
          </button>
          <button
            onClick={() => setActiveTab('devolucion')}
            className={`${
              activeTab === 'devolucion'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Devolución
          </button>
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`${
              activeTab === 'estadisticas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Estadísticas
          </button>
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="mt-6">
        {activeTab === 'lista' && (
          <div>
            {showNewToolForm ? (
              <div className="mb-8">
                <ToolForm onSuccess={handleSuccess} />
              </div>
            ) : (
              <div className="mb-4">
                <button
                  onClick={() => setShowNewToolForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Nueva Herramienta
                </button>
              </div>
            )}
            <ToolsList />
          </div>
        )}

        {activeTab === 'asignacion' && (
          <div className="max-w-3xl mx-auto">
            <ToolAssignmentForm onSuccess={handleSuccess} />
          </div>
        )}

        {activeTab === 'devolucion' && (
          <div className="max-w-3xl mx-auto">
            <ToolReturnForm onSuccess={handleSuccess} />
          </div>
        )}

        {activeTab === 'estadisticas' && (
          <div>
            <ToolsStats />
          </div>
        )}
      </div>
    </div>
  );
}; 