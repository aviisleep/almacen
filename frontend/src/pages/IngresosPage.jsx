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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  const handleCreate = async (formData) => {
    try {
      // Preparar el FormData correctamente
      const dataToSend = new FormData();
      
      // Agregar campos simples
      dataToSend.append('compania', formData.compania);
      dataToSend.append('observaciones', formData.observaciones || '');
      
      // Agregar objetos anidados como JSON
      dataToSend.append('conductor', JSON.stringify(formData.conductor));
      dataToSend.append('vehiculo', JSON.stringify(formData.vehiculo));
      
      // Agregar reparaciones
      dataToSend.append('reparacionesSolicitadas', JSON.stringify(formData.reparacionesSolicitadas));
      
      // Agregar fotos (si existen)
      if (formData.fotosEntrada && formData.fotosEntrada.length > 0) {
        formData.fotosEntrada.forEach((file, index) => {
          dataToSend.append('fotos', file);
        });
      }
      
      // Agregar firmas (si existen)
      if (formData.firmas.encargado) {
        dataToSend.append('firmaEncargado', formData.firmas.encargado);
      }
      if (formData.firmas.conductor) {
        dataToSend.append('firmaConductor', formData.firmas.conductor);
      }
      
      console.log('Datos a enviar:', Object.fromEntries(dataToSend)); // Para debug
      
      await ingresosApi.create(dataToSend);
      toast.success('Ingreso creado correctamente');
      fetchIngresos();
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Error al crear el ingreso');
      console.error('Error detallado:', error.response?.data || error.message);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await ingresosApi.update(id, formData);
      toast.success('Ingreso actualizado correctamente');
      fetchIngresos();
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Error al actualizar el ingreso');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await ingresosApi.delete(ingresoToDelete);
      toast.success('Ingreso eliminado correctamente');
      fetchIngresos();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Error al eliminar el ingreso');
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Ingresos</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchIngresos()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
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

      {/* Modal de confirmación para eliminar */}
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