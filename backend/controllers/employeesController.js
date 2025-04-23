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
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
    const { id } = req.params; // ID del empleado
    const { productId, quantity, vehicleId } = req.body;

    // Validaciones
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "IDs inválidos" });
    }

    const [employee, product] = await Promise.all([
      Employee.findById(id),
      Product.findById(productId),
    ]);

    if (!employee || !product) {
      return res.status(404).json({ message: `${!employee ? 'Empleado' : 'Producto'} no encontrado` });
    }

    if (product.cantidad < quantity) {
      return res.status(400).json({ message: "No hay suficiente stock disponible" });
    }

    // Reducir el stock del inventario
    product.cantidad -= quantity;
    product.historial.push({
      accion: "Entrega a empleado",
      detalles: `Entregado a ${employee.name} (${quantity} unidades), asociado al vehículo ${vehicleId}.`,
    });
    await product.save();

    // Registrar la entrega en el empleado
    employee.deliveries.push({
      productId: product._id,
      productName: product.nombre,
      quantity,
      vehicleId,
      date: new Date(),
    });
    await employee.save();

    res.status(200).json({ message: "Producto entregado exitosamente", data: { employee, product } });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
