// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeModernIcon,
  PlusCircleIcon,
  ListBulletIcon,
  UserGroupIcon,
  TruckIcon,
  CubeTransparentIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: HomeModernIcon },
  { path: '/proveedores', label: 'Proveedores', icon: UserGroupIcon },
  { path: '/inventario', label: 'Inventario', icon: ListBulletIcon },
  { path: '/bays', label: 'Bahías', icon: CubeTransparentIcon },
  { path: '/vehiculos', label: 'Vehículos', icon: TruckIcon },
  { path: '/empleados', label: 'Empleados', icon: UserIcon },
  { path: '/ingresos', label: 'Entrada', icon: UserIcon },
  { path: '/cotizaciones', label: 'Cotizaciones', icon: PlusCircleIcon },
  { path: '/herramientas', label: 'Herramientas', icon: WrenchScrewdriverIcon },
];

function Sidebar({ isOpen }) {
  return (
    <aside
      className={`bg-gray-800 text-white min-h-screen p-4 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <h2 className={`text-xl font-bold mb-6 text-center ${!isOpen && 'hidden'}`}>Menú</h2>
      <nav>
        <ul className="space-y-2">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center py-2 px-4 rounded transition-colors w-full ${
                    isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`
                }
              >
                {Icon && <Icon className="w-5 h-5 mr-2" />}
                <span className={`${!isOpen && 'hidden'}`}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;