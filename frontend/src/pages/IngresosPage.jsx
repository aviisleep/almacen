import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { IngresoForm } from '../components/ingreso/IngresoForm';
import { IngresoList } from '../components/ingreso/IngresoList';
import { ingresosApi } from '../utils/api/ingresos';
import { Modal } from '../components/ui/Modal';
import { toast } from 'react-toastify';

export const IngresosPage = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentIngreso, setCurrentIngreso] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ingresoToDelete, setIngresoToDelete] = useState(null);

  const fetchIngresos = async () => {
    try {
      setLoading(true);
      const data = await ingresosApi.getAll();
      setIngresos(data);
    } catch (error) {
      toast.error('Error al cargar los ingresos');
      console.error('Error fetching ingresos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  const handleCreate = async (formData) => {
    try {
      // Verificar estructura de datos antes de enviar
      if (!formData.compania || !formData.conductor || !formData.vehiculo) {
        throw new Error('Faltan datos requeridos: compañía, conductor o vehículo');
      }

      console.log('Datos verificados para crear ingreso:', {
        compania: formData.compania,
        conductor: formData.conductor,
        vehiculo: formData.vehiculo,
        hasPhotos: formData.fotosEntrada?.length > 0,
        hasSignatures: !!formData.firmas?.encargado && !!formData.firmas?.conductor,
        reparacionesCount: formData.reparacionesSolicitadas?.length || 0
      });

      await ingresosApi.create(formData);
      toast.success('Ingreso creado correctamente');
      await fetchIngresos();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error al crear ingreso:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });

      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message 
        || 'Error al crear el ingreso';
      
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await ingresosApi.update(id, formData);
      toast.success('Ingreso actualizado correctamente');
      await fetchIngresos();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error al actualizar ingreso:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el ingreso');
    }
  };

  const handleDelete = async () => {
    try {
      await ingresosApi.delete(ingresoToDelete);
      toast.success('Ingreso eliminado correctamente');
      await fetchIngresos();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar ingreso:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el ingreso');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Ingresos</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchIngresos()}
            disabled={loading}
            className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading
                ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refrescar
          </button>
          <button
            onClick={() => {
              setCurrentIngreso(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Ingreso
          </button>
        </div>
      </div>

      <IngresoList 
        ingresos={ingresos} 
        loading={loading}
        onEdit={(ingreso) => {
          setCurrentIngreso(ingreso);
          setIsFormOpen(true);
        }}
        onDelete={(id) => {
          setIngresoToDelete(id);
          setIsDeleteModalOpen(true);
        }}
      />

      <IngresoForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(data) => {
          if (currentIngreso) {
            handleUpdate(currentIngreso._id, data);
          } else {
            handleCreate(data);
          }
        }}
        initialData={currentIngreso}
      />

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación">
        <div className="space-y-4">
          <p>¿Estás seguro que deseas eliminar este registro de ingreso?</p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-2 inline" />
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IngresosPage;