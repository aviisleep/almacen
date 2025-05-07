import React, { useState } from 'react';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

export const FileUpload = ({ label, onFilesChange, multiple = false }) => {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    
    if (multiple) {
      setPreviews([...previews, ...newPreviews]);
    } else {
      setPreviews(newPreviews);
    }
    
    onFilesChange(files);
  };

  const removeImage = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-4 mb-2">
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            <img 
              src={preview.url} 
              alt={preview.name}
              className="h-24 w-24 object-cover rounded border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
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