import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import MainLayout from "./components/MainLayout";
import Inventario from "./pages/Inventario";
import Bays from "./pages/Bays";
import VehicleManager from "./pages/VehicleManager";
import EmployeeManager from "./pages/EmployeeManager";
import Proveedores from "./pages/ProveedorManager";
import Dashboard from "./components/Dashboard";
import Ingresos from "./pages/IngresosPage"
import Cotizaciones from "./pages/Cotizaciones"
import { HerramientasPage } from "./pages/HerramientasPage";
import { AuthProvider } from './contexts/AuthContext';
import { ToolsProvider } from './contexts/ToolsContext';
import { LoginForm } from './components/auth/LoginForm';
import { UserManagement } from './components/admin/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToolsProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            <Route path="/" element={
              <ProtectedRoute requiredRole="user">
                <MainLayout currentPage={currentPage}>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/inventario" element={
              <ProtectedRoute requiredRole="user">
                <MainLayout currentPage={currentPage}>
                  <Inventario />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/bays" element={
              <ProtectedRoute requiredRole="user">
                <MainLayout currentPage={currentPage}>
                  <Bays />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/vehiculos" element={
              <ProtectedRoute requiredRole="user">
                <MainLayout currentPage={currentPage}>
                  <VehicleManager />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/empleados" element={
              <ProtectedRoute requiredRole="admin">
                <MainLayout currentPage={currentPage}>
                  <EmployeeManager />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/proveedores" element={
              <ProtectedRoute requiredRole="user">
                <MainLayout currentPage={currentPage}>
                  <Proveedores />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/ingresos" element={
              <ProtectedRoute requiredRole="user">
                <MainLayout currentPage={currentPage}>
                  <Ingresos />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/cotizaciones" element={
              <ProtectedRoute requiredRole="user">
                <MainLayout currentPage={currentPage}>
                  <Cotizaciones />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/herramientas" element={
              <ProtectedRoute requiredRole="user">
                <MainLayout currentPage={currentPage}>
                  <HerramientasPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <MainLayout currentPage={currentPage}>
                  <UserManagement />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <div className="absolute top-0 right-0 p-4 text-white bg-black bg-opacity-50">
            Página actual: {currentPage}
          </div>
        </ToolsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
