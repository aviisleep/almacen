const mongoose = require("mongoose");

const generateSKU = () => {
  const prefix = "SKU";
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomPart}`;
};

const productSchema = new mongoose.Schema({
  SKU: { type: String, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  cantidad: { type: Number, default: 0, required: true }, // Stock total en el almacén
  precio: { 
    type: Number, 
    required: true, 
    min: 0, // El precio no puede ser negativo
    validate: {
      validator: (value) => value > 0,
      message: "El precio debe ser mayor a cero."
    }
  },
  categoria: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  historial: [
    {
      accion: { type: String }, // Ejemplo: "Entrega a empleado", "Asignación a vehículo"
      detalles: { type: String }, // Detalles específicos
      fecha: { type: Date, default: Date.now },
    },
  ],
});

productSchema.pre("save", async function (next) {
  if (!this.SKU) {
    let sku = generateSKU();
    console.log("Generando SKU:", sku);
    let existingProduct = await this.constructor.findOne({ SKU: sku });
    while (existingProduct) {
      sku = generateSKU();
      existingProduct = await this.constructor.findOne({ SKU: sku });
    }
    this.SKU = sku;
  }
  next();
});

// ✅ Este patrón previene el error OverwriteModelError:
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
