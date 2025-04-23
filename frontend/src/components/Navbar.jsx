// src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  ArrowPathIcon,
  BellIcon,
  UserCircleIcon,
  HomeIcon,
  CubeIcon,
  TruckIcon,
  UsersIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';
import { useLocation } from 'react-router-dom';

function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const [isRotating, setIsRotating] = useState(false); // Estado para animar el ícono

  const getTitleAndIcon = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> };
      case '/inventario':
        return { title: 'Inventario', icon: <CubeIcon className="w-6 h-6" /> };
      case '/bays':
        return { title: 'Bays', icon: <TruckIcon className="w-6 h-6" /> };
      case '/vehicles':
        return { title: 'Gestión de Vehículos', icon: <TruckIcon className="w-6 h-6" /> };
      case '/employees':
        return { title: 'Gestión de Empleados', icon: <UsersIcon className="w-6 h-6" /> };
      case '/proveedores':
        return { title: 'Gestión de Proveedores', icon: <TruckIcon className="w-6 h-6" /> };
      case '/ingreso-salida':
        return { title: 'Ingreso y Salida', icon: <ArrowRightIcon className="w-6 h-6" /> };
      default:
        return { title: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> };
    }
  };

  const { title, icon } = getTitleAndIcon();

  const handleClick = () => {
    setIsRotating(true); // Activa la animación
    toggleSidebar(); // Oculta o muestra el sidebar

    setTimeout(() => {
      setIsRotating(false); // Detiene la animación después de un breve momento
    }, 600); // Duración de la rotación (en ms)
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* Título e icono */}
      <div className="flex items-center space-x-2">
        <ArrowPathIcon
          className={`w-6 h-6 cursor-pointer transition-transform duration-500 ${
            isRotating ? 'rotate-180' : ''
          }`}
          onClick={handleClick}
        />
        <div className="flex items-center space-x-2">
          {icon}
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
      </div>

      {/* Notificaciones y perfil */}
      <div className="flex items-center space-x-4">
        <BellIcon className="w-6 h-6 cursor-pointer" />
        <UserCircleIcon className="w-8 h-8 cursor-pointer" />
      </div>
    </header>
  );
}

export default Navbar;
