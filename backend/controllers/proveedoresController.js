const Proveedores = require('../models/Proveedores');

// Obtener todos los proveedores
const obtenerProveedores = async (req, res) => {
    try {
      const proveedores = await Proveedores.find();
      res.json(proveedores);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const obtenerProveedorPorId = async (req, res) => {
    try {
        const proveedor = await Proveedores.findById(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el proveedor', error });
    }
};

// Crear un nuevo proveedor
const crearProveedor = async (req, res) => {
    try {
      const { nombre, empresa, direccion, numero, nit, metodoPago } = req.body;
  
      // Crear un nuevo proveedor
      const nuevoProveedor = new Proveedores({
        nombre,
        empresa,
        direccion,
        numero,
        nit,
        metodoPago, // Usa el valor proporcionado o deja que Mongoose asigne los valores predeterminados
      });
  
      await nuevoProveedor.save();
      res.status(201).json(nuevoProveedor);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear el proveedor', error });
    }
  };

// Actualizar un proveedor
const actualizarProveedor = async (req, res) => {
    try {
        const { nombre, empresa, direccion, numero, nit, metodoPago } = req.body;
    
        const proveedorActualizado = await Proveedores.findByIdAndUpdate(
          req.params.id,
          { nombre, empresa, direccion, numero, nit, metodoPago },
          { new: true }
        );
        console.log(proveedorActualizado);
    
        if (!proveedorActualizado) {
          return res.status(404).json({ message: "Proveedor no encontrado." });
        }
    
        res.json(proveedorActualizado);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };

// Eliminar un proveedor
const eliminarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedorEliminado = await Proveedores.findByIdAndDelete(id);
        if (!proveedorEliminado) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el proveedor', error });
    }
};

module.exports = {
  obtenerProveedores,
  obtenerProveedorPorId,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};