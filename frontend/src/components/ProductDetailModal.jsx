import React from "react";
import Modal from "react-modal";

const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  history,
  isEditing,
  onEdit,
  onDelete,
  formData,
  onFormChange,
  onSubmit,
  onCancelEdit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">
          {isEditing ? "Editar Producto" : "Detalles del Producto"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={onFormChange}
                className="border w-full rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={product.SKU}
                className="border w-full rounded-md px-3 py-2 bg-gray-100"
                readOnly
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={onFormChange}
              className="border w-full rounded-md px-3 py-2"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
              <input
                type="number"
                name="cantidad"
                min="1"
                value={formData.cantidad}
                onChange={onFormChange}
                className="border w-full rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <input
                type="number"
                name="precio"
                min="0.01"
                step="0.01"
                value={formData.precio}
                onChange={onFormChange}
                className="border w-full rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={onFormChange}
                className="border w-full rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Información Básica</h3>
              <div className="space-y-2">
                <p><span className="font-medium">SKU:</span> {product.SKU || "N/A"}</p>
                <p><span className="font-medium">Nombre:</span> {product.nombre}</p>
                <p><span className="font-medium">Descripción:</span> {product.descripcion || "N/A"}</p>
                <p><span className="font-medium">Cantidad:</span> {product.cantidad}</p>
                <p><span className="font-medium">Precio:</span> ${typeof product.precio === "number" ? product.precio.toFixed(2) : "N/A"}</p>
                <p><span className="font-medium">Categoría:</span> {product.categoria || "Sin categoría"}</p>
                <p><span className="font-medium">Creado:</span> {new Date(product.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Última actualización:</span> {new Date(product.updatedAt).toLocaleString()}</p>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={onEdit}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Historial de Movimientos</h3>
              {history.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Detalles</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap">{item.accion}</td>
                          <td className="px-4 py-2">{item.detalles}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(item.fecha).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No hay historial registrado para este producto.</p>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ProductDetailModal;