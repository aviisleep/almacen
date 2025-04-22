const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Product = require('../models/Product');
const Vehicle = require('../models/Vehiculo');


// Obtener todos los empleados
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los empleados.', error: error.message });
  }
};

// Obtener un empleado por ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('vehicles.vehicleId')
      .populate('deliveries.productId');
    
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    }
    
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    handleError(res, error, 'Error al obtener el empleado');
  }
};

// Crear un nuevo empleado
const createEmployee = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  try {
    const { name } = req.body;

    // Validar que el nombre esté presente
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "El nombre del empleado es obligatorio." });
    }

    // Crear el nuevo empleado
    const newEmployee = new Employee({
      name,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error al crear el empleado:", error.message);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Actualizar un empleado
const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    }
    
    res.status(200).json({ success: true, data: updatedEmployee });
  } catch (error) {
    handleError(res, error, 'Error al actualizar el empleado');
  }
};

// Eliminar un empleado
const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    }
    
    res.status(200).json({ success: true, message: 'Empleado eliminado correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar el empleado');
  }
};

// Asignar vehículo a empleado
const assignVehicleToEmployee = async (req, res) => {
  try {
    const { employeeId, vehicleId } = req.body;

    // Validaciones
    if (!mongoose.Types.ObjectId.isValid(employeeId) || !mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ success: false, message: 'IDs inválidos' });
    }

    const [employee, vehicle] = await Promise.all([
      Employee.findById(employeeId),
      Vehiculo.findById(vehicleId)
    ]);

    if (!employee || !vehicle) {
      return res.status(404).json({ 
        success: false, 
        message: `${!employee ? 'Empleado' : 'Vehículo'} no encontrado` 
      });
    }

    // Verificar si ya está asignado
    const isAssigned = employee.vehicles.some(v => v.vehicleId.equals(vehicle._id));
    if (isAssigned) {
      return res.status(400).json({ 
        success: false, 
        message: 'El vehículo ya está asignado a este empleado' 
      });
    }

    // Asignar vehículo
    employee.vehicles.push({ vehicleId: vehicle._id });
    await employee.save();

    res.status(200).json({ 
      success: true, 
      message: 'Vehículo asignado correctamente',
      data: employee 
    });
  } catch (error) {
    handleError(res, error, 'Error al asignar el vehículo');
  }
};

// Entregar producto a empleado
const deliverProductToEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { productoId, cantidad } = req.body;

    // Validaciones básicas
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(productoId)) {
      return res.status(400).json({ success: false, message: 'IDs inválidos' });
    }

    if (cantidad <= 0) {
      return res.status(400).json({ success: false, message: 'La cantidad debe ser mayor a cero' });
    }

    const [employee, product] = await Promise.all([
      Employee.findById(id),
      Product.findById(productoId)
    ]);

    if (!employee || !product) {
      return res.status(404).json({ 
        success: false, 
        message: `${!employee ? 'Empleado' : 'Producto'} no encontrado` 
      });
    }

    if (product.cantidad < cantidad) {
      return res.status(400).json({ 
        success: false, 
        message: 'No hay suficiente stock disponible' 
      });
    }

    // Actualizar producto
    product.cantidad -= cantidad;
    await product.save();

    // Registrar entrega
    employee.deliveries.push({
      productId: product._id,
      productName: product.nombre,
      quantity: cantidad,
      date: new Date()
    });

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Producto asignado correctamente',
      data: {
        empleado: employee,
        producto: product
      }
    });
  } catch (error) {
    handleError(res, error, 'Error al asignar el producto');
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignVehicleToEmployee,
  deliverProductToEmployee
};
