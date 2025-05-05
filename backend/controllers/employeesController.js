// controllers/employeeController.js
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');



// Función reutilizable para responder
const sendResponse = (res, status, data) => {
  return res.status(status).json({
    success: status < 400,
    ...data
  });
};

// Función reutilizable para manejar errores
const handleError = (res, error, defaultMessage = "Error interno del servidor") => {
  console.error(defaultMessage, error);
  return sendResponse(res, 500, {
    message: defaultMessage,
    error: error.message
  });
};

// Obtener todos los empleados
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados", employees: [] });
  }
};

// Obtener empleado por ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('vehicles.vehicleId')
      .populate('deliveries.productId');

    if (!employee) {
      return sendResponse(res, 404, { message: "Empleado no encontrado" });
    }

    return sendResponse(res, 200, {
      message: "Empleado obtenido exitosamente",
      data: employee
    });
  } catch (error) {
    return handleError(res, error, "Error al obtener el empleado");
  }
};

// Crear un nuevo empleado
const createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, { 
      message: "Errores de validación", 
      errors: errors.array() 
    });
  }

  try {
    const { 
      name, 
      email, 
      phone, 
      position, 
      Birthday,
      vehicles,
      deliveries
    } = req.body;

    // Validación de campos obligatorios
    if (!name || !position) {
      return sendResponse(res, 400, { 
        message: "Nombre y cargo son campos obligatorios" 
      });
    }

    // Crear nuevo empleado con todos los campos
    const newEmployee = new Employee({
      name,
      email: email || null,
      phone: phone || null,
      position,
      Birthday: Birthday || null,
      vehicles: vehicles || [],
      deliveries: deliveries || []
    });

    const savedEmployee = await newEmployee.save();

    return sendResponse(res, 201, {
      message: "Empleado creado exitosamente",
      data: savedEmployee
    });

  } catch (error) {
    return handleError(res, error, "Error al crear el empleado");
  }
};

// Actualizar empleado
const updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, position, birthDate } = req.body;
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { 
        name,
        email: email || null,
        phone: phone || null,
        position,
        birthDate: birthDate || null 
      },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.json({
      success: true,
      message: "Empleado actualizado correctamente",
      data: updatedEmployee
    });

  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al actualizar empleado",
      error: error.message 
    });
  }
};

// Eliminar empleado
const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return sendResponse(res, 404, { message: "Empleado no encontrado" });
    }

    return sendResponse(res, 200, {
      message: "Empleado eliminado correctamente"
    });

  } catch (error) {
    return handleError(res, error, "Error al eliminar el empleado");
  }
};

// Asignar producto a empleado
const assignProductToEmployee = async (req, res) => {
  const errors = validationResult(req);
  try {
    const { empleadoId, productId, productName, cantidad } = req.body;
    if (!empleadoId || !productId || !cantidad) {
      return sendResponse(res, 400, { message: "Faltan campos requeridos" });
    }
  // Validación de IDs
    if (
      !mongoose.Types.ObjectId.isValid(empleadoId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return sendResponse(res, 400, { message: "IDs inválidos" });
    }
 // Obtener empleado y producto en paralelo
    const [employee, product] = await Promise.all([
      Employee.findById(empleadoId),
      Product.findById(productId)
    ]);

    if (!employee || !product) {
      return sendResponse(res, 404, {
        message: !employee ? "Empleado no encontrado" : "Producto no encontrado"
      });
    }

    if (product.cantidad < cantidad) {
      return sendResponse(res, 400, { message: `No hay suficiente stock. Disponible: ${product.cantidad}` });
    }

    // Reducir stock del producto
    product.cantidad -= cantidad;
    product.historial.push({
      accion: "Entrega a empleado",
      detalles: `Entregado a ${employee.name} (${cantidad} unidades).`,
      fecha: new Date()
    });
    await product.save();

    // Registrar entrega en el empleado
    employee.deliveries.push({
      productId: product._id,
      productName: productName || product.nombre,
      cantidad: cantidad,
      date: new Date()
    });
    await Promise.all([product.save(), employee.save()]);

    return sendResponse(res, 200, {
      message: "Producto asignado correctamente",
      data: { 
        employee: employee.name,
        product: product.nombre,
        cantidad: cantidad 
      }
    });

  } catch (error) {
    return handleError(res, error, "Error al asignar producto");
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignProductToEmployee
};