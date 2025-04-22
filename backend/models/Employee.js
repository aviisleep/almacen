const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Nombre del empleado (obligatorio)
  name: {
    type: String,
    required: [true, "El nombre del empleado es obligatorio."],
    trim: true, // Elimina espacios innecesarios al inicio y al final
  },

  // Vehículos asignados al empleado
  vehicles: [
    {
      vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle', // Referencia al modelo Vehicle
        required: true,
      },
      assignedDate: {
        type: Date,
        default: Date.now, // Fecha de asignación por defecto
      },
    },
  ],

  // Historial de entregas de productos
  deliveries: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Referencia al modelo Product
        required: [true, "El ID del producto es obligatorio."],
      },
      productName: {
        type: String,
        required: [true, "El nombre del producto es obligatorio."],
        trim: true,
      },
      quantity: {
        type: Number,
        required: [true, "La cantidad es obligatoria."],
        min: [1, "La cantidad debe ser mayor que cero."], // Validación mínima
      },
      date: {
        type: Date,
        default: Date.now, // Fecha de entrega por defecto
      },
    },
  ],
});

// Índices para mejorar la eficiencia de las consultas
employeeSchema.index({ name: 1 }); // Índice en el campo "name" para búsquedas rápidas

module.exports = mongoose.model('Employee', employeeSchema);