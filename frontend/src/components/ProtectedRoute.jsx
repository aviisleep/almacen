import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    console.log('ProtectedRoute - Estado actual:', {
      isAuthenticated,
      user,
      requiredRole,
      currentPath,
      loading,
      userRole: user?.role
    });
  }, [isAuthenticated, user, requiredRole, currentPath, loading]);

  if (loading) {
    console.log('ProtectedRoute - Estado de carga activo');
    return null;
  }

  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute - Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene el rol requerido
  // Los administradores pueden acceder a todas las rutas
  const hasRequiredRole = user.role === 'admin' || user.role === requiredRole;
  
  console.log('ProtectedRoute - Verificación de rol:', {
    userRole: user.role,
    requiredRole,
    hasRequiredRole,
    isAdmin: user.role === 'admin'
  });

  if (requiredRole && !hasRequiredRole) {
    console.log('ProtectedRoute - Rol insuficiente, redirigiendo a unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('ProtectedRoute - Acceso permitido');
  return children;
};

export default ProtectedRoute; 