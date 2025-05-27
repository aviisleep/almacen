import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const updateAuthState = (userData, authenticated) => {
    console.log('AuthContext - Actualizando estado:', {
      userData,
      authenticated,
      currentUser: user,
      currentAuth: isAuthenticated
    });
    setUser(userData);
    setIsAuthenticated(authenticated);
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('AuthContext - Verificando autenticación, token:', token ? 'Presente' : 'No presente');
      
      if (!token) {
        console.log('AuthContext - No hay token, actualizando estado a no autenticado');
        updateAuthState(null, false);
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/me');
      console.log('AuthContext - Respuesta de verificación:', response.data);

      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        console.log('AuthContext - Usuario autenticado:', userData);
        updateAuthState(userData, true);
      } else {
        console.log('AuthContext - Respuesta inválida o sin datos de usuario');
        localStorage.removeItem('token');
        updateAuthState(null, false);
      }
    } catch (error) {
      console.error('AuthContext - Error al verificar autenticación:', error);
      localStorage.removeItem('token');
      updateAuthState(null, false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      console.log('AuthContext - Respuesta de login:', response.data);

      if (response.data.success && response.data.data) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        updateAuthState(userData, true);
        navigate('/');
        return { success: true };
      } else {
        throw new Error('Respuesta de login inválida');
      }
    } catch (error) {
      console.error('AuthContext - Error en login:', error);
      updateAuthState(null, false);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthContext - Cerrando sesión');
    localStorage.removeItem('token');
    updateAuthState(null, false);
    navigate('/login');
  };

  useEffect(() => {
    console.log('AuthContext - Iniciando verificación de autenticación');
    checkAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log('AuthContext - Cambio detectado en token:', e.newValue ? 'Nuevo token' : 'Token eliminado');
        if (!e.newValue) {
          updateAuthState(null, false);
        } else {
          checkAuth();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 