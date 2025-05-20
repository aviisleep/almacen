import React, { useEffect, useState } from 'react';
import {
  getAllQuotations,
  deleteQuotation,
} from '../utils/api/quotations';
import QuotationForm from '../components/Quotation/QuotationForm';
import { toast } from 'react-toastify';

export default function Cotizaciones() {
  const [quotations, setQuotations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const fetchQuotations = async () => {
    try {
      const { data } = await getAllQuotations();
      setQuotations(data);
    } catch (error) {
      toast.error('Error al cargar cotizaciones');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta cotización?')) {
      try {
        await deleteQuotation(id);
        toast.success('Cotización eliminada');
        fetchQuotations();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const openEditModal = (quotation) => {
    setSelectedQuotation(quotation);
    setModalOpen(true);
  };

  const openNewModal = () => {
    setSelectedQuotation(null);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cotizaciones</h1>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Nueva cotización
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Placa</th>
              <th className="p-2">Subtotal</th>
              <th className="p-2">IVA</th>
              <th className="p-2">Total</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q) => (
              <tr key={q._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{q.placa}</td>
                <td className="p-2">${q.subtotal?.toFixed(2)}</td>
                <td className="p-2">${q.iva?.toFixed(2)}</td>
                <td className="p-2">${q.total?.toFixed(2)}</td>
                <td className="p-2">{new Date(q.createdAt).toLocaleDateString()}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(q)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QuotationForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchQuotations();
        }}
        initialData={selectedQuotation}
      />
    </div>
  );
}
