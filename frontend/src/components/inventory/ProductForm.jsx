import React from 'react';
import Modal from 'react-modal';

const ProductForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product, 
  setProduct, 
  categories 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!product.nombre || product.cantidad <= 0 || product.precio <= 0) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
    
    onSubmit(product);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseInt(value) || 0 :
              name === 'precio' ? parseFloat(value) || 0 :
              value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={product.nombre}
            onChange={handleChange}
            className="border w-full rounded-md px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={product.descripcion}
            onChange={handleChange}
            className="border w-full rounded-md px-3 py-2"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad *
            </label>
            <input
              type="number"
              name="cantidad"
              min="1"
              value={product.cantidad}
              onChange={handleChange}
              className="border w-full rounded-md px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio *
            </label>
            <input
              type="number"
              name="precio"
              min="0.01"
              step="0.01"
              value={product.precio}
              onChange={handleChange}
              className="border w-full rounded-md px-3 py-2"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <input
            type="text"
            name="categoria"
            value={product.categoria}
            onChange={handleChange}
            className="border w-full rounded-md px-3 py-2"
            list="categories"
          />
          <datalist id="categories">
            {categories.map((category, index) => (
              <option key={index} value={category} />
            ))}
          </datalist>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar Producto
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;