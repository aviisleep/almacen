// src/components/Navbar.jsx
import React from 'react';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/solid';

function Navbar() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* Título */}
      <div className="flex items-center space-x-2">
        <Bars3Icon className="w-6 h-6 cursor-pointer" /> {/* Menú hamburguesa */}
        <h1 className="text-lg font-bold">Dashboard</h1>
      </div>

      {/* Notificaciones y perfil */}
      <div className="flex items-center space-x-4">
        <BellIcon className="w-6 h-6 cursor-pointer" /> {/* Icono de notificaciones */}
        <UserCircleIcon className="w-8 h-8 cursor-pointer" /> {/* Icono de perfil */}
      </div>
    </header>
  );
}

export default Navbar;