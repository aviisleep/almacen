import React, { useState, useEffect } from 'react';
import { ToolsList } from '../components/tools/ToolsList';
import { ToolForm } from '../components/tools/ToolForm';
import { ToolAssignmentForm } from '../components/tools/ToolAssignmentForm';
import { ToolReturnForm } from '../components/tools/ToolReturnForm';
import { ToolsStats } from '../components/tools/ToolsStats';
import { toolsApi } from '../utils/api/toolsApi';
import { LoadingSpinner } from '../components/tools/LoadingSpinner';
import { ErrorAlert } from '../components/tools/ErrorAlert';
import { PageHeader } from '../components/tools/PageHeader';
import { TabNavigation } from '../components/tools/TabNavigation';

/**
 * Página principal para la gestión de herramientas
 */
export const HerramientasPage = () => {
  const [activeTab, setActiveTab] = useState('lista');
  const [showNewToolForm, setShowNewToolForm] = useState(false);
  const [toolsData, setToolsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTools = async () => {
    try {
      setLoading(true);
      const data = await toolsApi.getAll();
      setToolsData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar herramientas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, [activeTab]);

  const handleSuccess = () => {
    setShowNewToolForm(false);
    loadTools();
  };

  const TABS = {
    lista: { 
      label: 'Lista de Herramientas', 
      component: (
        <>
          {showNewToolForm ? (
            <div className="mb-8 bg-white p-6 rounded-lg shadow">
              <ToolForm 
                onSuccess={handleSuccess} 
                onCancel={() => setShowNewToolForm(false)} 
              />
            </div>
          ) : (
            <div className="mb-4">
              <button
                onClick={() => setShowNewToolForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Nueva Herramienta
              </button>
            </div>
          )}
          <ToolsList 
            tools={toolsData} 
            loading={loading} 
            onRefresh={loadTools}
          />
        </>
      ) 
    },
    asignacion: { 
      label: 'Asignación', 
      component: (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <ToolAssignmentForm 
            tools={toolsData}
            onSuccess={handleSuccess} 
          />
        </div>
      ) 
    },
    devolucion: { 
      label: 'Devolución', 
      component: (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <ToolReturnForm 
            tools={toolsData.filter(t => t.estado === 'en_uso')}
            onSuccess={handleSuccess} 
          />
        </div>
      ) 
    },
    estadisticas: { 
      label: 'Estadísticas', 
      component: (
        <div className="bg-white p-6 rounded-lg shadow">
          <ToolsStats tools={toolsData} />
        </div>
      ) 
    }
  };

  if (loading && !toolsData.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Gestión de Herramientas"
          subtitle="Administra el inventario de herramientas, asigna y registra devoluciones"
        />
        <LoadingSpinner fullPage />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Gestión de Herramientas"
        subtitle="Administra el inventario de herramientas, asigna y registra devoluciones"
      />
      
      {error && (
        <div className="mb-6">
          <ErrorAlert 
            message={error}
            onRetry={loadTools}
            onDismiss={() => setError(null)}
          />
        </div>
      )}
      
      <TabNavigation 
        tabs={TABS} 
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />
      
      <div className="mt-6">
        {TABS[activeTab].component}
      </div>
    </div>
  );
};