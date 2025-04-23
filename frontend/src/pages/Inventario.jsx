import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { getProducts, createProduct } from "../utils/api/productApi"; // Asegúrate de que la ruta sea correcta

Modal.setAppElement("#root"); // Configura el elemento raíz para react-modal

const Inventario = () => {
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
    categoria: "",
  });

  // Función para obtener todos los productos
  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err.message);
    }
  }, []);

  // Función para manejar la creación del producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    console.log("Datos enviados al backend:", newProduct);
  
    // Validar campos obligatorios
    if (!newProduct.nombre || newProduct.cantidad <= 0 || newProduct.precio <= 0) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
  
    try {
      await createProduct(newProduct); // Llamada a la API para crear el producto
      alert("Producto creado exitosamente.");
      setIsModalOpen(false); // Cerrar el modal
      setNewProduct({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        precio: 0,
        categoria: "",
      }); // Reiniciar el formulario
      fetchProducts(); // Refrescar la lista de productos
    } catch (err) {
      console.error("Error al crear el producto:", err.message);
      alert("Hubo un error al crear el producto.");
    }
  };

  // Obtener productos al cargar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventario</h1>

      {/* Botón para abrir el modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Crear Nuevo Producto
      </button>

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
            <tr key={product._id} className="border hover:bg-gray-100">
              <td className="p-2 border">{product.SKU || "N/A"}</td>
              <td className="p-2 border">{product.nombre || "Sin nombre"}</td>
              <td className="p-2 border">{product.cantidad || 0}</td>
              <td className="p-2 border">
                ${typeof product.precio === "number" ? product.precio.toFixed(2) : "N/A"}
              </td>
              <td className="p-2 border">{product.categoria || "Sin categoría"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para crear un nuevo producto */}
      <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
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
    <textarea
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
        type="button"
        onClick={() => setIsModalOpen(false)}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </div>
  </form>
</Modal>
    </div>
  );
};

export default Inventario;