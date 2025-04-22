const mongoose = require("mongoose");

const generateSKU = () => {
  const prefix = "SKU";
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomPart}`;
};

const productSchema = new mongoose.Schema(
  {
    SKU: { type: String, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
    cantidad: { type: Number, default: 0, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  if (!this.SKU) {
    let sku = generateSKU();
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
