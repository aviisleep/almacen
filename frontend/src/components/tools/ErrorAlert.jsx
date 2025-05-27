import React from 'react';

export const ErrorAlert = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">Error</p>
          <p>{message}</p>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-red-700 hover:text-red-900"
            aria-label="Cerrar"
          >
            ×
          </button>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};