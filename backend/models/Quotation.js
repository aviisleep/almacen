const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  nombre: { type: String, required: true },        // Ej: "Fibra de vidrio"
  categoria: { type: String },                     // Ej: "Insumo", "Tornillería", etc.
  unidad: { type: String, default: "und" },        // Ej: "m2", "ml", "lt", "und"
  cantidad: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
  provider: { type: String }
});

const QuotationSchema = new mongoose.Schema({
  placa: { type: String, required: true },
  empresa: { type: String, required: true },
  products: [ProductSchema],
  subtotal: { type: Number, required: true },
  iva: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', QuotationSchema);
