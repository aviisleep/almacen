const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre es requerido'], 
    trim: true 
  },
  email: { 
    type: String, 
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String, 
    trim: true 
  },
  birthDate: { 
    type: Date 
  },
  position: { 
    type: String, 
    required: [true, 'El cargo es requerido'],
    trim: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  deliveries: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    },
    cantidad: { 
      type: Number, 
      required: true 
    },
    fecha: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, {
  timestamps: true
});

// Índices para mejorar la eficiencia de las consultas
employeeSchema.index({ name: 1 });
employeeSchema.index({ position: 1 });
employeeSchema.index({ active: 1 });

// Método para obtener empleados activos
employeeSchema.statics.getActiveEmployees = function() {
  return this.find({ active: true });
};

// Método para obtener empleados por cargo
employeeSchema.statics.getEmployeesByPosition = function(position) {
  return this.find({ position, active: true });
};

// Método para entregar producto
employeeSchema.methods.deliverProduct = async function(productId, cantidad) {
  this.deliveries.push({
    productId,
    cantidad,
    fecha: new Date()
  });
  return this.save();
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;