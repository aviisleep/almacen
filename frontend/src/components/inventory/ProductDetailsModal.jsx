import React from 'react';
import Modal from 'react-modal';

const ProductDetailsModal = ({ product, history, onClose }) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={!!product}
      onRequestClose={onClose}
      className="p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{product.nombre}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">SKU</h3>
              <p>{product.SKU || "N/A"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
              <p>{product.categoria || "Sin categoría"}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cantidad en stock</h3>
              <p>{product.cantidad || 0}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Precio</h3>
              <p>${typeof product.precio === "number" ? product.precio.toFixed(2) : "N/A"}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
          <p className="text-gray-700">
            {product.descripcion || "No hay descripción disponible"}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Historial</h3>
          {history && history.length > 0 ? (
            <ul className="border rounded divide-y max-h-60 overflow-y-auto">
              {history.map((item, index) => (
                <li key={index} className="p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.accion}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.fecha).toLocaleString()}
                    </span>
                  </div>
                  {item.detalles && (
                    <p className="text-sm text-gray-600 mt-1">{item.detalles}</p>
                  )}
                  {item.cantidad && (
                    <p className="text-sm text-gray-600 mt-1">
                      Cantidad: {item.cantidad}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay historial disponible</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailsModal;