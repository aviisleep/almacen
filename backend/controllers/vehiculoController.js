const mongoose = require('mongoose');
const Vehiculo = require('../models/Vehiculo');

// Obtener todos los vehículos
exports.getVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find();
        res.json(vehiculos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener por id el vehiculo

exports.getVehiculoById = async (req, res) => {
    try {
        const { id } = req.params; // ID del vehículo
        const vehiculo = await Vehiculo.findById(id);

        if (!vehiculo) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Crear un nuevo vehículo
exports.createVehiculo = async (req, res) => {
    try {
        console.log("Datos recibidos en el backend:", req.body);
        const { placa, compañia, tipoVehiculo, estado } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!placa || !compañia || !tipoVehiculo || !estado) {
            return res.status(400).json({ message: "La placa, la compañía y el tipo de vehículo son obligatorios." });
        }

        // Validar que el tipo de vehículo sea uno de los valores permitidos
        if (!['Trailer', 'Van', 'Botellero'].includes(tipoVehiculo)) {
            return res.status(400).json({ message: "Tipo de vehículo inválido. Debe ser 'Trailer', 'Van' o 'Botellero'." });
        }

        const vehiculo = new Vehiculo({
            placa,
            compañia,
            tipoVehiculo,
            estado,
        });

        const nuevoVehiculo = await vehiculo.save();
        res.status(201).json(nuevoVehiculo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un vehículo
exports.updateVehiculo = async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);
    try {
      const { id } = req.params; // ID del vehículo
      const { placa, compañia, tipoVehiculo, estado } = req.body;
  
      // Validar que los campos obligatorios estén presentes
      if (!placa || !compañia || !tipoVehiculo || !estado) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }
  
      // Validar que el tipo de vehículo sea uno de los valores permitidos
      if (!['Trailer', 'Van', 'Botellero'].includes(tipoVehiculo)) {
        return res.status(400).json({ message: "Tipo de vehículo inválido. Debe ser 'Trailer', 'Van' o 'Botellero'." });
      }
  
      // Validar que el estado sea uno de los valores permitidos
      if (!['cotizacion', 'mantenimiento', 'reparado'].includes(estado)) {
        return res.status(400).json({ message: "Estado inválido. Debe ser 'cotizacion', 'mantenimiento' o 'reparado'." });
      }
  
      // Actualizar el vehículo
      const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(
        id,
        { placa, compañia, tipoVehiculo, estado },
        { new: true } // Devuelve el documento actualizado
      );
  
      if (!vehiculoActualizado) {
        return res.status(404).json({ message: "Vehículo no encontrado." });
      }
  
      res.json(vehiculoActualizado);
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error.message);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  };

// Asignar un empleado a un vehículo
exports.assignEmpleadoToVehiculo = async (req, res) => {
    try {
        const { id } = req.params; // ID del vehículo
        const { empleadoId } = req.body; // ID del empleado

        // Validar que el ID del empleado sea válido
        if (!mongoose.Types.ObjectId.isValid(empleadoId)) {
            return res.status(400).json({ message: "ID de empleado inválido." });
        }

        // Buscar el vehículo
        const vehiculo = await Vehiculo.findById(id);
        if (!vehiculo) {
            return res.status(404).json({ message: "Vehículo no encontrado." });
        }

        // Asignar el empleado
        vehiculo.empleadoAsignado = empleadoId;
        const vehiculoActualizado = await vehiculo.save();

        res.json(vehiculoActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Asignar productos a un vehículo
exports.assignProductToVehicle = async (req, res) => {
    try {
      const { id } = req.params; // ID del vehículo
      const { productId, quantity, assignedBy } = req.body;
  
      // Validaciones
      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "IDs inválidos" });
      }
  
      const [vehicle, product] = await Promise.all([
        Vehicle.findById(id),
        Product.findById(productId),
      ]);
  
      if (!vehicle || !product) {
        return res.status(404).json({ message: `${!vehicle ? 'Vehículo' : 'Producto'} no encontrado` });
      }
  
      if (product.cantidad < quantity) {
        return res.status(400).json({ message: "No hay suficiente stock disponible" });
      }
  
      // Actualizar inventario
      product.cantidad -= quantity;
      product.historial.push({
        accion: "Asignación a vehículo",
        detalles: `Asignado a vehículo ${vehicle.placa} (${quantity} unidades)`,
      });
      await product.save();
  
      // Registrar asignación en el vehículo
      vehicle.productosAsignados.push({
        productId: product._id,
        nombre: product.nombre,
        cantidad: quantity,
        asignadoPor: assignedBy,
        fechaAsignacion: new Date(),
      });
      await vehicle.save();
  
      res.status(200).json({ message: "Producto asignado al vehículo exitosamente", data: { vehicle, product } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Cambiar el estado de un vehículo
exports.updateEstadoVehiculo = async (req, res) => {
    try {
        const { id } = req.params; // ID del vehículo
        const { estado } = req.body; // Nuevo estado

        // Validar que el estado sea uno de los valores permitidos
        if (!['cotizacion', 'mantenimiento', 'reparado'].includes(estado)) {
            return res.status(400).json({ message: "Estado inválido. Debe ser 'cotizacion', 'mantenimiento' o 'reparado'." });
        }

        // Actualizar el estado del vehículo
        const vehiculo = await Vehiculo.findByIdAndUpdate(
            id,
            { estado },
            { new: true } // Devuelve el documento actualizado
        );

        if (!vehiculo) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un vehículo
exports.deleteVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculoEliminado = await Vehiculo.findByIdAndDelete(id);

        if (!vehiculoEliminado) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        res.json({ message: "Vehículo eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};