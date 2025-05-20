const Salida = require('../models/salidaVehiculoSchema');
const Ingreso = require('../models/ingresoVehiculoSchema');
const { uploadImage } = require('../middleware/uploadMiddleware');

// Registrar salida de vehículo
exports.crearSalida = async (req, res, next) => {
  try {
    // Procesar archivos subidos
    const fotosSalida = req.files.fotosSalida?.map(file => `/uploads/${file.filename}`) || [];
    const firmaRecibido = req.files.firmaRecibido?.[0]?.filename 
      ? `/uploads/${req.files.firmaRecibido[0].filename}`
      : null;

    // Crear nueva salida
    const nuevaSalida = new Salida({
      ...req.body,
      fotosSalida,
      firmaRecibido
    });

    await nuevaSalida.save();
    res.status(201).json(nuevaSalida);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las salidas
exports.obtenerSalidas = async (req, res, next) => {
  try {
    const salidas = await Salida.find();
    res.json(salidas);
  } catch (error) {
    next(error);
  }
};

// Obtener salida por ID de ingreso
exports.obtenerSalidaPorIngreso = async (req, res) => {
    try {
        const salida = await Salida.findOne({ ingreso: req.params.ingresoId })
            .populate('ingreso');
            
        if (!salida) {
            return res.status(404).json({ error: 'Registro de salida no encontrado' });
        }
        
        res.json(salida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una salida específica
exports.obtenerSalida = async (req, res) => {
    try {
        const salida = await Salida.findById(req.params.id)
            .populate('ingreso');
            
        if (!salida) {
            return res.status(404).json({ error: 'Registro de salida no encontrado' });
        }
        
        res.json(salida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una salida
exports.actualizarSalida = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const salidaActualizada = await Salida.findByIdAndUpdate(id, datosActualizados, {
      new: true,
    });

    if (!salidaActualizada) {
      return res.status(404).json({ error: 'Salida no encontrada' });
    }

    res.json(salidaActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una salida
exports.eliminarSalida = async (req, res) => {
  try {
    const { id } = req.params;
    const salidaEliminada = await Salida.findByIdAndDelete(id);

    if (!salidaEliminada) {
      return res.status(404).json({ error: 'Salida no encontrada' });
    }

    res.json({ mensaje: 'Salida eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};