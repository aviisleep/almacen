const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, trim: true },
  happyBirthday: { type: Date, required: true },
  position: { type: String, required: true, trim: true },
   
  vehicles: [
    {
      vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
      assignedDate: { type: Date, default: Date.now },
    },
  ],
  deliveries: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }, // Vehículo asociado
      date: { type: Date, default: Date.now },
    },
  ],
});

// Índices para mejorar la eficiencia de las consultas
employeeSchema.index({ name: 1 }); // Índice en el campo "name" para búsquedas rápidas

module.exports = mongoose.model('Employee', employeeSchema);