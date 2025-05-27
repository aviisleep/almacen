const Product = require('../models/product');
const mongoose = require('mongoose');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Consulta para obtener los productos paginados
    const products = await Product.find()
      .limit(Number(limit))
      .skip(skip);

    // Contar el total de productos en la base de datos
    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    // Agregar numeración secuencial a cada producto
    const enumeratedProducts = products.map((product, index) => ({
      ...product.toObject(),
      itemNumber: skip + index + 1, // Número secuencial global
    }));

    res.json({
      success: true,
      data: enumeratedProducts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
        currentItems: products.length,
      },
    });
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor." 
    });
  }
}
// Nuevo controlador para contar productos
const countProducts = async (req, res) => {
  try {
    const total = await Product.countDocuments({});
    res.json({ 
      success: true,
      total 
    });
  } catch (error) {
    console.error("Error counting products:", error);
    res.status(500).json({
      success: false,
      message: "Error al contar productos",
      error: error.message
    });
  }
};
// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID de producto inválido" });
    }

    // Buscar el producto en la base de datos
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: `No se encontró un producto con el ID: ${req.params.id}` });
    }

    // Validar que el precio sea un número
    if (typeof product.precio !== "number") {
      product.precio = 0; // O cualquier valor predeterminado
    }

    // Respuesta exitosa
    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Error al obtener el producto:", error.message);
    res.status(500).json({ success: false, message: "Error interno del servidor", error: error.message });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, precio, categoria } = req.body;

    // Validar campos obligatorios
    if (!nombre || !cantidad || cantidad <= 0 || !precio || precio <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Nombre, cantidad y precio son obligatorios, y deben ser mayores a cero." 
      });
    }

    // Validar categoría
    const categoriasValidas = ['Herramienta', 'Consumible', 'Repuesto', 'Insumo', 'Otro'];
    if (categoria && !categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        success: false,
        message: `Categoría inválida. Las categorías válidas son: ${categoriasValidas.join(', ')}`
      });
    }

    // Crear el producto
    const product = new Product({
      nombre,
      descripcion,
      cantidad,
      precio,
      categoria: categoria || 'Otro',
      historial: [{
        accion: "Compra",
        detalles: `Producto creado con ${cantidad} unidades y precio $${precio}.`,
        fecha: new Date()
      }]
    });

    // Guardar el producto
    const savedProduct = await product.save();

    // Devolver el producto creado
    res.status(201).json({ 
      success: true,
      message: "Producto agregado al inventario exitosamente", 
      data: savedProduct 
    });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor.",
      error: error.message 
    });
  }
};

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
const updateProductcantidad = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  try {
    // Validar que la cantidad sea un número positivo
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser mayor a cero." });
    }

    // Buscar el producto
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Calcular la diferencia de cantidad
    const diferencia = cantidad - product.cantidad;
    
    // Actualizar la cantidad
    product.cantidad = cantidad;

    // Agregar entrada al historial
    product.historial.push({
      accion: diferencia > 0 ? "Ajuste de stock" : "Reducción de stock",
      detalles: `Cantidad ajustada a ${cantidad} unidades (${diferencia > 0 ? '+' : ''}${diferencia})`,
      fecha: new Date()
    });

    // Guardar los cambios
    await product.save();

    res.json({
      success: true,
      message: "Cantidad actualizada exitosamente",
      data: product
    });
  } catch (error) {
    console.error("Error al actualizar la cantidad:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

// Agregar producto al inventario
const addProductToInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    // Validar que la cantidad sea un número positivo
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser mayor a cero." });
    }

    // Buscar el producto
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar la cantidad
    product.cantidad += cantidad;

    // Agregar entrada al historial
    product.historial.push({
      accion: "Agregado al inventario",
      detalles: `Se agregaron ${cantidad} unidades al inventario`,
      fecha: new Date()
    });

    // Guardar los cambios
    await product.save();

    res.json({
      success: true,
      message: "Producto agregado al inventario exitosamente",
      data: product
    });
  } catch (error) {
    console.error("Error al agregar producto al inventario:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

// Devolver producto al inventario
const returnProductToInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { cantidad, motivo } = req.body;

    // Validar que la cantidad sea un número positivo
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser mayor a cero." });
    }

    // Buscar el producto
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar la cantidad
    product.cantidad += cantidad;

    // Agregar entrada al historial
    product.historial.push({
      accion: "Devolución al inventario",
      detalles: `Se devolvieron ${cantidad} unidades al inventario. Motivo: ${motivo || 'No especificado'}`,
      fecha: new Date()
    });

    // Guardar los cambios
    await product.save();

    res.json({
      success: true,
      message: "Producto devuelto al inventario exitosamente",
      data: product
    });
  } catch (error) {
    console.error("Error al devolver producto al inventario:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

// Obtener el historial de un producto
const getProductHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar el ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de producto inválido" 
      });
    }

    // Buscar el producto y obtener su historial
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Producto no encontrado" 
      });
    }

    // Ordenar el historial por fecha descendente (más reciente primero)
    const historialOrdenado = product.historial.sort((a, b) => b.fecha - a.fecha);

    res.json({
      success: true,
      data: historialOrdenado
    });
  } catch (error) {
    console.error("Error al obtener el historial del producto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductcantidad,
  addProductToInventory,
  returnProductToInventory,
  getProductHistory,
  countProducts
}