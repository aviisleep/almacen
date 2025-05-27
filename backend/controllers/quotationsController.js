const Quotation = require('../models/Quotation');

// Funciones auxiliares
const sendResponse = (res, status, data) => {
  res.status(status).json({
    success: status >= 200 && status < 300,
    ...data
  });
};

const handleError = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({
    success: false,
    message,
    error: error.message
  });
};

// Obtener todas las cotizaciones con paginación
exports.getAllQuotations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const filter = req.query.filter || 'todos';

    // Construir el filtro de búsqueda
    const searchFilter = {
      $or: [
        { folio: { $regex: search, $options: 'i' } },
        { cliente: { $regex: search, $options: 'i' } },
        { empresa: { $regex: search, $options: 'i' } },
        { placa: { $regex: search, $options: 'i' } }
      ]
    };

    // Agregar filtro de estado si no es 'todos'
    if (filter !== 'todos') {
      searchFilter.estado = filter;
    }

    // Calcular el total de documentos para la paginación
    const total = await Quotation.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Obtener las cotizaciones con paginación
    const quotations = await Quotation.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, {
      data: quotations,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener cotizaciones');
  }
};

// Obtener una cotización por ID
exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return sendResponse(res, 404, {
        message: 'Cotización no encontrada'
      });
    }
    sendResponse(res, 200, { data: quotation });
  } catch (error) {
    handleError(res, error, 'Error al obtener cotización');
  }
};

// Crear una nueva cotización
exports.createQuotation = async (req, res) => {
  try {
    const { placa, empresa, products } = req.body;

    if (!placa || !empresa) {
      return sendResponse(res, 400, {
        message: 'Los campos "placa" y "empresa" son obligatorios'
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return sendResponse(res, 400, {
        message: 'La cotización debe contener al menos un producto'
      });
    }

    const validatedProducts = products.map((p, index) => {
      const { nombre, categoria, unidad, unitPrice, cantidad, provider } = p;

      if (!nombre || typeof unitPrice !== 'number' || typeof cantidad !== 'number') {
        throw new Error(`Faltan campos o tipos inválidos en el producto #${index + 1}`);
      }

      return {
        nombre,
        categoria,
        unidad,
        unitPrice,
        cantidad,
        provider,
        total: +(unitPrice * cantidad).toFixed(2)
      };
    });

    const subtotal = validatedProducts.reduce((sum, p) => sum + p.total, 0);
    const iva = +(subtotal * 0.19).toFixed(2);
    const total = +(subtotal + iva).toFixed(2);

    const newQuotation = new Quotation({
      placa,
      empresa,
      products: validatedProducts,
      subtotal,
      iva,
      total
    });

    const savedQuotation = await newQuotation.save();
    sendResponse(res, 201, {
      data: savedQuotation,
      message: 'Cotización creada correctamente'
    });
  } catch (error) {
    handleError(res, error, 'Error al crear cotización');
  }
};

// Actualizar una cotización
exports.updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return sendResponse(res, 400, {
        message: 'ID de cotización no proporcionado'
      });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return sendResponse(res, 400, {
        message: 'No se proporcionaron datos para actualizar'
      });
    }

    const existingQuotation = await Quotation.findById(id);
    if (!existingQuotation) {
      return sendResponse(res, 404, {
        message: 'Cotización no encontrada'
      });
    }

    // Si hay productos, validar su estructura
    if (updateData.products && Array.isArray(updateData.products)) {
      updateData.products = updateData.products.map(product => ({
        ...product,
        cantidad: Number(product.cantidad) || 0,
        unitPrice: Number(product.unitPrice) || 0,
        total: Number(product.cantidad * product.unitPrice) || 0
      }));

      // Recalcular totales
      updateData.subtotal = updateData.products.reduce((sum, product) => {
        if (!product.eliminado) {
          return sum + (product.cantidad * product.unitPrice);
        }
        return sum;
      }, 0);

      updateData.iva = updateData.subtotal * 0.19;
      updateData.total = updateData.subtotal + updateData.iva;
    }

    const updatedQuotation = await Quotation.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedQuotation) {
      return sendResponse(res, 404, {
        message: 'Error al actualizar la cotización'
      });
    }

    sendResponse(res, 200, {
      message: 'Cotización actualizada exitosamente',
      data: updatedQuotation
    });
  } catch (error) {
    handleError(res, error, 'Error al actualizar cotización');
  }
};

// Eliminar una cotización
exports.deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return sendResponse(res, 404, {
        message: 'Cotización no encontrada'
      });
    }
    sendResponse(res, 200, {
      message: 'Cotización eliminada correctamente'
    });
  } catch (error) {
    handleError(res, error, 'Error al eliminar cotización');
  }
};

// Actualizar el estado de una cotización
exports.updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { estado: status },
      { new: true }
    );
    if (!quotation) {
      return sendResponse(res, 404, {
        message: 'Cotización no encontrada'
      });
    }
    sendResponse(res, 200, {
      data: quotation,
      message: 'Estado de cotización actualizado correctamente'
    });
  } catch (error) {
    handleError(res, error, 'Error al actualizar estado de cotización');
  }
};

// Actualizar productos de cotizaciones
exports.updateQuotationProducts = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return sendResponse(res, 400, {
        message: 'Se requiere un array de actualizaciones válido'
      });
    }

    const results = await Promise.all(
      updates.map(async (update) => {
        const { quotationId, productId, status, aprobado, eliminado } = update;

        if (!quotationId || typeof productId !== 'number') {
          throw new Error('ID de cotización y producto son requeridos');
        }

        const quotation = await Quotation.findById(quotationId);
        if (!quotation) {
          throw new Error(`Cotización no encontrada: ${quotationId}`);
        }

        if (!quotation.products[productId]) {
          throw new Error(`Producto no encontrado en la cotización: ${productId}`);
        }

        // Actualizar el producto específico
        quotation.products[productId] = {
          ...quotation.products[productId],
          status: status || quotation.products[productId].status,
          aprobado: aprobado !== undefined ? aprobado : quotation.products[productId].aprobado,
          eliminado: eliminado !== undefined ? eliminado : quotation.products[productId].eliminado
        };

        // Recalcular totales
        quotation.subtotal = quotation.products.reduce((sum, product) => {
          if (!product.eliminado) {
            return sum + (product.cantidad * product.unitPrice);
          }
          return sum;
        }, 0);

        quotation.iva = quotation.subtotal * 0.19;
        quotation.total = quotation.subtotal + quotation.iva;

        // Guardar los cambios
        await quotation.save();
        return quotation;
      })
    );

    sendResponse(res, 200, {
      message: 'Productos actualizados correctamente',
      data: results
    });
  } catch (error) {
    handleError(res, error, 'Error al actualizar productos');
  }
};

// Sugerencias de productos según placa o empresa
exports.getProductSuggestions = async (req, res) => {
  try {
    const query = req.params.query?.toLowerCase();
    if (!query) {
      return sendResponse(res, 400, {
        message: 'La consulta es obligatoria'
      });
    }

    const quotations = await Quotation.find({
      $or: [
        { "products.placa": { $regex: query, $options: 'i' } },
        { "products.empresa": { $regex: query, $options: 'i' } }
      ]
    });

    const suggestions = [];
    const seen = new Set();

    quotations.forEach(q => {
      q.products.forEach(p => {
        if (
          (p.placa && p.placa.toLowerCase().includes(query)) ||
          (p.empresa && p.empresa.toLowerCase().includes(query))
        ) {
          const key = `${p.placa}|${p.empresa}|${p.provider}`;
          if (!seen.has(key)) {
            suggestions.push({
              placa: p.placa,
              empresa: p.empresa,
              provider: p.provider,
              unitPrice: p.unitPrice
            });
            seen.add(key);
          }
        }
      });
    });

    sendResponse(res, 200, { data: suggestions });
  } catch (error) {
    handleError(res, error, 'Error al obtener sugerencias de productos');
  }
}; 