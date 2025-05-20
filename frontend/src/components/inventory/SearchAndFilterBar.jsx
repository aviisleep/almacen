import React from "react";

const SearchAndFilterBar = ({ searchTerm, categoryFilter, categories, onSearch, onFilter, onCreate }) => {
    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="border w-full rounded-md px-3 py-2"
        />
        <select
          value={categoryFilter}
          onChange={(e) => onFilter(e.target.value)}
          className="border w-full md:w-64 rounded-md px-3 py-2"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={onCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Nuevo Producto
        </button>
      </div>
    );
  };
  
  export default SearchAndFilterBar;