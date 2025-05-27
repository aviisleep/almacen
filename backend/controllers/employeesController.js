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
    const employees = await Employee.find()
      .populate('deliveries.productId')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, {
      message: "Empleados obtenidos exitosamente",
      data: employees
    });
  } catch (error) {
    return handleError(res, error, "Error al obtener empleados");
  }
};

// Obtener empleado por ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
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
      birthDate,
      active
    } = req.body;

    // Verificar si el email ya existe
    if (email) {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return sendResponse(res, 400, {
          message: "Ya existe un empleado con este email",
          error: "EMAIL_DUPLICATE"
        });
      }
    }

    const newEmployee = new Employee({
      name,
      email,
      phone,
      position,
      birthDate: birthDate ? new Date(birthDate) : null,
      active: active !== undefined ? active : true
    });

    const savedEmployee = await newEmployee.save();

    return sendResponse(res, 201, {
      message: "Empleado creado exitosamente",
      data: savedEmployee
    });

  } catch (error) {
    if (error.code === 11000) {
      return sendResponse(res, 400, {
        message: "Ya existe un empleado con este email",
        error: "EMAIL_DUPLICATE"
      });
    }
    return handleError(res, error, "Error al crear el empleado");
  }
};

// Actualizar empleado
const updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, position, birthDate, active } = req.body;
    
    // Verificar si el empleado existe
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return sendResponse(res, 404, { 
        message: "Empleado no encontrado" 
      });
    }

    // Si se está actualizando el email, verificar que no exista
    if (email && email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return sendResponse(res, 400, {
          message: "Ya existe un empleado con este email",
          error: "EMAIL_DUPLICATE"
        });
      }
    }

    const updateData = {
      name,
      email,
      phone,
      position,
      birthDate: birthDate ? new Date(birthDate) : null,
      active: active !== undefined ? active : true
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Empleado actualizado correctamente",
      data: updatedEmployee
    });

  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    if (error.code === 11000) {
      return sendResponse(res, 400, {
        message: "Ya existe un empleado con este email",
        error: "EMAIL_DUPLICATE"
      });
    }
    return handleError(res, error, "Error al actualizar empleado");
  }
};

// Eliminar empleado (soft delete)
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return sendResponse(res, 404, { 
        message: "Empleado no encontrado" 
      });
    }

    employee.active = false;
    await employee.save();

    return sendResponse(res, 200, {
      success: true,
      message: "Empleado eliminado correctamente",
      data: employee
    });

  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    return handleError(res, error, "Error al eliminar el empleado");
  }
};

// Asignar producto a empleado
const assignProductToEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, cantidad } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return sendResponse(res, 404, { message: "Empleado no encontrado" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, { message: "Producto no encontrado" });
    }

    if (product.stock < cantidad) {
      return sendResponse(res, 400, { message: "No hay suficiente stock disponible" });
    }

    // Actualizar el stock del producto
    product.stock -= cantidad;
    await product.save();

    // Usar el método del modelo para entregar el producto
    await employee.deliverProduct(productId, cantidad);

    return sendResponse(res, 200, {
      message: "Producto entregado correctamente",
      data: {
        employee,
        product
      }
    });

  } catch (error) {
    return handleError(res, error, "Error al entregar producto al empleado");
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