const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `TOOL-${timestamp}-${random}`;
    }
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  descripcion: {
    type: String,
    trim: true
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true
  },
  proveedor: {
    type: String,
    required: [true, 'El proveedor es requerido'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['stock', 'en_uso', 'dañada', 'mantenimiento', 'reparacion_sencilla'],
    default: 'stock'
  },
  ubicacion: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  historial: [{
    accion: {
      type: String,
      enum: ['asignacion', 'devolucion', 'mantenimiento', 'reparacion'],
      required: true
    },
    fecha: {
      type: Date,
      default: Date.now
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    employeeName: String,
    observaciones: String,
    estado: String,
    costo: Number
  }],
  ultimoMantenimiento: {
    fecha: Date,
    descripcion: String,
    costo: Number
  },
  proximoMantenimiento: Date,
  activa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Asegurar que el SKU se genere antes de la validación
toolSchema.pre('validate', function(next) {
  if (!this.sku) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.sku = `TOOL-${timestamp}-${random}`;
  }
  next();
});

// Método para asignar herramienta
toolSchema.methods.assign = async function(employeeId, observaciones) {
  if (this.estado !== 'stock') {
    throw new Error('La herramienta no está disponible para asignación');
  }

  this.estado = 'en_uso';
  this.assignedTo = employeeId;
  this.historial.push({
    accion: 'asignacion',
    employeeId,
    observaciones,
    fecha: new Date()
  });

  return this.save();
};

// Método para devolver herramienta
toolSchema.methods.return = async function(estado, observaciones) {
  if (this.estado !== 'en_uso') {
    throw new Error('La herramienta no está asignada');
  }

  this.estado = estado || 'stock';
  this.assignedTo = null;
  this.historial.push({
    accion: 'devolucion',
    observaciones,
    estado: this.estado,
    fecha: new Date()
  });

  return this.save();
};

// Método para registrar mantenimiento
toolSchema.methods.registerMaintenance = async function(descripcion, costo, proximoMantenimiento) {
  this.estado = 'mantenimiento';
  this.ultimoMantenimiento = {
    fecha: new Date(),
    descripcion,
    costo
  };
  this.proximoMantenimiento = proximoMantenimiento;
  this.historial.push({
    accion: 'mantenimiento',
    observaciones: descripcion,
    costo,
    fecha: new Date()
  });

  return this.save();
};

// Índices
toolSchema.index({ nombre: 1 });
toolSchema.index({ estado: 1 });
toolSchema.index({ categoria: 1 });
toolSchema.index({ 'historial.fecha': 1 });

// Eliminar el índice SKU_1 si existe
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.db.collection('tools').dropIndex('SKU_1');
  } catch (error) {
    // Ignorar error si el índice no existe
  }
});

const Tool = mongoose.model('Tool', toolSchema);

module.exports = Tool; 