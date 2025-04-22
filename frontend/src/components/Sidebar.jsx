// src/components/Sidebar.jsx
import React from 'react';
import {
  HomeModernIcon,
  PlusCircleIcon,
  ListBulletIcon,
  UserGroupIcon,
  TruckIcon,
  CubeTransparentIcon,
  UserIcon,
} from '@heroicons/react/24/solid'; // Importa iconos

function Sidebar({ setActiveComponent }) {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-center">Menú</h2>
      <nav>
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => setActiveComponent('dashboard')}
              className="flex items-center py-2 px-4 rounded hover:bg-gray-700 transition-colors w-full text-left"
            >
              <HomeModernIcon className="w-5 h-5 mr-2" />
              Dashboard
            </button>
          </li>

          {/* Proveedores */}
          <li>
            <button
              onClick={() => setActiveComponent('proveedores')}
              className="flex items-center py-2 px-4 rounded hover:bg-gray-700 transition-colors w-full text-left"
            >
              <UserGroupIcon className="w-5 h-5 mr-2" />
              Proveedores
            </button>
          </li>

          {/* Productos */}
          <li>
            <button
              onClick={() => setActiveComponent('products')}
              className="flex items-center py-2 px-4 rounded hover:bg-gray-700 transition-colors w-full text-left"
            >
              <ListBulletIcon className="w-5 h-5 mr-2" />
              Productos
            </button>
          </li>

          {/* Bahías */}
          <li>
            <button
              onClick={() => setActiveComponent('bays')}
              className="flex items-center py-2 px-4 rounded hover:bg-gray-700 transition-colors w-full text-left"
            >
              <CubeTransparentIcon className="w-5 h-5 mr-2" />
              Bahías
            </button>
          </li>
           {/* Vehiculos */}
           <li>
  <button
    onClick={() => setActiveComponent('vehicles')}
    className="flex items-center py-2 px-4 rounded hover:bg-gray-700 transition-colors w-full text-left"
  >
    <TruckIcon className="w-5 h-5 mr-2" /> {/* Usa un ícono de coche */}
    Vehículos
  </button>
</li>
<li>
  <button
    onClick={() => setActiveComponent('ingresoSalida')}
    className="flex items-center py-2 px-4 rounded hover:bg-gray-700 transition-colors w-full text-left"
  >
    <UserIcon className="w-5 h-5 mr-2" /> {/* Usa un ícono de usuario */}
    Entrada - Salida
  </button>
</li>
<li>
  <button
    onClick={() => setActiveComponent('employees')}
    className="flex it  ems-center py-2 px-4 rounded hover:bg-gray-700 transition-colors w-full text-left"
  >
    <UserIcon className="w-5 h-5 mr-2" /> {/* Usa un ícono de usuario */}
    Empleados
  </button>
</li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;