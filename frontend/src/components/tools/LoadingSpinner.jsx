import React from 'react';

export const LoadingSpinner = ({ fullPage = false, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`flex justify-center items-center ${fullPage ? 'h-64' : ''} ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizes[size]}`}
        aria-label="Cargando..."
      />
    </div>
  );
};