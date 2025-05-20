const Quotation = require('../models/Quotation');

// Obtener todas las cotizaciones
exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error.message);
    res.status(500).json({ error: 'Error al obtener cotizaciones.' });
  }
};

// Obtener una cotización por ID
exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ error: 'Cotización no encontrada.' });
    }
    res.json(quotation);
  } catch (error) {
    console.error('Error al obtener cotización:', error.message);
    res.status(500).json({ error: 'Error al obtener la cotización.' });
  }
};

// Crear una nueva cotización
exports.createQuotation = async (req, res) => {
  try {
    const { placa, empresa, products } = req.body;

    if (!placa || !empresa) {
      return res.status(400).json({ error: 'Los campos "placa" y "empresa" son obligatorios.' });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'La cotización debe contener al menos un producto.' });
    }

    const validatedProducts = products.map((p, index) => {
      const { nombre, categoria, unidad, unitPrice, cantidad, provider } = p;

      if (!nombre || typeof unitPrice !== 'number' || typeof cantidad !== 'number') {
        throw new Error(`Faltan campos o tipos inválidos en el producto #${index + 1}.`);
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

    await newQuotation.save();
    res.status(201).json(newQuotation);
  } catch (error) {
    console.error('Error al crear cotización:', error.message);
    res.status(500).json({ error: error.message || 'Error al guardar cotización.' });
  }
};

// Actualizar una cotización existente
exports.updateQuotation = async (req, res) => {
  try {
    const { placa, empresa, products } = req.body;

    if (!placa || !empresa) {
      return res.status(400).json({ error: 'Los campos "placa" y "empresa" son obligatorios.' });
    }

    const validatedProducts = products.map((p, index) => {
      const { placa, empresa, unitPrice, cantidad, provider } = p;

      if (!placa || !empresa || !provider) {
        throw new Error(`Faltan campos obligatorios en el producto #${index + 1}.`);
      }

      if (typeof unitPrice !== 'number' || typeof cantidad !== 'number') {
        throw new Error(`unitPrice y cantidad deben ser números en el producto #${index + 1}.`);
      }

      return {
        placa,
        empresa,
        provider,
        unitPrice,
        cantidad,
        total: +(unitPrice * cantidad).toFixed(2)
      };
    });

    const subtotal = validatedProducts.reduce((sum, p) => sum + p.total, 0);
    const iva = +(subtotal * 0.19).toFixed(2);
    const total = +(subtotal + iva).toFixed(2);

    const updatedQuotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      {
        referenceName,
        products: validatedProducts,
        subtotal,
        iva,
        total
      },
      { new: true }
    );

    if (!updatedQuotation) {
      return res.status(404).json({ error: 'Cotización no encontrada.' });
    }

    res.json(updatedQuotation);
  } catch (error) {
    console.error('Error al actualizar cotización:', error.message);
    res.status(500).json({ error: 'Error al actualizar la cotización.' });
  }
};

// Eliminar una cotización
exports.deleteQuotation = async (req, res) => {
  try {
    const deleted = await Quotation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Cotización no encontrada.' });
    }
    res.json({ message: 'Cotización eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar cotización:', error.message);
    res.status(500).json({ error: 'Error al eliminar la cotización.' });
  }
};

// Sugerencias de productos según placa o empresa
exports.getProductSuggestions = async (req, res) => {
  try {
    const query = req.params.query?.toLowerCase();
    if (!query) {
      return res.status(400).json({ error: 'La consulta es obligatoria.' });
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

    res.json(suggestions);
  } catch (error) {
    console.error('Error al obtener sugerencias de productos:', error.message);
    res.status(500).json({ error: 'Error al obtener sugerencias de productos.' });
  }
};
