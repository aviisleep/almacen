const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
    placa: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[A-Z0-9]{6,8}$/.test(v); // Validación de formato de placa
        },
        message: props => `${props.value} no es una placa válida.`,
      },
    },
    compañia: { type: String, required: true },
    tipoVehiculo: {
      type: String,
      enum: ['Trailer', 'Van', 'Botellero'],
      required: true,
    },
    estado: {
      type: String,
      enum: ['cotizacion', 'mantenimiento', 'reparado'],
      required: true,
      default: 'cotizacion',
    },
    empleadoAsignado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null, // Valor predeterminado
    },
    productosAsignados: {
      type: [
        {
          nombre: { type: String, required: true },
          cantidad: { type: Number, required: true },
          asignadoPor: { type: String, required: true },
          fechaAsignacion: { type: Date, default: Date.now },
        },
      ],
      default: [], // Array vacío por defecto
    },
  });
  
  module.exports = mongoose.model('Vehiculo', vehiculoSchema);