import React, { useState, useEffect } from 'react';
import { createQuotation, updateQuotation } from '../../utils/api/quotations';

export default function QuotationForm({ isOpen, onClose, initialData }) {
  const [form, setForm] = useState({
    placa: '',
    empresa: '',
    products: [],
    subtotal: 0,
    iva: 0,
    total: 0,
  });

  const [currentProduct, setCurrentProduct] = useState({
    nombre: '',
    categoria: '',
    unidad: 'und',
    cantidad: 0,
    unitPrice: 0,
    total: 0,
    provider: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        placa: '',
        empresa: '',
        products: [],
        subtotal: 0,
        iva: 0,
        total: 0
      });
    }
  }, [initialData]);

  const handleProductAdd = () => {
    const total = currentProduct.cantidad * currentProduct.unitPrice;
    const updatedProduct = { ...currentProduct, total };
    const updatedProducts = [...form.products, updatedProduct];
    const subtotal = updatedProducts.reduce((acc, p) => acc + p.total, 0);
    const iva = subtotal * 0.16;
    const totalSum = subtotal + iva;

    setForm({ ...form, products: updatedProducts, subtotal, iva, total: totalSum });
    setCurrentProduct({
      nombre: '',
      categoria: '',
      unidad: 'und',
      cantidad: 0,
      unitPrice: 0,
      total: 0,
      provider: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData) {
      await updateQuotation(initialData._id, form);
    } else {
      await createQuotation(form);
    }
    onClose();
  };

  if (!isOpen) return null;

  const handleRemoveProduct = (index) => {
    const updatedProducts = form.products.filter((_, i) => i !== index);
    const subtotal = updatedProducts.reduce((acc, p) => acc + p.total, 0);
    const iva = subtotal * 0.16;
    const totalSum = subtotal + iva;
  
    setForm({
      ...form,
      products: updatedProducts,
      subtotal,
      iva,
      total: totalSum,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded shadow-md w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4">{initialData ? 'Editar Cotización' : 'Nueva Cotización'}</h2>

        <input
          placeholder="Placa"
          value={form.placa}
          onChange={(e) => setForm({ ...form, placa: e.target.value })}
          className="w-full border p-2 mb-2 rounded text-sm"
          required
        />

        <input
          placeholder="Empresa"
          value={form.empresa}
          onChange={(e) => setForm({ ...form, empresa: e.target.value })}
          className="w-full border p-2 mb-4 rounded text-sm"
          required
        />

       {/* Producto temporal */}
<div className="border p-4 rounded bg-gray-50 mb-4">
  <h3 className="text-sm font-semibold mb-4">Agregar producto</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 mb-4">
    <span>Nombre</span>
    <span>Categoría</span>
    <span>Cantidad</span>
    <span>Precio Unitario</span>
    <span>Unidad</span>
    <span>Proveedor</span>
  </div>

  <div className="grid grid-cols-6 gap-2 mb-4">
    <input
      type="text"
      placeholder="Nombre"
      className="border p-1 rounded text-sm"
      value={currentProduct.nombre}
      onChange={(e) => setCurrentProduct({ ...currentProduct, nombre: e.target.value })}
    />
    <input
      type="text"
      placeholder="Categoría"
      className="border p-1 rounded text-sm"
      value={currentProduct.categoria}
      onChange={(e) => setCurrentProduct({ ...currentProduct, categoria: e.target.value })}
    />
    <input
      type="number"
      placeholder="Cantidad"
      className="border p-1 rounded text-sm"
      value={currentProduct.cantidad}
      onChange={(e) => setCurrentProduct({ ...currentProduct, cantidad: parseFloat(e.target.value) || 0 })}
    />
    <input
      type="number"
      placeholder="Precio"
      className="border p-1 rounded text-sm"
      value={currentProduct.unitPrice}
      onChange={(e) => setCurrentProduct({ ...currentProduct, unitPrice: parseFloat(e.target.value) || 0 })}
    />
    <input
      type="text"
      placeholder="Unidad"
      className="border p-1 rounded text-sm"
      value={currentProduct.unidad}
      onChange={(e) => setCurrentProduct({ ...currentProduct, unidad: e.target.value })}
    />
    <input
      type="text"
      placeholder="Proveedor"
      className="border p-1 rounded text-sm"
      value={currentProduct.provider}
      onChange={(e) => setCurrentProduct({ ...currentProduct, provider: e.target.value })}
    />
  </div>

  <button
    type="button"
    onClick={handleProductAdd}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded"
  >
    Agregar producto
  </button>
</div>


        {/* Lista de productos */}
<div className="mb-4">
  <h3 className="font-semibold text-sm mb-2">Productos en cotización:</h3>
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white text-sm text-left border hidden sm:table">
      <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-3 border">Nombre</th>
          <th className="py-2 px-3 border">Categoría</th>
          <th className="py-2 px-3 border">Cantidad</th>
          <th className="py-2 px-3 border">Unidad</th>
          <th className="py-2 px-3 border">Precio Unitario</th>
          <th className="py-2 px-3 border">Total</th>
          <th className="py-2 px-3 border">Proveedor</th>
          <th className="py-2 px-3 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {form.products.map((p, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="py-1 px-3 border">{p.nombre}</td>
            <td className="py-1 px-3 border">{p.categoria}</td>
            <td className="py-1 px-3 border">{p.cantidad}</td>
            <td className="py-1 px-3 border">{p.unidad}</td>
            <td className="py-1 px-3 border">${p.unitPrice.toFixed(2)}</td>
            <td className="py-1 px-3 border font-semibold">${p.total.toFixed(2)}</td>
            <td className="py-1 px-3 border">{p.provider}</td>
            <td className="py-1 px-3 border text-center">
              <button
                type="button"
                onClick={() => handleRemoveProduct(idx)}
                className="text-red-600 hover:underline text-xs"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
   {/* Vista tipo lista para móviles */}
   <div className="sm:hidden space-y-2">
            {form.products.map((p, idx) => (
              <div key={idx} className="border p-2 rounded bg-gray-50 text-sm">
                <p><strong>Nombre:</strong> {p.nombre}</p>
                <p><strong>Categoría:</strong> {p.categoria}</p>
                <p><strong>Cantidad:</strong> {p.cantidad}</p>
                <p><strong>Unidad:</strong> {p.unidad}</p>
                <p><strong>Precio:</strong> ${p.unitPrice.toFixed(2)}</p>
                <p><strong>Total:</strong> ${p.total.toFixed(2)}</p>
                <p><strong>Proveedor:</strong> {p.provider}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(idx)}
                  className="text-red-600 hover:underline text-xs mt-1"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* Totales */}
        <div className="mb-4 text-sm">
          <p>Subtotal: ${form.subtotal.toFixed(2)}</p>
          <p>IVA (19%): ${form.iva.toFixed(2)}</p>
          <p className="font-bold">Total: ${form.total.toFixed(2)}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <button type="button" 
          onClick={onClose} 
          className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded">
            Guardar Cotización
          </button>
        </div>
      </form>
    </div>
  );
}
