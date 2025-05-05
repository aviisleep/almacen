const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, trim: true },
  phone: { type: String, trim: true },
  birthDate: { type: Date, default: Date.now },
  position: { type: String, required: true, trim: true },
  deliveries: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: { type: String, required: true },
      cantidad: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

// Índices para mejorar la eficiencia de las consultas
employeeSchema.index({ name: 1 }); // Índice en el campo "name" para búsquedas rápidas

module.exports = mongoose.model('Employee', employeeSchema);