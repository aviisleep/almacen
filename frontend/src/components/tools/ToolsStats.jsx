import React, { useState, useEffect } from 'react';
import { toolsApi } from '../../utils/api/toolsApi';

export const ToolsStats = () => {
  const [stats, setStats] = useState({
    mostUsed: [],
    topUsers: [],
    averageUsage: 0,
    maintenanceCosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('mes');

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        mostUsedResponse,
        topUsersResponse,
        averageUsageResponse,
        maintenanceCostsResponse
      ] = await Promise.all([
        toolsApi.getMostUsed(period),
        toolsApi.getTopUsers(period),
        toolsApi.getAverageUsageTime(period),
        toolsApi.getMaintenanceCosts(period)
      ]);

      if (!mostUsedResponse.success || !topUsersResponse.success || 
          !averageUsageResponse.success || !maintenanceCostsResponse.success) {
        throw new Error('Error en la respuesta del servidor');
      }

      setStats({
        mostUsed: mostUsedResponse.data,
        topUsers: topUsersResponse.data,
        averageUsage: averageUsageResponse.data.promedioTiempoUso,
        maintenanceCosts: maintenanceCostsResponse.data.costoTotal
      });
    } catch (error) {
      console.error('Error al cargar las estadísticas:', error);
      setError('Error al cargar las estadísticas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Estadísticas de Herramientas
        </h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="semana">Última semana</option>
          <option value="mes">Último mes</option>
          <option value="trimestre">Último trimestre</option>
          <option value="año">Último año</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Herramientas más utilizadas */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Herramientas más utilizadas
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.mostUsed.length}
            </dd>
            <div className="mt-4">
              {stats.mostUsed.map((tool) => (
                <div key={tool._id} className="text-sm text-gray-500">
                  {tool.nombre} ({tool.usoCount} usos)
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empleados más activos */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Empleados más activos
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.topUsers.length}
            </dd>
            <div className="mt-4">
              {stats.topUsers.map((user) => (
                <div key={user._id} className="text-sm text-gray-500">
                  {user.nombre} ({user.usoCount} usos)
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tiempo promedio de uso */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Tiempo promedio de uso
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.averageUsage.toFixed(1)} hrs
            </dd>
          </div>
        </div>

        {/* Costos de mantenimiento */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Costos de mantenimiento
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              ${stats.maintenanceCosts.toFixed(2)}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}; 