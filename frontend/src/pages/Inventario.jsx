import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductById,
  getProductHistory
} from "../utils/api/productApi";
import ProductDetailModal from "../components/ProductDetailModal";
import Pagination from "../components/Pagination";

Modal.setAppElement("#root");

const Inventario = () => {
  const [products, setProducts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productHistory, setProductHistory] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;

  const [productForm, setProductForm] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
    categoria: "",
  });

  // Función para obtener productos paginados
  const fetchProducts = useCallback(async (page = 1) => {
    try {
      const res = await getProducts(page, itemsPerPage);
      setProducts(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalProducts(res.pagination.total);
    } catch (err) {
      console.error("Error al obtener productos:", err.message);
    }
  }, []);

  // Función para manejar cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  // Función para abrir modal de detalle por ID
  const openDetailModal = async (productId) => {
    try {
      const product = await getProductById(productId);
      const history = await getProductHistory(productId);
      setSelectedProduct(product.data);
      setProductHistory(history.data || []);
      setIsDetailModalOpen(true);
      setIsEditing(false); // Mostrar modo lectura por defecto
    } catch (err) {
      alert(`Error al cargar detalles: ${err.message}`);
    }
  };

  // Función para crear producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    if (!productForm.nombre || productForm.cantidad <= 0 || productForm.precio <= 0) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await createProduct(productForm);
      alert("Producto creado exitosamente.");
      setIsCreateModalOpen(false);
      setProductForm({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        precio: 0,
        categoria: "",
      });
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Error al crear el producto:", err.message);
      alert("Hubo un error al crear el producto.");
    }
  };

  // Función para actualizar producto
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    if (!productForm.nombre || productForm.cantidad <= 0 || productForm.precio <= 0) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await updateProduct(selectedProduct._id, productForm);
      alert("Producto actualizado exitosamente.");
      setIsEditing(false);
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Error al actualizar el producto:", err.message);
      alert("Hubo un error al actualizar el producto.");
    }
  };

  // Función para eliminar producto
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(productId);
        alert("Producto eliminado exitosamente.");
        fetchProducts(currentPage);
        setIsDetailModalOpen(false);
      } catch (err) {
        console.error("Error al eliminar el producto:", err.message);
        alert("Hubo un error al eliminar el producto.");
      }
    }
  };

  // Función para preparar formulario de edición
  const prepareEditForm = () => {
    setProductForm({
      nombre: selectedProduct.nombre,
      descripcion: selectedProduct.descripcion,
      cantidad: selectedProduct.cantidad,
      precio: selectedProduct.precio,
      categoria: selectedProduct.categoria,
    });
    setIsEditing(true);
  };

  // Efecto para cargar productos al inicio
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventario</h1>

      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-gray-600">Total de productos: {totalProducts}</span>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Crear Nuevo Producto
        </button>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr 
                key={product._id} 
                className="hover:bg-gray-50 underline cursor-pointer"
                onClick={() => openDetailModal(product._id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.SKU || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${typeof product.precio === "number" ? product.precio.toFixed(2) : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.categoria || "Sin categoría"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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
              value={productForm.nombre}
              onChange={(e) => setProductForm({...productForm, nombre: e.target.value})}
              className="border w-full rounded-md px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={productForm.descripcion}
              onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})}
              className="border w-full rounded-md px-3 py-2"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
              <input
                type="number"
                min="1"
                value={productForm.cantidad}
                onChange={(e) => setProductForm({...productForm, cantidad: parseInt(e.target.value) || 0})}
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
                value={productForm.precio}
                onChange={(e) => setProductForm({...productForm, precio: parseFloat(e.target.value) || 0})}
                className="border w-full rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input
              type="text"
              value={productForm.categoria}
              onChange={(e) => setProductForm({...productForm, categoria: e.target.value})}
              className="border w-full rounded-md px-3 py-2"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de detalle del producto */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setIsEditing(false);
          }}
          product={selectedProduct}
          history={productHistory}
          isEditing={isEditing}
          onEdit={prepareEditForm}
          onDelete={handleDeleteProduct}
          formData={productForm}
          onFormChange={(e) => {
            const { name, value } = e.target;
            setProductForm({
              ...productForm,
              [name]: name === "cantidad" ? parseInt(value) || 0 : 
                      name === "precio" ? parseFloat(value) || 0 : 
                      value
            });
          }}
          onSubmit={isEditing ? handleUpdateProduct : null}
          onCancelEdit={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default Inventario;