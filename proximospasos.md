6. Próximos Pasos

Mejorar Validaciones :
Usa express-validator para validar datos en las rutas.

Agregar Historial :
Implementa un campo historial en los modelos para registrar cambios importantes.

Centralizar Manejo de Errores :
Crea un middleware para manejar errores de manera centralizada.

Agregar Rutas Específicas :
Implementa rutas para devolver productos, desasignar vehículos y registrar reparaciones.

Documentar API :
Usa Swagger para documentar tus rutas.
import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { getProducts, createProduct } from "../utils/api/productApi";

// Configuración del modal
Modal.setAppElement("#root");

const Inventario = () => {
  // Estados principales
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el modal de creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
    categoria: "",
  });

  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Estado para el modal de detalles
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Función para obtener productos
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err.message);
      setError("Error al cargar los productos. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para crear producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    // Validación
    if (!newProduct.nombre || newProduct.cantidad <= 0 || newProduct.precio <= 0) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    try {
      await createProduct(newProduct);
      await fetchProducts(); // Refrescar la lista
      setIsCreateModalOpen(false);
      setNewProduct({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        precio: 0,
        categoria: "",
      });
    } catch (err) {
      console.error("Error al crear el producto:", err.message);
      alert("Hubo un error al crear el producto.");
    }
  };

  // Función para ordenar
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Función para obtener productos filtrados y ordenados
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.SKU?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtro de categoría
    if (categoryFilter) {
      filtered = filtered.filter(product => product.categoria === categoryFilter);
    }
    
    // Aplicar ordenamiento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  };

  // Obtener categorías únicas para el filtro
  const categories = [...new Set(products.map(product => product.categoria).filter(Boolean))];

  // Obtener productos para la página actual
  const filteredProducts = getFilteredAndSortedProducts();
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Efecto para cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  // Renderizar icono de ordenamiento
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventario</h1>

      {/* Controles de búsqueda y filtrado */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border w-full rounded-md px-3 py-2"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border w-full rounded-md px-3 py-2"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Mensajes de estado */}
      {isLoading && (
        <div className="text-center py-8">
          <p>Cargando productos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Tabla de productos */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th 
                    className="p-2 border text-left cursor-pointer"
                    onClick={() => requestSort('SKU')}
                  >
                    SKU {renderSortIcon('SKU')}
                  </th>
                  <th 
                    className="p-2 border text-left cursor-pointer"
                    onClick={() => requestSort('nombre')}
                  >
                    Nombre {renderSortIcon('nombre')}
                  </th>
                  <th 
                    className="p-2 border text-left cursor-pointer"
                    onClick={() => requestSort('cantidad')}
                  >
                    Cantidad {renderSortIcon('cantidad')}
                  </th>
                  <th 
                    className="p-2 border text-left cursor-pointer"
                    onClick={() => requestSort('precio')}
                  >
                    Precio {renderSortIcon('precio')}
                  </th>
                  <th 
                    className="p-2 border text-left cursor-pointer"
                    onClick={() => requestSort('categoria')}
                  >
                    Categoría {renderSortIcon('categoria')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr 
                      key={product._id} 
                      className="border hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <td className="p-2 border">{product.SKU || "N/A"}</td>
                      <td className="p-2 border">{product.nombre || "Sin nombre"}</td>
                      <td className="p-2 border">{product.cantidad || 0}</td>
                      <td className="p-2 border">
                        ${typeof product.precio === "number" ? product.precio.toFixed(2) : "N/A"}
                      </td>
                      <td className="p-2 border">{product.categoria || "Sin categoría"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No se encontraron productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {filteredProducts.length > productsPerPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Anterior
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                // Lógica para mostrar páginas limitadas con elipsis
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = index + 1;
                } else if (currentPage <= 3) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = currentPage - 2 + index;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`mx-1 px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <span className="mx-1 px-3 py-1">...</span>
              )}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Mostrar información de paginación */}
          <div className="text-center mt-2 text-sm text-gray-600">
            Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} productos
          </div>
        </>
      )}

      {/* Modal para crear producto */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Producto</h2>
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={newProduct.nombre}
              onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
              className="border w-full rounded-md px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={newProduct.descripcion}
              onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
              className="border w-full rounded-md px-3 py-2"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
              <input
                type="number"
                min="1"
                value={newProduct.cantidad}
                onChange={(e) => setNewProduct({ ...newProduct, cantidad: parseInt(e.target.value) || 0 })}
                className="border w-full rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={newProduct.precio}
                onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) || 0 })}
                className="border w-full rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input
              type="text"
              value={newProduct.categoria}
              onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
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
              onClick={() => setIsCreateModalOpen(false)}
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

      {/* Modal para detalles del producto */}
      <Modal
        isOpen={!!selectedProduct}
        onRequestClose={() => setSelectedProduct(null)}
        className="p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
      >
        {selectedProduct && (
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedProduct.nombre}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">SKU</h3>
                  <p>{selectedProduct.SKU || "N/A"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
                  <p>{selectedProduct.categoria || "Sin categoría"}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cantidad en stock</h3>
                  <p>{selectedProduct.cantidad || 0}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Precio</h3>
                  <p>${typeof selectedProduct.precio === "number" ? selectedProduct.precio.toFixed(2) : "N/A"}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
              <p className="text-gray-700">
                {selectedProduct.descripcion || "No hay descripción disponible"}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Historial</h3>
              {selectedProduct.historial?.length > 0 ? (
                <ul className="border rounded divide-y">
                  {selectedProduct.historial.map((item, index) => (
                    <li key={index} className="p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.accion}</span>
                        <span className="text-sm text-gray-500">{new Date(item.fecha).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.detalles}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay historial disponible</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventario;