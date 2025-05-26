import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toolsApi } from '../utils/api/toolsApi';
import { employeesApi } from '../utils/api/employeesApi';

const ToolsContext = createContext();

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error('useTools debe ser usado dentro de un ToolsProvider');
  }
  return context;
};

export const ToolsProvider = ({ children }) => {
  const [tools, setTools] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState({
    tools: null,
    employees: null
  });
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  // Función para verificar si los datos necesitan actualización
  const needsRefresh = useCallback((type) => {
    if (!lastFetch[type]) return true;
    return Date.now() - lastFetch[type] > CACHE_DURATION;
  }, [lastFetch]);

  // Cargar herramientas solo si es necesario
  const loadTools = useCallback(async (force = false) => {
    if (!force && !needsRefresh('tools')) {
      return tools;
    }

    try {
      setLoading(true);
      const data = await toolsApi.getAll();
      setTools(data);
      setLastFetch(prev => ({ ...prev, tools: Date.now() }));
      return data;
    } catch (err) {
      setError({
        message: 'Error al cargar herramientas',
        details: err.message
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [needsRefresh, tools]);

  // Cargar empleados solo si es necesario
  const loadEmployees = useCallback(async (force = false) => {
    if (!force && !needsRefresh('employees')) {
      return employees;
    }

    try {
      setLoading(true);
      const data = await employeesApi.getAll();
      setEmployees(data);
      setLastFetch(prev => ({ ...prev, employees: Date.now() }));
      return data;
    } catch (err) {
      setError({
        message: 'Error al cargar empleados',
        details: err.message
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [needsRefresh, employees]);

  // Cargar datos iniciales
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          loadTools(true),
          loadEmployees(true)
        ]);
      } catch (err) {
        console.error('Error al inicializar datos:', err);
      }
    };

    initializeData();
  }, []);

  // Asignar herramienta
  const assignTool = async (toolId, employeeId, observaciones = '') => {
    try {
      setLoading(true);
      const updatedTool = await toolsApi.assign(toolId, employeeId, observaciones);
      setTools(prevTools => 
        prevTools.map(tool => tool._id === toolId ? updatedTool : tool)
      );
      return updatedTool;
    } catch (err) {
      setError({
        message: 'Error al asignar herramienta',
        details: err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Devolver herramienta
  const returnTool = async (toolId, estado = '', observaciones = '') => {
    try {
      setLoading(true);
      const updatedTool = await toolsApi.return(toolId, estado, observaciones);
      setTools(prevTools => 
        prevTools.map(tool => tool._id === toolId ? updatedTool : tool)
      );
      return updatedTool;
    } catch (err) {
      setError({
        message: 'Error al devolver herramienta',
        details: err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Agregar herramienta
  const addTool = async (toolData) => {
    try {
      setLoading(true);
      const newTool = await toolsApi.create(toolData);
      setTools(prevTools => [...prevTools, newTool]);
      return newTool;
    } catch (err) {
      setError({
        message: 'Error al agregar herramienta',
        details: err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar herramienta
  const updateTool = async (toolId, toolData) => {
    try {
      setLoading(true);
      const updatedTool = await toolsApi.update(toolId, toolData);
      setTools(prevTools => 
        prevTools.map(tool => tool._id === toolId ? updatedTool : tool)
      );
      return updatedTool;
    } catch (err) {
      setError({
        message: 'Error al actualizar herramienta',
        details: err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar herramienta
  const deleteTool = async (toolId) => {
    try {
      setLoading(true);
      await toolsApi.delete(toolId);
      setTools(prevTools => prevTools.filter(tool => tool._id !== toolId));
      await loadTools(true);
    } catch (err) {
      setError({
        message: 'Error al eliminar herramienta',
        details: err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tools,
    employees,
    loading,
    error,
    loadTools,
    loadEmployees,
    assignTool,
    returnTool,
    addTool,
    updateTool,
    deleteTool
  };

  return (
    <ToolsContext.Provider value={value}>
      {children}
    </ToolsContext.Provider>
  );
};

export default ToolsContext; 