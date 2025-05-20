import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import MainLayout from "./components/MainLayout";
import Inventario from "./pages/Inventario";
import Bays from "./pages/Bays";
import VehicleManager from "./pages/VehicleManager";
import EmployeeManager from "./pages/EmployeeManager";
import Proveedores from "./pages/ProveedorManager";
import IngresoSalida from "./pages/IngresoSalidaForm";
import Dashboard from "./components/Dashboard";
import Ingresos from "./pages/IngresosPage"
import Cotizaciones from "./pages/Cotizaciones"

function App() {
  const [currentPage, setCurrentPage] = useState(""); // Estado para la página actual
  const location = useLocation(); // Hook para obtener la ubicación actual de la ruta

  // Usamos useEffect para actualizar el estado cada vez que cambie la ruta
  useEffect(() => {
    setCurrentPage(location.pathname); // Actualiza el estado con la ruta actual
  }, [location]); // Se ejecuta cuando cambia la ubicación

  return (
    <ErrorBoundary>
      <Routes>
        {/* Rutas con layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/bays" element={<Bays />} />
          <Route path="/vehicles" element={<VehicleManager />} />
          <Route path="/employees" element={<EmployeeManager />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/ingresos" element={<Ingresos />} />
          <Route path="/ingreso-salida" element={<IngresoSalida />} />
          <Route path="/cotizaciones" element={<Cotizaciones />} />
        </Route>
      </Routes>

      {/* Muestra el estado de la página actual en algún lugar */}
      <div className="absolute top-0 right-0 p-4 text-white bg-black bg-opacity-50">
        Página actual: {currentPage}
      </div>
    </ErrorBoundary>
  );
}

export default App;
