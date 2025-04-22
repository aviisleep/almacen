const Product = require('../models/product');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({ message: error.message });
  }
}

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Crear un nuevo producto
const createProduct = async (req, res) =>{
  try {
    const { nombre, descripcion, cantidad, precio, categoria } = req.body;

    // Crear el producto sin incluir el SKU
    const product = new Product({
      nombre,
      descripcion,
      cantidad,
      precio,
      categoria,
    });

    console.log("Producto creado antes de guardar:", product);

    // Guardar el producto (el SKU se genera automáticamente)
    const newProduct = await product.save();

    // Devolver el producto completo (incluyendo el SKU generado)
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    res.status(400).json({ message: error.message });
  }
}

// Actualizar un producto por ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { SKU, cantidad, ...rest } = req.body;

    // Si se proporciona un nuevo SKU, verificar que no esté duplicado
    if (SKU) {
      const existingProduct = await Product.findOne({ SKU, _id: { $ne: id } });
      if (existingProduct) {
        return res.status(400).json({ message: "El SKU ya está en uso." });
      }
    }

    // Buscar el producto existente
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Si se proporciona una cantidad, sumarla a la cantidad existente
    if (cantidad) {
      product.cantidad += cantidad; // Incrementar la cantidad
    }

    // Actualizar otros campos si se proporcionan
    Object.assign(product, rest);

    // Guardar los cambios
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un producto por ID
const deleteProduct = async (req, res) =>{
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Actualizar la cantidad del producto
const updateProductQuantity = async (req, res) =>{
  const { id } = req.params;
  const { cantidad } = req.body;

  try {
    const product = await findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    product.cantidad = cantidad;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
}



module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductQuantity
}