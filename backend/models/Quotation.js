const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  unidad: {
    type: String,
    default: 'und'
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  provider: {
    type: String
  },
  status: {
    type: String,
    enum: ['pendiente', 'aprobado', 'eliminado'],
    default: 'pendiente'
  },
  aprobado: {
    type: Boolean,
    default: false
  },
  eliminado: {
    type: Boolean,
    default: false
  }
});

const quotationSchema = new mongoose.Schema({
  folio: {
    type: String,
    required: true,
    unique: true
  },
  cliente: {
    type: String,
    required: true
  },
  empresa: {
    type: String,
    required: true
  },
  placa: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  products: [productSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  iva: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_revision', 'aprobada', 'rechazada'],
    default: 'pendiente'
  },
  observaciones: {
    type: String
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las búsquedas
quotationSchema.index({ cliente: 1 });
quotationSchema.index({ empresa: 1 });
quotationSchema.index({ placa: 1 });
quotationSchema.index({ estado: 1 });
quotationSchema.index({ createdAt: -1 });

// Middleware para generar folio automático
quotationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastQuotation = await this.constructor.findOne().sort({ createdAt: -1 });
    const folio = lastQuotation ? 
      `COT-${(parseInt(lastQuotation.folio.split('-')[1]) + 1).toString().padStart(4, '0')}` : 
      'COT-0001';
    this.folio = folio;
  }
  next();
});

module.exports = mongoose.model('Quotation', quotationSchema);
