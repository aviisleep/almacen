const mongoose = require("mongoose");

// Definir el esquema del proveedor
const proveedorSchema = mongoose.Schema(
  {
    nombre: { type: String, required: true },
    empresa: { type: String },
    direccion: { type: String },
    numero: { type: Number }, 
    nit: { type: String },  
    metodoPago: {
      numeroCuenta: { type: String }, 
      nombreBanco: { type: String },  
    },
  },
  {
    timestamps: true,
  }
);

// Exportar el modelo
module.exports = mongoose.model("Proveedor", proveedorSchema);
