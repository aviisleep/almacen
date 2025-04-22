const mongoose = require('mongoose');

const ingresoSalidaSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    tipo: {
        type: String,
        enum: ['entrada', 'salida'],
        required: true,
    },
    placa: {
        type: String,
        required: true,
        ref: 'Vehiculo', // Referencia al modelo de Vehículo
    },
    nombreConductor: { type: String, required: true },
    celular: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}$/.test(v); // Validación de formato de celular
            },
            message: props => `${props.value} no es un número de celular válido.`,
        },
    },
    observaciones: { type: String },
    fotos: [{ type: String }], // URLs de las fotos adjuntas
});

module.exports = mongoose.model('IngresoSalida', ingresoSalidaSchema);