import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { FileUpload } from '../ui/FileUpload';
import { VehicleTypeSelector } from '../ui/VehicleTypeSelector';
import SignaturePad from './SignaturePad';
import { CheckIcon, UserIcon, PhoneIcon, IdentificationIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export const IngresoForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      compania: '',
      conductor: { nombre: '', telefono: '', cedula: '' },
      vehiculo: { placa: '', tipo: '' },
      reparacionesSolicitadas: [{ descripcion: '', prioridad: 'media' }],
      observaciones: ''
    }
  });

  const [fotos, setFotos] = useState([]);
  const [firmaEncargado, setFirmaEncargado] = useState('');
  const [firmaConductor, setFirmaConductor] = useState('');

  const handleAddReparacion = () => {
    setValue('reparacionesSolicitadas', [
      ...watch('reparacionesSolicitadas'),
      { descripcion: '', prioridad: 'media' }
    ]);
  };

  const handleRemoveReparacion = (index) => {
    const reparaciones = [...watch('reparacionesSolicitadas')];
    reparaciones.splice(index, 1);
    setValue('reparacionesSolicitadas', reparaciones);
  };

  const submitHandler = (data) => {
    onSubmit({
      ...data,
      fotosEntrada: fotos,
      firmas: {
        encargado: firmaEncargado,
        conductor: firmaConductor
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Ingreso' : 'Nuevo Ingreso'}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 overflow-y-auto max-h-[70vh]">
        {/* Datos de la compañía */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Compañía</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register('compania', { required: 'Este campo es requerido' })}
            />
          </div>
          {errors.compania && <p className="mt-1 text-sm text-red-600">{errors.compania.message}</p>}
        </div>

        {/* Datos del conductor */}
        <div className="border p-4 rounded-lg mb-4">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Datos del Conductor</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                {...register('conductor.nombre', { required: 'Este campo es requerido' })}
              />
            </div>
            {errors.conductor?.nombre && <p className="mt-1 text-sm text-red-600">{errors.conductor.nombre.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                {...register('conductor.telefono', { 
                  required: 'Este campo es requerido',
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: 'Número de teléfono inválido'
                  }
                })}
              />
            </div>
            {errors.conductor?.telefono && <p className="mt-1 text-sm text-red-600">{errors.conductor.telefono.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cédula</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IdentificationIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                {...register('conductor.cedula')}
              />
            </div>
          </div>
        </div>

        {/* Datos del vehículo */}
        <div className="border p-4 rounded-lg mb-4">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Datos del Vehículo</h4>
          
          <VehicleTypeSelector 
            value={watch('vehiculo.tipo')} 
            onChange={(value) => setValue('vehiculo.tipo', value)} 
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Placa</label>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 uppercase"
              {...register('vehiculo.placa', { 
                required: 'Este campo es requerido',
                setValueAs: (value) => value.toUpperCase()
              })}
            />
            {errors.vehiculo?.placa && <p className="mt-1 text-sm text-red-600">{errors.vehiculo.placa.message}</p>}
          </div>
        </div>

        {/* Reparaciones solicitadas */}
        <div className="border p-4 rounded-lg mb-4">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Reparaciones Solicitadas</h4>
          
          {watch('reparacionesSolicitadas').map((_, index) => (
            <div key={index} className="mb-4 last:mb-0 border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium text-gray-700">Reparación #{index + 1}</h5>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveReparacion(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  {...register(`reparacionesSolicitadas.${index}.descripcion`, { 
                    required: 'Este campo es requerido' 
                  })}
                />
                {errors.reparacionesSolicitadas?.[index]?.descripcion && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.reparacionesSolicitadas[index].descripcion.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  {...register(`reparacionesSolicitadas.${index}.prioridad`)}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddReparacion}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" />
            Agregar otra reparación
          </button>
        </div>

        {/* Fotos del vehículo */}
        <FileUpload 
          label="Fotos del Vehículo (Entrada)"
          onFilesChange={setFotos}
          multiple={true}
        />

        {/* Firmas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Firma del Encargado</h4>
            <SignaturePad onSave={setFirmaEncargado} />
          </div>
          <div className="border p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Firma del Conductor</h4>
            <SignaturePad onSave={setFirmaConductor} />
          </div>
        </div>

        {/* Observaciones */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
          <textarea
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...register('observaciones')}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {initialData ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};