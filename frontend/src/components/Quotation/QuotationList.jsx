import { useEffect, useState } from 'react';
import { getQuotations, deleteQuotation } from '../api/quotations';
import QuotationForm from './QuotationForm';
import { toast } from 'react-toastify';

export default function QuotationList() {
  const [quotations, setQuotations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const loadQuotations = async () => {
    try {
      const res = await getQuotations();
      setQuotations(res.data);
    } catch (err) {
      toast.error('Error al cargar cotizaciones');
    }
  };

  useEffect(() => {
    loadQuotations();
  }, []);

  const handleEdit = (quotation) => {
    setSelected(quotation);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta cotización?')) {
      try {
        await deleteQuotation(id);
        toast.success('Cotización eliminada');
        loadQuotations();
      } catch (err) {
        toast.error('Error al eliminar');
      }
    }
  };

  const filtered = quotations.filter(q =>
    q.folio.toLowerCase().includes(search.toLowerCase()) ||
    q.cliente.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cotizaciones</h1>
        <button
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Nueva
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por folio o cliente"
        className="border p-2 w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Folio</th>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No hay cotizaciones encontradas.
                </td>
              </tr>
            ) : (
              filtered.map((q) => (
                <tr key={q._id} className="hover:bg-gray-50">
                  <td className="border p-2">{q.folio}</td>
                  <td className="border p-2">{q.cliente}</td>
                  <td className="border p-2">{q.fecha?.split('T')[0]}</td>
                  <td className="border p-2">${q.total?.toFixed(2)}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="text-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <QuotationForm
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            loadQuotations();
          }}
          initialData={selected}
        />
      )}
    </div>
  );
}
