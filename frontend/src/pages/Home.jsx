// src/pages/Home.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import Proveedores from '../pages/ProveedorManager';
import Products from '../pages/Products';
import Bays from '../pages/Bays';
import VehicleManager from '../pages/VehicleManager';
import EmployeeManager from '../pages/EmployeeManager';
import IngresoSalida from '../pages/IngresoSalidaForm';

function Home() {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar setActiveComponent={setActiveComponent} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Componente activo */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          {activeComponent === 'dashboard' && <Dashboard />}
          {activeComponent === 'proveedores' && <Proveedores />}
          {activeComponent === 'products' && <Products />}
          {activeComponent === 'bays' && <Bays />}
          {activeComponent === 'vehicles' && <VehicleManager />}
          {activeComponent === 'employees' && <EmployeeManager />}
          {activeComponent === 'ingresoSalida' && <IngresoSalida />}	
        </main>
      </div>
    </div>
  );
}

export default Home;