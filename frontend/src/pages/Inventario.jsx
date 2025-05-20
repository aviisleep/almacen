import React, { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "react-modal";
import {
  getProducts,
  getById,
  createProduct,
  update,
  deleteProduct,
  updatecantidad,
  getHistory,
} from "../utils/api/productApi";
import ProductTable from "../components/inventory/ProductTable";
import SearchAndFilterBar from "../components/inventory/SearchAndFilterBar";
import Pagination from "../components/inventory/Pagination";
import ProductForm from "../components/inventory/ProductForm";
import ProductDetailsModal from "../components/inventory/ProductDetailsModal";
import StockModal from "../components/inventory/StockModal";

// Configuración de react-modal
Modal.setAppElement("#root");

const Inventario = () => {
  // Estados principales
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [productForStockAdjustment, setProductForStockAdjustment] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productHistory, setProductHistory] = useState([]);

  // Estados para formularios
  const [newProduct, setNewProduct] = useState({
    _id: null,
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
    categoria: "",
  });

  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Función para obtener productos con paginación
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProducts(currentPage, productsPerPage);

      const productsArray = Array.isArray(response.products)
        ? response.products
        : Array.isArray(response)
        ? response
        : [];

      const totalCount = response.total || productsArray.length || 0;

      setProducts(productsArray);
      setTotalProducts(totalCount);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("Error al cargar los productos. Intente nuevamente.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, productsPerPage]);

  // Efecto para cargar productos al montar el componente o cambiar página
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  // Función para manejar creación/actualización de producto
  const handleSaveProduct = async (productData) => {
    try {
      if (productData._id) {
        await update(productData._id, productData);
      } else {
        await createProduct(productData);
      }
      await fetchProducts();
      setIsCreateModalOpen(false);
      resetProductForm();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert(`Error al guardar producto: ${err.message}`);
    }
  };

  // Función para manejar cambio de cantidad
  const handleUpdateCantidad = async (productId, cantidad) => {
    try {
      await updatecantidad(productId, { cantidad });
      await fetchProducts();
      setIsStockModalOpen(false);
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      alert(`Error al actualizar cantidad: ${err.message}`);
    }
  };

  // Función para preparar el ajuste de stock
  const prepareStockAdjustment = (product) => {
    setIsStockModalOpen(false); // Cerrar el modal si está abierto
    setProductForStockAdjustment(product); // Establecer el producto seleccionado
    setIsStockModalOpen(true); // Abrir el modal de ajuste de stock
  };

  // Función para abrir el modal de detalles del producto
  const openProductDetailsModal = async (product) => {
    setSelectedProduct(product);
    try {
      const historyResponse = await getHistory(product._id);
      setProductHistory(historyResponse.data || []);
    } catch (err) {
      console.error("Error al obtener el historial del producto:", err);
      setProductHistory([]);
    }
  };

  // Función para resetear formulario de producto
  const resetProductForm = () => {
    setNewProduct({
      _id: null,
      nombre: "",
      descripcion: "",
      cantidad: 0,
      precio: 0,
      categoria: "",
    });
  };

  // Función para manejar la eliminación de un producto
  const handleDelete = async (productId) => {
    try {
      // Confirmar con el usuario antes de eliminar
      const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
      if (!confirmDelete) return;

      // Llamar al backend para eliminar el producto
      await deleteProduct(productId);

      // Recargar la lista de productos
      await fetchProducts();

      // Mostrar mensaje de éxito
      alert("Producto eliminado exitosamente.");
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert(`Error al eliminar producto: ${err.message}`);
    }
  };

  // Obtener productos filtrados y ordenados
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.SKU?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((product) => product.categoria === categoryFilter);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, searchTerm, categoryFilter, sortConfig]);

  // Obtener categorías únicas para el filtro
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.categoria).filter(Boolean))],
    [products]
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventario</h1>

      {/* Barra de búsqueda y filtros */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        categoryFilter={categoryFilter}
        onFilter={setCategoryFilter}
        categories={categories}
        onCreate={() => setIsCreateModalOpen(true)}
      />

      {/* Mensajes de carga o error */}
      {isLoading && <div className="text-center py-8">Cargando productos...</div>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabla de productos */}
      {!isLoading && !error && (
        <>
          <ProductTable
            products={filteredProducts}
            sortConfig={sortConfig}
            onSort={(key) => {
              let direction = "asc";
              if (sortConfig.key === key && sortConfig.direction === "asc") {
                direction = "desc";
              }
              setSortConfig({ key, direction });
            }}
            onRowClick={(product) => openProductDetailsModal(product)}
            onEdit={(product) => {
              setNewProduct(product);
              setIsCreateModalOpen(true);
            }}
            onDelete={handleDelete}
            onAdjustStock={prepareStockAdjustment}
          />

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalProducts / productsPerPage)}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Modal para crear/editar productos */}
      <ProductForm
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetProductForm();
        }}
        onSubmit={handleSaveProduct}
        product={newProduct}
        setProduct={setNewProduct}
        categories={categories}
      />

      {/* Modal para ajustar stock */}
      <StockModal
        key={productForStockAdjustment?._id} // Forzar remontaje con una clave única
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        product={productForStockAdjustment}
        onSubmit={handleUpdateCantidad}
      />

      {/* Modal para detalles del producto */}
      <ProductDetailsModal
        key={selectedProduct?._id} // Forzar remontaje con una clave única
        product={selectedProduct}
        history={productHistory}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Inventario;