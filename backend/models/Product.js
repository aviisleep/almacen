const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  SKU: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: String,
  cantidad: {
    type: Number,
    required: true,
    default: 0
  },
  precio: {
    type: Number,
    required: true,
    default: 0
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Herramienta', 'Consumible', 'Repuesto', 'Insumo', 'Otro']
  },
  esHerramienta: {
    type: Boolean,
    default: false
  },
  estado: {
    type: String,
    enum: ['Disponible', 'En Uso', 'En Reparación', 'Dañado', 'Retirado'],
    default: 'Disponible'
  },
  ubicacion: {
    type: String,
    enum: ['Almacén', 'Taller', 'En Reparación', 'Retirado'],
    default: 'Almacén'
  },
  ultimoMantenimiento: {
    fecha: Date,
    descripcion: String,
    realizadoPor: String
  },
  proximoMantenimiento: Date,
  asignaciones: [{
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    fechaAsignacion: Date,
    fechaDevolucion: Date,
    estadoDevolucion: {
      type: String,
      enum: ['Bueno', 'Regular', 'Dañado'],
      default: 'Bueno'
    },
    observaciones: String
  }],
  historial: [{
    accion: {
      type: String,
      required: true
    },
    detalles: String,
    fecha: {
      type: Date,
      default: Date.now
    },
    realizadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    estado: String,
    ubicacion: String
  }]
}, {
  timestamps: true
});

// Asegurar que el SKU se genere antes de la validación
productSchema.pre('validate', function(next) {
  if (!this.SKU) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.SKU = `SKU-${timestamp}-${random}`;
  }
  next();
});

// ✅ Este patrón previene el error OverwriteModelError:
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
