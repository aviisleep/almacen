// src/components/ProductsTable.jsx
import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Asegúrate de tener 'react-modal' instalado
import { getProducts, getProductById, createProduct } from "../utils/api";

Modal.setAppElement("#root"); // Configura el app element para react-modal

const ProductsTable = () => {
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de detalles
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false); // Estado para el modal de creación
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
    categoria: "",
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 }); // Estado para la paginación

  // Función para obtener todos los productos paginados
  const fetchProducts = React.useCallback(async (page = pagination.page, limit = pagination.limit) => {
    try {
      const res = await getProducts(page, limit);
      setProducts(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err.message);
    }
  }, [pagination.page, pagination.limit]);

  // Función para obtener los detalles de un producto
  const fetchProductDetails = async (productId) => {
    try {
      const product = await getProductById(productId);
      setSelectedProduct(product);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error al obtener detalles del producto:", err.message);
    }
  };

  // Función para crear un nuevo producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.nombre || newProduct.cantidad <= 0 || newProduct.precio <= 0) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await createProduct(newProduct);
      setIsNewProductModalOpen(false);
      fetchProducts(); // Refrescar la lista de productos
      setNewProduct({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        precio: 0,
        categoria: "",
      });
    } catch (err) {
      console.error("Error al crear producto:", err.message);
    }
  };

  // Cerrar el modal de detalles
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // Obtener productos al cargar el componente
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.limit, fetchProducts]);

  return (
    <div className="p-6">
      {/* Botón para abrir el modal de creación */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista de Productos</h1>
        <button
          onClick={() => setIsNewProductModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear Producto
        </button>
      </div>

      {/* Tabla de productos */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border text-left">SKU</th>
            <th className="p-2 border text-left">Nombre</th>
            <th className="p-2 border text-left">Cantidad</th>
            <th className="p-2 border text-left">Precio</th>
            <th className="p-2 border text-left">Categoría</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border hover:bg-gray-100 cursor-pointer"
              onClick={() => fetchProductDetails(product._id)}
            >
              <td className="p-2 border">{product.SKU || "N/A"}</td>
              <td className="p-2 border font-bold text-blue-600 hover:underline">
                {product.nombre || "Sin nombre"}
              </td>
              <td className="p-2 border">{product.cantidad || 0}</td>
              <td className="p-2 border">
                ${product.precio ? product.precio.toFixed(2) : "N/A"}
              </td>
              <td className="p-2 border">{product.categoria || "Sin categoría"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() =>
            setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
          }
          disabled={pagination.page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Anterior
        </button>
        <span>Página {pagination.page}</span>
        <button
          onClick={() =>
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Siguiente
        </button>
      </div>

      {/* Modal para mostrar detalles del producto */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="p-6 bg-white rounded-lg shadow-lg w-96"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
      >
        {selectedProduct && (
          <>
            <h2 className="text-xl font-bold mb-4">Detalles del Producto</h2>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>SKU:</strong> {selectedProduct.SKU || "N/A"}
              </p>
              <p>
                <strong>Nombre:</strong> {selectedProduct.nombre || "Sin nombre"}
              </p>
              <p>
                <strong>Cantidad:</strong> {selectedProduct.cantidad || 0}
              </p>
              <p>
                <strong>Precio:</strong>{" "}
                {selectedProduct.precio ? `$${selectedProduct.precio.toFixed(2)}` : "N/A"}
              </p>
              <p>
                <strong>Categoría:</strong> {selectedProduct.categoria || "Sin categoría"}
              </p>
              <p>
                <strong>Descripción:</strong>{" "}
                {selectedProduct.descripcion || "Sin descripción"}
              </p>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Editar
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Modal para crear un nuevo producto */}
      <Modal
        isOpen={isNewProductModalOpen}
        onRequestClose={() => setIsNewProductModalOpen(false)}
        className="p-6 bg-white rounded-lg shadow-lg w-96"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Producto</h2>
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newProduct.nombre}
            onChange={(e) =>
              setNewProduct({ ...newProduct, nombre: e.target.value })
            }
            className="border w-full rounded-md px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newProduct.descripcion}
            onChange={(e) =>
              setNewProduct({ ...newProduct, descripcion: e.target.value })
            }
            className="border w-full rounded-md px-3 py-2"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={newProduct.cantidad}
            onChange={(e) =>
              setNewProduct({ ...newProduct, cantidad: parseInt(e.target.value) || 0 })
            }
            className="border w-full rounded-md px-3 py-2"
            min={1}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={newProduct.precio}
            onChange={(e) =>
              setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) || 0 })
            }
            className="border w-full rounded-md px-3 py-2"
            min={0.01}
            step={0.01}
            required
          />
          <input
            type="text"
            placeholder="Categoría"
            value={newProduct.categoria}
            onChange={(e) =>
              setNewProduct({ ...newProduct, categoria: e.target.value })
            }
            className="border w-full rounded-md px-3 py-2"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsNewProductModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsTable;