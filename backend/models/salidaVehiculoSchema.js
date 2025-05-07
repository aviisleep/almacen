const mongoose = require('mongoose');

const salidaSchema = new mongoose.Schema({
    ingreso: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ingreso', 
        required: true 
    },
    fechaSalida: { type: Date, default: Date.now },
    reparacionesRealizadas: [{
        descripcion: { type: String, required: true },
    }],
    fotosSalida: [{ type: String }],
    firmas: {
        encargado: { type: String, required: true },
        conductor: { type: String, required: true }
    },
    estadoReparaciones: {
        type: String,
        enum: ['completado', 'parcial', 'pendiente'],
        required: true
    },
    observaciones: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Salida', salidaSchema);