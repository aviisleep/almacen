import React from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

export const FileUpload = ({ label, onFilesChange, multiple = false }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFilesChange(files);
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
        <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
        <span className="text-sm text-gray-500">Subir {multiple ? 'fotos' : 'foto'}</span>
        <input 
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*"
          multiple={multiple}
        />
      </label>
    </div>
  );
};