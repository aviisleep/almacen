import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { ingresosApi } from '../../utils/api/ingresos';
import { FileUpload } from '../ui/FileUpload';
import { VehicleTypeSelector } from '../ui/VehicleTypeSelector';
import SignaturePad from './SignaturePad';
import { CheckIcon, UserIcon, PhoneIcon, IdentificationIcon, DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';

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
  const [previews, setPreviews] = useState([]);
  const [firmaEncargado, setFirmaEncargado] = useState('');
  const [firmaConductor, setFirmaConductor] = useState('');
  const [firmasValidas, setFirmasValidas] = useState({
    encargado: false,
    conductor: false
  });

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

  const handleFotosChange = (newFiles) => {
    setFotos(prevFotos => {
      // Crear un Set con los nombres de archivos existentes
      const existingNames = new Set(prevFotos.map(f => f.name));
      
      // Filtrar los nuevos archivos para evitar duplicados
      const uniqueNewFiles = newFiles.filter(f => !existingNames.has(f.name));
      
      // Crear URLs de previsualización para los nuevos archivos
      const newPreviews = uniqueNewFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
      
      // Combinar las fotos existentes con las nuevas
      return [...prevFotos, ...uniqueNewFiles];
    });
  };

  const handleRemoveFoto = (index) => {
    setFotos(prevFotos => {
      const newFotos = [...prevFotos];
      newFotos.splice(index, 1);
      return newFotos;
    });
    
    setPreviews(prevPreviews => {
      const newPreviews = [...prevPreviews];
      // Revocar la URL del objeto para liberar memoria
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  // Limpiar las URLs de objeto al desmontar el componente
  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const handleFirmaEncargado = (signature) => {
    if (signature && signature.startsWith('data:image/png;base64,')) {
      setFirmaEncargado(signature);
      setFirmasValidas(prev => ({ ...prev, encargado: true }));
    } else {
      setFirmasValidas(prev => ({ ...prev, encargado: false }));
    }
  };

  const handleFirmaConductor = (signature) => {
    if (signature && signature.startsWith('data:image/png;base64,')) {
      setFirmaConductor(signature);
      setFirmasValidas(prev => ({ ...prev, conductor: true }));
    } else {
      setFirmasValidas(prev => ({ ...prev, conductor: false }));
    }
  };

  const handleClearFirmaEncargado = () => {
    setFirmaEncargado('');
    setFirmasValidas(prev => ({ ...prev, encargado: false }));
  };

  const handleClearFirmaConductor = () => {
    setFirmaConductor('');
    setFirmasValidas(prev => ({ ...prev, conductor: false }));
  };

  const submitHandler = async (data) => {
    // 1. Validar campos requeridos
    if (!data.compania || !data.conductor.nombre || !data.conductor.telefono || !data.vehiculo.placa || !data.vehiculo.tipo) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // 2. Validar firmas
    if (!firmasValidas.encargado || !firmasValidas.conductor) {
      alert('Debe capturar y guardar ambas firmas para continuar');
      return;
    }

    // 3. Filtrar reparaciones vacías (excepto la primera)
    const reparacionesFiltradas = data.reparacionesSolicitadas.filter((rep, index) => {
      return index === 0 || rep.descripcion.trim() !== '';
    });

    // 4. Preparar datos para el envío
    const formData = {
      compania: data.compania,
      conductor: {
        nombre: data.conductor.nombre,
        telefono: data.conductor.telefono,
        cedula: data.conductor.cedula || ''
      },
      vehiculo: {
        placa: data.vehiculo.placa,
        tipo: data.vehiculo.tipo
      },
      reparacionesSolicitadas: reparacionesFiltradas,
      observaciones: data.observaciones || '',
      fotosEntrada: fotos,
      firmas: {
        encargado: firmaEncargado,
        conductor: firmaConductor
      }
    };

    try {
      let result;
      if (initialData?._id) {
        // Modo edición
        result = await ingresosApi.update(initialData._id, formData);
      } else {
        // Modo creación
        result = await ingresosApi.create(formData);
      }
      onSubmit(result);
      handleClose();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert(`Error al enviar: ${error.message}`);
    }
  };

  // Al inicio del componente
  useEffect(() => {
    if (initialData) {
      // Establecer valores del formulario
      setValue('compania', initialData.compania || '');
      setValue('conductor.nombre', initialData.conductor?.nombre || '');
      setValue('conductor.telefono', initialData.conductor?.telefono || '');
      setValue('conductor.cedula', initialData.conductor?.cedula || '');
      setValue('vehiculo.placa', initialData.vehiculo?.placa || '');
      setValue('vehiculo.tipo', initialData.vehiculo?.tipo || '');
      setValue('observaciones', initialData.observaciones || '');
      
      // Establecer reparaciones
      if (initialData.reparacionesSolicitadas?.length > 0) {
        setValue('reparacionesSolicitadas', initialData.reparacionesSolicitadas);
      }

      // Establecer firmas
      setFirmaEncargado(initialData.firmas?.encargado || '');
      setFirmaConductor(initialData.firmas?.conductor || '');
      setFirmasValidas({
        encargado: !!initialData.firmas?.encargado,
        conductor: !!initialData.firmas?.conductor
      });

      // Establecer fotos
      if (initialData.fotosEntrada?.length > 0) {
        setFotos(initialData.fotosEntrada);
        setPreviews(initialData.fotosEntrada);
      }
    }
  }, [initialData, setValue]);

  const handleClose = () => {
    setFirmaConductor('');
    setFirmaEncargado('');
    setFotos([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={initialData ? 'Editar Ingreso' : 'Nuevo Ingreso'}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 overflow-y-auto max-h-[70vh]">
        {/* Datos de la compañía */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compañía <span className="text-red-500">*</span>
          </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placa <span className="text-red-500">*</span>
            </label>
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
                    required: index === 0 ? 'Este campo es requerido' : false
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

        {/* Fotos de entrada */}
        <div className="border p-4 rounded-lg mb-4">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Fotos de Entrada</h4>
          <FileUpload 
            label="Subir fotos del vehículo"
            onFilesChange={handleFotosChange}
            multiple={true}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {previews.map((preview, index) => (
              <div key={`${fotos[index]?.name}-${index}`} className="relative">
                <img 
                  src={preview} 
                  alt={`Foto ${index + 1}`}
                  className="h-24 w-24 object-cover rounded border border-gray-200 bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvciBhbCBjYXJnYXIgaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Firmas */}
        <div className="border p-4 rounded-lg mb-4">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Firmas</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <SignaturePad 
                onSave={handleFirmaEncargado}
                onClear={handleClearFirmaEncargado}
                description="Firma del encargado"
                required={true}
                initialValue={initialData?.firmas?.encargado || ''}
              />
              {!firmasValidas.encargado && (
                <p className="mt-2 text-sm text-red-600">Por favor guarde la firma del encargado</p>
              )}
            </div>
            <div>
              <SignaturePad 
                onSave={handleFirmaConductor}
                onClear={handleClearFirmaConductor}
                description="Firma del conductor"
                required={true}
                initialValue={initialData?.firmas?.conductor || ''}
              />
              {!firmasValidas.conductor && (
                <p className="mt-2 text-sm text-red-600">Por favor guarde la firma del conductor</p>
              )}
            </div>
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
            {initialData ? 'Actualizar Ingreso' : 'Registrar Ingreso'}
          </button>
        </div>
      </form>
    </Modal>
  );
};