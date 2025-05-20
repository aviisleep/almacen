const mongoose = require('mongoose');

const ingresoSchema = new mongoose.Schema({
    fechaEntrada: { type: Date, default: Date.now },
    compania: { type: String, required: true },
    conductor: {
        nombre: { type: String, required: true },
        telefono: { type: String },
        cedula: { type: String }
    },
    vehiculo: {
        placa: { type: String, required: true, uppercase: true },
        tipo: { 
            type: String, 
            required: true,
            enum: ['van_seco', 'van_refrigerado', 'botellero', 'camion', 'pickup', 'otro']
        }
    },
    reparacionesSolicitadas: [{
        descripcion: { type: String, required: true },
        prioridad: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
        aprobado: { type: Boolean, default: false }
    }],
    fotosEntrada: [{ type: String }], // URLs de las fotos
    firmas: {
        encargado: { type: String, required: true }, // URL o base64
        conductor: { type: String, required: true }
    },
    observaciones: { type: String },
    estado: { 
        type: String, 
        enum: ['ingresado', 'en_revision', 'en_reparacion', 'completado'], 
        default: 'ingresado' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Ingreso', ingresoSchema);