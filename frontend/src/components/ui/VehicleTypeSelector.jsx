import React from 'react';
import { TruckIcon, FireIcon, ShoppingBagIcon, CubeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const vehicleTypes = [
  { value: 'van_seco', label: 'Van Seco', icon: <TruckIcon className="h-5 w-5" /> },
  { value: 'van_refrigerado', label: 'Van Refrigerado', icon: <FireIcon className="h-5 w-5" /> },
  { value: 'botellero', label: 'Botellero', icon: <ShoppingBagIcon className="h-5 w-5" /> },
  { value: 'camion', label: 'Camión', icon: <CubeIcon className="h-5 w-5" /> },
  { value: 'pickup', label: 'Pickup', icon: <DevicePhoneMobileIcon className="h-5 w-5" /> },
  { value: 'otro', label: 'Otro', icon: <TruckIcon className="h-5 w-5" /> },
];

export const VehicleTypeSelector = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Vehículo</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {vehicleTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={`flex items-center justify-center p-3 border rounded-lg ${value === type.value ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <span className="mr-2">{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};