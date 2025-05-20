import React from "react";
import { useProducts } from "../hooks/useProducts";
import ProductTable from "./ProductTable";
import SearchAndFilterBar from "./SearchAndFilterBar";
import Pagination from "./Pagination";
import ProductForm from "./ProductForm";
import ProductDetailsModal from "./ProductDetailsModal";

const InventoryLayout = () => {
  const { products, isLoading, error, addProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Lógica de filtrado, ordenamiento y paginación aquí...

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventario</h1>

      <SearchAndFilterBar
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        categories={[...new Set(products.map(p => p.categoria))]}
        onSearch={setSearchTerm}
        onFilter={setCategoryFilter}
        onCreate={() => setIsCreateModalOpen(true)}
      />

      {isLoading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <ProductTable
            products={filteredProducts}
            onSort={handleSort}
            sortConfig={sortConfig}
            onRowClick={setSelectedProduct}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProducts.length / 10)}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ProductForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProduct}
      />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default InventoryLayout;