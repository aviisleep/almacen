import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const StockModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [quantity, setQuantity] = useState('');
  const [operation, setOperation] = useState('add');
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Resetear el formulario cuando se abre/cierra el modal o cambia el producto
  useEffect(() => {
    if (isOpen && product) {
      setQuantity('');
      setOperation('add');
      setIsValid(false);
      setErrorMessage('');
    }
  }, [isOpen, product]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación adicional por seguridad
    if (!product || !product._id || !isValid) {
      setErrorMessage("Por favor, ingresa una cantidad válida.");
      return;
    }

    const quantityValue = parseFloat(quantity);
    const currentQuantity = product.cantidad || 0;

    // Calcular nueva cantidad asegurando que no sea negativa
    const finalQuantity = operation === 'add' 
      ? currentQuantity + quantityValue
      : Math.max(0, currentQuantity - quantityValue);

    onSubmit(product._id, finalQuantity);
  };

  // Validar el formulario en cada cambio
  useEffect(() => {
    setIsValid(
      !!product &&
      !!quantity && 
      !isNaN(quantity) && 
      parseFloat(quantity) > 0
    );
  }, [quantity, product]);

  // No renderizar si no hay producto
  if (!isOpen || !product) return null;

  const handleClose = () => {
    setQuantity('');
    setOperation('add');
    setIsValid(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
      ariaHideApp={false}
    >
      <h2 className="text-xl font-bold mb-4">Ajustar Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Producto
          </label>
          <p className="font-medium">{product.nombre}</p>
          <p className="text-sm text-gray-600">Stock actual: {product.cantidad || 0}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operación
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="operation"
                value="add"
                checked={operation === 'add'}
                onChange={() => setOperation('add')}
              />
              <span className="ml-2">Agregar</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="operation"
                value="subtract"
                checked={operation === 'subtract'}
                onChange={() => setOperation('subtract')}
              />
              <span className="ml-2">Restar</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || parseFloat(value) >= 0) {
                setQuantity(value);
              }
            }}
            className="border w-full rounded-md px-3 py-2"
            required
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            aria-disabled={!isValid}
            className={`px-4 py-2 rounded ${
              isValid 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isValid}
          >
            Aplicar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StockModal;