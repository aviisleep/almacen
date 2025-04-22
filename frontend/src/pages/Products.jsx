import React, { useState, useEffect } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
    categoria: "",
  });
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedCategory: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "nameAsc",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState({
    _id: null,
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
    categoria: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Cargar productos desde el backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Error al cargar los productos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error al cargar los productos: ${error.message}`);
    }
  };

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = () => {
    const { searchQuery, selectedCategory, minPrice, maxPrice, sortBy } = filters;
    return products
      .filter((product) => {
        // Filtrar por nombre
        if (searchQuery && !product.nombre.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        // Filtrar por categoría
        if (selectedCategory && product.categoria !== selectedCategory) return false;
        // Filtrar por rango de precios
        const price = parseFloat(product.precio);
        if (minPrice && price < parseFloat(minPrice)) return false;
        if (maxPrice && price > parseFloat(maxPrice)) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "nameAsc":
            return a.nombre.localeCompare(b.nombre);
          case "nameDesc":
            return b.nombre.localeCompare(a.nombre);
          case "priceAsc":
            return a.precio - b.precio;
          case "priceDesc":
            return b.precio - a.precio;
          case "stockAsc":
            return a.cantidad - b.cantidad;
          case "stockDesc":
            return b.cantidad - a.cantidad;
          default:
            return 0;
        }
      });
  };

  // Paginación
  const paginatedProducts = () => {
    const filtered = filteredAndSortedProducts();
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditModalOpen) {
      setProductToEdit((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Crear un nuevo producto
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", newProduct);
    const precio = parseFloat(newProduct.precio);
if (!precio || precio <= 0) {
  alert("El precio debe ser un número mayor que cero.");
  return;
}
    if (!newProduct.nombre.trim()) {
      alert("El nombre del producto es obligatorio.");
      return;
    }
    if (!newProduct.precio || newProduct.precio <= 0) {
      alert("El precio debe ser un número mayor que cero.");
      return;
    }
    console.log("Datos enviados al backend:", newProduct); // Depuración
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error("Error al crear el producto");
      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        precio: 0,
        categoria: "",
      });
      setIsCreateModalOpen(false);
      alert("Producto creado correctamente.");
    } catch (error) {
      alert(`Error al crear el producto: ${error.message}`);
    }
  };

  // Editar un producto
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productToEdit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToEdit),
      });
      if (!response.ok) throw new Error("Error al editar el producto");
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
      );
      setIsEditModalOpen(false);
      setProductToEdit(null);
      alert("Producto editado correctamente.");
    } catch (error) {
      alert(`Error al editar el producto: ${error.message}`);
    }
  };

  // Agregar cantidad a un producto
  const handleAddQuantity = async (id) => {
    const cantidad = window.prompt("Ingrese la cantidad a agregar:");
    if (!cantidad || isNaN(cantidad) || parseInt(cantidad) <= 0) {
      alert("Por favor, ingrese una cantidad válida.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad: parseInt(cantidad) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar cantidad");
      }

      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
      );

      alert("Cantidad agregada correctamente.");
    } catch (error) {
      alert(`Error al agregar cantidad: ${error.message}`);
    }
  };

  // Eliminar un producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el producto");
      setProducts(products.filter((product) => product._id !== id));
      alert("Producto eliminado correctamente.");
    } catch (error) {
      alert(`Error al eliminar el producto: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Productos</h2>

      {/* Botones para Crear Producto y Exportar */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Crear Producto
        </button>
        <button
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Exportar a Excel
        </button>
      </div>

      {/* Barra de Filtros */}
      <FilterBar filters={filters} setFilters={setFilters} products={products} />

      {/* Tabla de Productos */}
      <ProductTable
        products={paginatedProducts()}
        onDelete={handleDelete}
        onEdit={(product) => {
          setProductToEdit(product);
          setIsEditModalOpen(true);
        }}
        onAddQuantity={handleAddQuantity}
      />

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={filteredAndSortedProducts().length}
        itemsPerPage={productsPerPage}
      />

      {/* Modal para Crear Producto */}
      {isCreateModalOpen && (
        <ProductModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
          product={newProduct}
          onChange={handleChange}
          title="Crear Producto"
        />
      )}

      {/* Modal para Editar Producto */}
      {isEditModalOpen && productToEdit && (
        <ProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          product={productToEdit}
          onChange={handleChange}
          title="Editar Producto"
        />
      )}
    </div>
  );
}

// Componente: Barra de Filtros
function FilterBar({ filters, setFilters, products }) {
  const { searchQuery, selectedCategory, minPrice, maxPrice, sortBy } = filters;

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
      {/* Barra de Búsqueda */}
      <div className="relative w-full md:w-auto">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchQuery}
          onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>

      {/* Filtros Adicionales */}
      <select
        value={selectedCategory}
        onChange={(e) => setFilters({ ...filters, selectedCategory: e.target.value })}
        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todas las categorías</option>
        {[...new Set(products.map((product) => product.categoria))].map((category) => (
          <option key={category} value={category}>
            {category || "Sin categoría"}
          </option>
        ))}
      </select>
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <input
          type="number"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          className="w-full md:w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="w-full md:w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        value={sortBy}
        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="nameAsc">Nombre (A-Z)</option>
        <option value="nameDesc">Nombre (Z-A)</option>
        <option value="priceAsc">Precio (Menor a Mayor)</option>
        <option value="priceDesc">Precio (Mayor a Menor)</option>
        <option value="stockAsc">Stock (Menor a Mayor)</option>
        <option value="stockDesc">Stock (Mayor a Menor)</option>
      </select>
    </div>
  );
}

// Componente: Tabla de Productos
function ProductTable({ products, onDelete, onEdit, onAddQuantity }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nombre
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            SKU
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Descripción
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cantidad
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Precio
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Categoría
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.length > 0 ? (
          products.map((product) => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.nombre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.SKU || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.descripcion || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.cantidad}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${product.precio.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.categoria || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex space-x-2">
              <button
                  title="Agregar"
                  className="text-yellow-500 hover:text-yellow-700"
                  onClick={() => onAddQuantity(product._id)}
                >
                  ✏️Add
                </button>
                <button
                  title="Editar"
                  className="text-yellow-500 hover:text-yellow-700"
                  onClick={() => onEdit(product)}
                >
                  ✏️
                </button>
                <button
                  title="Eliminar"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(product._id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center py-4">
              No hay productos disponibles.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Componente: Paginación
function Pagination({ currentPage, setCurrentPage, totalItems, itemsPerPage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="px-4 py-2 bg-gray-200 rounded-md">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}

// Componente: Modal para Crear/Editar Productos
function ProductModal({ isOpen, onClose, onSubmit, product, onChange, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto z-50">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={product.nombre}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={product.descripcion}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={product.cantidad}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="precio"
              value={product.precio}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              name="categoria"
              value={product.categoria}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Products;
export { Products, FilterBar, ProductTable, Pagination, ProductModal };
