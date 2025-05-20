const Product = require('../models/product');

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
    const mongoose = require('mongoose');
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
        message: "Nombre, cantidad y precio son obligatorios, y deben ser mayores a cero." 
      });
    }

    // Buscar si el producto ya existe
    let product = await Product.findOne({ nombre });

    if (product) {
      // Si el producto ya existe, incrementar la cantidad
      product.cantidad += cantidad;
      product.historial.push({
        accion: "Compra",
        detalles: `Se agregaron ${cantidad} unidades al inventario.`,
      });
    } else {
      // Si el producto no existe, crear uno nuevo
      product = new Product({
        nombre,
        descripcion,
        cantidad,
        precio,
        categoria,
      });
      product.historial.push({
        accion: "Compra",
        detalles: `Producto creado con ${cantidad} unidades y precio $${precio}.`,
      });
    }

    // Guardar el producto (el SKU se genera automáticamente en el middleware pre('save'))
    const savedProduct = await product.save();

    // Devolver el producto completo (incluyendo el SKU generado)
    res.status(201).json({ 
      message: "Producto agregado al inventario exitosamente", 
      data: savedProduct 
    });
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    res.status(500).json({ message: "Error interno del servidor." });
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
const updateProductcantidad = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  try {
    // Validar que la cantidad sea un número positivo
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser mayor a cero." });
    }

    // Buscar el producto por ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar la cantidad del producto
    product.cantidad = cantidad;

    // Guardar los cambios en la base de datos
    await product.save();

    // Devolver el producto actualizado
    res.status(200).json(product);
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto:", error.message);
    res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
  }
};

// Agregar un producto al inventario (opcional, si se necesita)
const addProductToInventory = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, categoria } = req.body;

    // Validar campos obligatorios
    if (!nombre || !cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "Nombre y cantidad son obligatorios, y la cantidad debe ser mayor a cero." });
    }

    // Buscar si el producto ya existe
    let product = await Product.findOne({ nombre });

    if (product) {
      // Si el producto ya existe, incrementar la cantidad
      product.cantidad += cantidad;
      product.historial.push({
        accion: "Compra",
        detalles: `Se agregaron ${cantidad} unidades al inventario.`,
      });
    } else {
      // Si el producto no existe, crear uno nuevo
      product = new Product({
        SKU: generateSKU(), // Función para generar SKU único
        nombre,
        descripcion,
        cantidad,
        categoria,
      });
      product.historial.push({
        accion: "Compra",
        detalles: `Producto creado con ${cantidad} unidades.`,
      });
    }

    await product.save();
    res.status(201).json({ message: "Producto agregado al inventario exitosamente", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// para devolver un producto al inventario
const returnProductToInventory = async (req, res) => {
  try {
    const { productId } = req.params; // ID del producto
    const { cantidad, employeeId, vehicleId } = req.body;

    // Validaciones
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser mayor a cero." });
    }

    // Buscar el producto
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Incrementar el stock del inventario
    product.cantidad += cantidad;
    product.historial.push({
      accion: "Devolución",
      detalles: `Se devolvieron ${cantidad} unidades al inventario.`,
    });
    await product.save();

    // Si se proporciona un employeeId, actualizar su historial
    if (employeeId && mongoose.Types.ObjectId.isValid(employeeId)) {
      const employee = await Employee.findById(employeeId);
      if (employee) {
        const delivery = employee.deliveries.find((d) => d.productId.equals(productId));
        if (delivery) {
          delivery.cantidad -= cantidad; // Reducir la cantidad entregada
          if (delivery.cantidad <= 0) {
            employee.deliveries.pull(delivery); // Eliminar si la cantidad llega a cero
          }
          await employee.save();
        }
      }
    }

    // Si se proporciona un vehicleId, actualizar su historial
    if (vehicleId && mongoose.Types.ObjectId.isValid(vehicleId)) {
      const vehicle = await Vehicle.findById(vehicleId);
      if (vehicle) {
        const assignedProduct = vehicle.productosAsignados.find((p) => p.productId.equals(productId));
        if (assignedProduct) {
          assignedProduct.cantidad -= cantidad; // Reducir la cantidad asignada
          if (assignedProduct.cantidad <= 0) {
            vehicle.productosAsignados.pull(assignedProduct); // Eliminar si la cantidad llega a cero
          }
          await vehicle.save();
        }
      }
    }

    res.status(200).json({ message: "Producto devuelto exitosamente", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener el historial de un producto
const getProductHistory = async (req, res) => {
  try {
    const { id } = req.params; // ID del producto

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    // Buscar el producto
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Devolver el historial del producto
    res.json({
      success: true,
      data: product.historial,
    });
  } catch (error) {
    console.error("Error al obtener el historial del producto:", error.message);
    res.status(500).json({ success: false, message: "Error interno del servidor." });
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