import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  getAllQuotations,
  deleteQuotation,
  updateQuotationStatus,
  updateQuotationProducts
} from '../utils/api/quotations';
import QuotationForm from '../components/Quotation/QuotationForm';
import { toast } from 'react-toastify';

const COLUMNS = {
  PENDIENTE: {
    id: 'pendiente',
    title: 'Pendiente',
    color: 'bg-yellow-100'
  },
  EN_REVISION: {
    id: 'en_revision',
    title: 'En Revisión',
    color: 'bg-blue-100'
  },
  APROBADA: {
    id: 'aprobada',
    title: 'Aprobada',
    color: 'bg-green-100'
  },
  RECHAZADA: {
    id: 'rechazada',
    title: 'Rechazada',
    color: 'bg-red-100'
  }
};

export default function Cotizaciones() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllQuotations();
      
      if (Array.isArray(response)) {
        const validQuotations = response.map(q => ({
          ...q,
          _id: q._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        setQuotations(validQuotations);
      } else if (response?.data) {
        const validQuotations = response.data.map(q => ({
          ...q,
          _id: q._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        setQuotations(validQuotations);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err) {
      console.error('Error al cargar cotizaciones:', err);
      setError('Error al cargar las cotizaciones');
      toast.error('Error al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      setIsDragging(false);
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      setIsDragging(false);
      return;
    }

    const quotation = quotations.find(q => q._id === draggableId);
    if (!quotation) {
      console.error('No se encontró la cotización con ID:', draggableId);
      setIsDragging(false);
      return;
    }

    const newStatus = destination.droppableId;

    try {
      setQuotations(prevQuotations => {
        const newQuotations = [...prevQuotations];
        const quotationIndex = newQuotations.findIndex(q => q._id === draggableId);
        if (quotationIndex === -1) {
          console.error('No se encontró la cotización en el estado local');
          return prevQuotations;
        }
        newQuotations[quotationIndex] = {
          ...newQuotations[quotationIndex],
          estado: newStatus
        };
        return newQuotations;
      });

      const response = await updateQuotationStatus(quotation._id, newStatus);
      if (response.error) {
        throw new Error(response.error);
      }

      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error(error.message || 'Error al actualizar el estado');
      loadQuotations();
    } finally {
      setIsDragging(false);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleProductSelection = (quotationId, productId, selected) => {
    setSelectedProducts(prev => {
      const newSelection = [...prev];
      const index = newSelection.findIndex(p => p.quotationId === quotationId && p.productId === productId);
      
      if (selected && index === -1) {
        newSelection.push({ quotationId, productId });
      } else if (!selected && index !== -1) {
        newSelection.splice(index, 1);
      }
      
      return newSelection;
    });
  };

  const handleApproveSelected = async () => {
    try {
      if (selectedProducts.length === 0) {
        toast.warning('No hay productos seleccionados');
        return;
      }

      const updates = selectedProducts.map(({ quotationId, productId }) => ({
        quotationId,
        productId,
        status: 'aprobado',
        aprobado: true,
        eliminado: false
      }));

      const response = await updateQuotationProducts(updates);
      
      if (response.error) {
        throw new Error(response.error);
      }

      toast.success('Productos aprobados correctamente');
      await loadQuotations();
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error al aprobar productos:', error);
      toast.error(error.message || 'Error al aprobar los productos');
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm('¿Estás seguro de eliminar los productos seleccionados?')) return;

    try {
      if (selectedProducts.length === 0) {
        toast.warning('No hay productos seleccionados');
        return;
      }

      const updates = selectedProducts.map(({ quotationId, productId }) => ({
        quotationId,
        productId,
        status: 'eliminado',
        aprobado: false,
        eliminado: true
      }));

      const response = await updateQuotationProducts(updates);
      
      if (response.error) {
        throw new Error(response.error);
      }

      toast.success('Productos eliminados correctamente');
      await loadQuotations();
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error al eliminar productos:', error);
      toast.error(error.message || 'Error al eliminar los productos');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadQuotations}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cotizaciones</h1>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nueva Cotización
        </button>
      </div>

      {selectedProducts.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
          <span>{selectedProducts.length} productos seleccionados</span>
          <div className="space-x-2">
            <button
              onClick={handleApproveSelected}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Aprobar Seleccionados
            </button>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Eliminar Seleccionados
            </button>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(COLUMNS).map((column) => (
            <div key={column.id} className="bg-gray-100 rounded-lg p-4">
              <h2 className={`text-lg font-semibold mb-4 ${column.color} p-2 rounded`}>
                {column.title}
              </h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4 min-h-[200px]"
                  >
                    {quotations
                      .filter(q => q.estado === column.id)
                      .map((quotation, index) => (
                        <Draggable
                          key={quotation._id}
                          draggableId={quotation._id}
                          index={index}
                          isDragDisabled={isDragging}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-lg shadow-md p-4 transition-shadow duration-200 ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">{quotation.folio}</h3>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openEditModal(quotation)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    Editar
                                  </button>
                                </div>
                              </div>
                              
                              <div className="text-sm text-gray-600 space-y-1">
                                <p><span className="font-medium">Cliente:</span> {quotation.cliente}</p>
                                <p><span className="font-medium">Empresa:</span> {quotation.empresa}</p>
                                <p><span className="font-medium">Placa:</span> {quotation.placa}</p>
                                <p><span className="font-medium">Total:</span> {new Intl.NumberFormat('es-CO', {
                                  style: 'currency',
                                  currency: 'COP',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                }).format(quotation.total)}</p>
                              </div>

                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Productos:</h4>
                                <div className="space-y-2">
                                  {quotation.products.map((product, idx) => (
                                    <div
                                      key={`${quotation._id}-product-${idx}`}
                                      className="flex items-center space-x-2 text-sm"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedProducts.some(
                                          p => p.quotationId === quotation._id && p.productId === idx
                                        )}
                                        onChange={(e) => handleProductSelection(
                                          quotation._id,
                                          idx,
                                          e.target.checked
                                        )}
                                        className="rounded"
                                      />
                                      <span>{product.nombre}</span>
                                      <span className="text-gray-500">
                                        ({product.cantidad} x {new Intl.NumberFormat('es-CO', {
                                          style: 'currency',
                                          currency: 'COP',
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 0
                                        }).format(product.unitPrice)})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <QuotationForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          loadQuotations();
        }}
        initialData={selectedQuotation}
      />
    </div>
  );
}
