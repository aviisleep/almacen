import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  UserGroupIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Inicio', href: '/', icon: HomeIcon },
  { name: 'Ingresos', href: '/ingresos', icon: ClipboardDocumentListIcon },
  { name: 'Inventario', href: '/inventario', icon: CubeIcon },
  { name: 'Empleados', href: '/empleados', icon: UserGroupIcon },
  { name: 'Vehículos', href: '/vehiculos', icon: TruckIcon },
  { name: 'Proveedores', href: '/proveedores', icon: BuildingStorefrontIcon },
  { name: 'Cotizaciones', href: '/cotizaciones', icon: DocumentTextIcon },
  { name: 'Herramientas', href: '/herramientas', icon: WrenchScrewdriverIcon },
  { name: 'Acerca de', href: '/about', icon: InformationCircleIcon },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-white text-xl font-bold">Almacén</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                  } mr-3 flex-shrink-0 h-6 w-6`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}; 