import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ToolModal({ isOpen, onClose, tool, onSave }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    estado: 'stock',
    sku: ''
  });

  const [maintenance, setMaintenance] = useState({
    descripcion: '',
    costo: 0,
    proximoMantenimiento: ''
  });

  useEffect(() => {
    if (tool) {
      setForm({
        nombre: tool.nombre || '',
        descripcion: tool.descripcion || '',
        precio: tool.precio || 0,
        estado: tool.estado || 'stock',
        sku: tool.sku || ''
      });
    }
  }, [tool]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(form);
      toast.success('Herramienta actualizada correctamente');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar la herramienta');
    }
  };

  const handleMaintenance = async (e) => {
    e.preventDefault();
    try {
      await onSave({
        ...form,
        mantenimiento: maintenance
      });
      toast.success('Mantenimiento registrado correctamente');
      setMaintenance({
        descripcion: '',
        costo: 0,
        proximoMantenimiento: ''
      });
    } catch (error) {
      toast.error(error.message || 'Error al registrar mantenimiento');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Detalles de la Herramienta</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                  type="number"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="stock">En Stock</option>
                  <option value="en_uso">En Uso</option>
                  <option value="dañada">Dañada</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="reparacion_sencilla">En Reparación Sencilla</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Registrar Mantenimiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <input
                    type="text"
                    value={maintenance.descripcion}
                    onChange={(e) => setMaintenance({ ...maintenance, descripcion: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Costo</label>
                  <input
                    type="number"
                    value={maintenance.costo}
                    onChange={(e) => setMaintenance({ ...maintenance, costo: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Próximo Mantenimiento</label>
                  <input
                    type="date"
                    value={maintenance.proximoMantenimiento}
                    onChange={(e) => setMaintenance({ ...maintenance, proximoMantenimiento: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleMaintenance}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Registrar Mantenimiento
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 