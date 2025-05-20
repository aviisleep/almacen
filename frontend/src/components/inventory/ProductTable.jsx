import React from 'react';

const ProductTable = ({ 
  products, 
  sortConfig, 
  onSort, 
  onRowClick,
  onEdit,
  onDelete,
  onAdjustStock
}) => {
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th onClick={() => onSort('SKU')}>SKU {renderSortIcon('SKU')}</th>
            <th onClick={() => onSort('nombre')}>Nombre {renderSortIcon('nombre')}</th>
            <th onClick={() => onSort('cantidad')}>Cantidad {renderSortIcon('cantidad')}</th>
            <th onClick={() => onSort('precio')}>Precio {renderSortIcon('precio')}</th>
            <th onClick={() => onSort('categoria')}>Categoría {renderSortIcon('categoria')}</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr 
              key={product._id} 
              className="border hover:bg-gray-100 cursor-pointer"
              onClick={() => onRowClick(product)}
            >
              <td className="p-2 border">{product.SKU || "N/A"}</td>
              <td className="p-2 border">{product.nombre || "Sin nombre"}</td>
              <td className="p-2 border">{product.cantidad || 0}</td>
              <td className="p-2 border">
                ${typeof product.precio === "number" ? product.precio.toFixed(2) : "N/A"}
              </td>
              <td className="p-2 border">{product.categoria || "Sin categoría"}</td>
              <td className="p-2 border">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdjustStock(product, e)}}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
                    title="Ajustar stock"
                  >
                    +/-
                  </button>
                  <button
                    onClick={(e) =>{
                      e.stopPropagation();
                       onEdit(product, e)}}
                    className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-sm hover:bg-yellow-200"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!product._id) {
                        console.error("ID de producto inválido:", product);
                        return;
                      }
                      onDelete(product._id);
                    }}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;