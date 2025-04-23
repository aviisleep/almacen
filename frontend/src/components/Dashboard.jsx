// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import ChartComponent from './ChartComponent';
import { getDashboardStats } from '../utils/api/api';

function StatCard({ title, value, color }) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center`}>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProductsInStock: 0,
    totalBaysOccupied: 0,
    totalVehiclesAssigned: 0,
  });

  useEffect(() => {
    // Cargar estadísticas del backend
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Bienvenido al Dashboard</h2>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Empleados" value={stats.totalEmployees} color="text-indigo-600" />
        <StatCard title="Productos en Stock" value={stats.totalProductsInStock} color="text-green-600" />
        <StatCard title="Bahías Ocupadas" value={stats.totalBaysOccupied} color="text-blue-600" />
        <StatCard title="Vehículos Asignados" value={stats.totalVehiclesAssigned} color="text-red-600" />
      </div>

      {/* Gráficos */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Estadísticas Generales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Barras */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Productos por Categoría</h4>
            <ChartComponent />
          </div>

          {/* Gráfico de Pastel */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Distribución de Bahías</h4>
            <div className="h-48 w-full bg-gray-200 rounded animate-pulse"></div> {/* Placeholder */}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Crear Empleado
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
            Entregar Producto
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
            Asignar Bahía
          </button>
        </div>
      </div>

      {/* Resumen de Actividad Reciente */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            <li className="py-2 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Producto entregado a Juan Pérez</p>
                <p className="text-xs text-gray-500">Filtro de aceite - 5 unidades</p>
              </div>
              <span className="text-xs text-gray-500">Hace 2 horas</span>
            </li>
            <li className="py-2 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Asignación de Bahía 3</p>
                <p className="text-xs text-gray-500">Vehículo: Toyota Corolla</p>
              </div>
              <span className="text-xs text-gray-500">Hace 1 día</span>
            </li>
            <li className="py-2 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Nuevo empleado registrado</p>
                <p className="text-xs text-gray-500">María López</p>
              </div>
              <span className="text-xs text-gray-500">Hace 3 días</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;