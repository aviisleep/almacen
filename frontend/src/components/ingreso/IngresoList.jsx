import React, { useState } from 'react';
import {
  ClockIcon,
  CalendarIcon,
  TruckIcon,
  UserIcon,
  PhoneIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  WrenchIcon,
  TrashIcon,
  PencilIcon,
  CubeIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  IdentificationIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Componente para el modal de imagen
const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        <img
          src={imageUrl}
          alt="Vista completa"
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export const IngresoList = ({ ingresos, loading, onEdit, onDelete }) => {
  const [expandedId, setExpandedId] = React.useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (ingresos.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros de ingreso</h3>
        <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo ingreso de vehículo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ingresos.map((ingreso) => (
        <div key={ingreso._id} className="bg-white shadow overflow-hidden rounded-lg">
          {/* Encabezado del card */}
          <div
            className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => toggleExpand(ingreso._id)}
          >
            <div className="flex items-center space-x-4">
              <VehicleTypeIcon type={ingreso.vehiculo.tipo} className="h-8 w-8" />
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {ingreso.vehiculo.placa}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{ingreso.compania}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  ingreso.estado === 'completado'
                    ? 'bg-green-100 text-green-800'
                    : ingreso.estado === 'en_reparacion'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {ingreso.estado === 'completado'
                  ? 'Completado'
                  : ingreso.estado === 'en_reparacion'
                  ? 'En reparación'
                  : ingreso.estado === 'en_revision'
                  ? 'En revisión'
                  : 'Ingresado'}
              </span>
              <div className="text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                {new Date(ingreso.fechaEntrada).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Contenido expandible */}
          {expandedId === ingreso._id && (
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna izquierda - Información básica */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Información del vehículo</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <TruckIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Tipo de vehículo</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {ingreso.vehiculo.tipo.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Conductor</p>
                        <p className="text-sm text-gray-500">{ingreso.conductor.nombre}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Teléfono</p>
                        <p className="text-sm text-gray-500">{ingreso.conductor.telefono}</p>
                      </div>
                    </div>

                    {ingreso.conductor.cedula && (
                      <div className="flex items-start">
                        <IdentificationIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Cédula</p>
                          <p className="text-sm text-gray-500">{ingreso.conductor.cedula}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Columna derecha - Reparaciones */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Reparaciones solicitadas</h4>
                  <div className="space-y-3">
                    {ingreso.reparacionesSolicitadas.map((reparacion, index) => (
                      <div key={index} className="flex items-start">
                        {reparacion.aprobado ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{reparacion.descripcion}</p>
                          <p className="text-xs text-gray-500 capitalize">Prioridad: {reparacion.prioridad}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fotos y acciones */}
              <div className="mt-6">
                {ingreso.fotosEntrada && ingreso.fotosEntrada.length > 0 && (
                  <>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Fotos del vehículo</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {ingreso.fotosEntrada.map((foto, index) => {
                        // La URL ya viene completa del backend
                        const fotoUrl = foto;
                        
                        return (
                          <div
                            key={index}
                            className="relative aspect-square cursor-pointer group bg-white rounded-lg overflow-hidden border border-gray-200"
                            onClick={() => setSelectedImage(fotoUrl)}
                          >
                            <img
                              src={fotoUrl}
                              alt={`Foto ${index + 1} del vehículo ${ingreso.vehiculo.placa}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                console.error('Error al cargar imagen:', fotoUrl);
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvciBhbCBjYXJnYXIgaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200"></div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Firmas */}
                {ingreso.firmas && (
                  <>
                    <h4 className="text-sm font-medium text-gray-500 mt-6 mb-3">Firmas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ingreso.firmas.encargado && (
                        <div className="border rounded-lg p-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Firma del encargado</h5>
                          <div 
                            className="cursor-pointer"
                            onClick={() => setSelectedImage(ingreso.firmas.encargado)}
                          >
                            <img
                              src={ingreso.firmas.encargado}
                              alt="Firma del encargado"
                              className="w-full h-32 object-contain bg-white"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvciBhbCBjYXJnYXIgaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {ingreso.firmas.conductor && (
                        <div className="border rounded-lg p-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Firma del conductor</h5>
                          <div 
                            className="cursor-pointer"
                            onClick={() => setSelectedImage(ingreso.firmas.conductor)}
                          >
                            <img
                              src={ingreso.firmas.conductor}
                              alt="Firma del conductor"
                              className="w-full h-32 object-contain bg-white"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvciBhbCBjYXJnYXIgaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Botones de acción */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('¿Está seguro de que desea eliminar este ingreso?')) {
                        onDelete(ingreso._id);
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Eliminar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(ingreso);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Modal de imagen */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

// Componente auxiliar para mostrar iconos según tipo de vehículo
const VehicleTypeIcon = ({ type, className }) => {
  const icons = {
    van_seco: <TruckIcon className={className} />,
    van_refrigerado: <SnowflakeIcon className={className} />,
    botellero: <ShoppingBagIcon className={className} />,
    camion: <CubeIcon className={className} />,
    pickup: <DevicePhoneMobileIcon className={className} />,
    otro: <TruckIcon className={className} />,
  };

  return icons[type] || icons.otro;
};

// Icono personalizado
const SnowflakeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);