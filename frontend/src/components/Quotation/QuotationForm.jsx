import React, { useState, useEffect } from 'react';
import { createQuotation, updateQuotation } from '../../utils/api/quotations';
import { toast } from 'react-toastify';

export default function QuotationForm({ isOpen, onClose, initialData }) {
  const [currentProduct, setCurrentProduct] = useState({
    nombre: '',
    categoria: '',
    unidad: 'und',
    cantidad: 1,
    unitPrice: 0,
    total: 0,
    provider: '',
    status: 'pendiente',
    aprobado: false,
    eliminado: false
  });

  const [form, setForm] = useState({
    placa: '',
    empresa: '',
    cliente: '',
    fecha: new Date().toISOString().split('T')[0],
    products: [],
    subtotal: 0,
    iva: 0,
    total: 0,
    estado: 'pendiente',
    observaciones: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Asegurarnos de que todos los campos tengan valores por defecto
      const formattedData = {
        placa: initialData.placa || '',
        empresa: initialData.empresa || '',
        cliente: initialData.cliente || '',
        fecha: initialData.fecha ? new Date(initialData.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        products: initialData.products ? initialData.products.map(product => ({
          nombre: product.nombre || '',
          categoria: product.categoria || '',
          unidad: product.unidad || 'und',
          cantidad: Number(product.cantidad) || 1,
          unitPrice: Number(product.unitPrice) || 0,
          total: Number(product.total) || 0,
          provider: product.provider || '',
          status: product.status || 'pendiente',
          aprobado: product.aprobado || false,
          eliminado: product.eliminado || false
        })) : [],
        subtotal: Number(initialData.subtotal) || 0,
        iva: Number(initialData.iva) || 0,
        total: Number(initialData.total) || 0,
        estado: initialData.estado || 'pendiente',
        observaciones: initialData.observaciones || ''
      };
      setForm(formattedData);
    }
  }, [initialData]);

  const handleProductAdd = () => {
    // Validar campos obligatorios del producto
    if (!currentProduct.nombre || !currentProduct.categoria || !currentProduct.cantidad || !currentProduct.unitPrice) {
      toast.error('Por favor complete todos los campos obligatorios del producto');
      return;
    }

    const total = Number(currentProduct.cantidad) * Number(currentProduct.unitPrice);
    const updatedProduct = { 
      ...currentProduct, 
      total,
      cantidad: Number(currentProduct.cantidad),
      unitPrice: Number(currentProduct.unitPrice)
    };
    
    const updatedProducts = [...form.products, updatedProduct];
    const subtotal = updatedProducts.reduce((acc, p) => acc + Number(p.total), 0);
    const iva = subtotal * 0.19; // IVA 19%
    const totalSum = subtotal + iva;

    setForm({ 
      ...form, 
      products: updatedProducts, 
      subtotal: Number(subtotal), 
      iva: Number(iva), 
      total: Number(totalSum) 
    });
    
    setCurrentProduct({
      nombre: '',
      categoria: '',
      unidad: 'und',
      cantidad: 1,
      unitPrice: 0,
      total: 0,
      provider: '',
      status: 'pendiente',
      aprobado: false,
      eliminado: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validar el formulario
      if (!validateForm()) {
        setSubmitting(false);
        return;
      }

      // Preparar los datos para enviar
      const formData = {
        ...form,
        products: form.products.map(product => ({
          ...product,
          cantidad: Number(product.cantidad),
          unitPrice: Number(product.unitPrice),
          total: Number(product.cantidad * product.unitPrice)
        })),
        subtotal: Number(form.subtotal),
        iva: Number(form.iva),
        total: Number(form.total)
      };

      let response;
      if (initialData) {
        // Actualizar cotización existente
        response = await updateQuotation(initialData._id, formData);
        if (response.error) {
          throw new Error(response.error);
        }
        toast.success('Cotización actualizada correctamente');
      } else {
        // Crear nueva cotización
        response = await createQuotation(formData);
        if (response.error) {
          throw new Error(response.error);
        }
        toast.success('Cotización creada correctamente');
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar la cotización:', error);
      setError(error.message || 'Error al guardar la cotización');
      toast.error(error.message || 'Error al guardar la cotización');
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors = [];

    // Validar campos requeridos
    if (!form.placa) errors.push('La placa es requerida');
    if (!form.empresa) errors.push('La empresa es requerida');
    if (!form.cliente) errors.push('El cliente es requerido');
    if (!form.fecha) errors.push('La fecha es requerida');

    // Validar productos solo si es una nueva cotización
    if (!initialData && (!form.products || form.products.length === 0)) {
      errors.push('Debe agregar al menos un producto');
    }

    // Validar productos existentes
    if (form.products && form.products.length > 0) {
      form.products.forEach((product, index) => {
        if (!product.nombre) errors.push(`El nombre del producto ${index + 1} es requerido`);
        if (!product.categoria) errors.push(`La categoría del producto ${index + 1} es requerida`);
        if (!product.cantidad || product.cantidad <= 0) errors.push(`La cantidad del producto ${index + 1} debe ser mayor a 0`);
        if (!product.unitPrice || product.unitPrice <= 0) errors.push(`El precio unitario del producto ${index + 1} debe ser mayor a 0`);
      });
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      toast.error(errors[0]);
      return false;
    }

    return true;
  };

  if (!isOpen) return null;

  const handleRemoveProduct = (index) => {
    const updatedProducts = form.products.filter((_, i) => i !== index);
    const subtotal = updatedProducts.reduce((acc, p) => acc + p.total, 0);
    const iva = subtotal * 0.19;
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.placa}
              onChange={(e) => setForm({ ...form, placa: e.target.value.toUpperCase() })}
              className={`w-full border p-2 rounded text-sm ${error ? 'border-red-500' : ''}`}
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              className={`w-full border p-2 rounded text-sm ${error ? 'border-red-500' : ''}`}
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.cliente}
              onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              className={`w-full border p-2 rounded text-sm ${error ? 'border-red-500' : ''}`}
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className={`w-full border p-2 rounded text-sm ${error ? 'border-red-500' : ''}`}
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>

        {/* Producto temporal - Solo mostrar si es una nueva cotización o si no hay productos */}
        {(!initialData || form.products.length === 0) && (
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
                placeholder="Nombre *"
                className="border p-1 rounded text-sm"
                value={currentProduct.nombre}
                onChange={(e) => setCurrentProduct({ ...currentProduct, nombre: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Categoría *"
                className="border p-1 rounded text-sm"
                value={currentProduct.categoria}
                onChange={(e) => setCurrentProduct({ ...currentProduct, categoria: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Cantidad *"
                className="border p-1 rounded text-sm"
                value={currentProduct.cantidad}
                onChange={(e) => setCurrentProduct({ ...currentProduct, cantidad: parseFloat(e.target.value) || 0 })}
                min="1"
                required
              />
              <input
                type="number"
                placeholder="Precio *"
                className="border p-1 rounded text-sm"
                value={currentProduct.unitPrice}
                onChange={(e) => setCurrentProduct({ ...currentProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                required
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
        )}

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

        {/* Estado y observaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_revision">En Revisión</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              value={form.observaciones}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              className="w-full border p-2 rounded text-sm"
              rows={3}
            />
          </div>
        </div>

        {/* Totales */}
        <div className="mb-4 text-sm bg-gray-50 p-4 rounded">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${form.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>IVA (19%):</span>
            <span>${form.iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total:</span>
            <span>${form.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : 'Guardar Cotización'}
          </button>
        </div>
      </form>
    </div>
  );
}
