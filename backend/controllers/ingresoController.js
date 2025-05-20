const Ingreso = require('../models/ingresoVehiculoSchema');
const { deleteUploadedFiles } = require('../middleware/uploadMiddleware');

// Crear nuevo registro de ingreso
exports.crearIngreso = async (req, res, next) => {
  try {
    const fotos = req.files.fotos?.map(file => `/uploads/${file.filename}`) || [];
    const firmaEncargado = req.files.firmaEncargado?.[0]?.filename 
      ? `/uploads/${req.files.firmaEncargado[0].filename}` 
      : null;
    const firmaConductor = req.files.firmaConductor?.[0]?.filename 
      ? `/uploads/${req.files.firmaConductor[0].filename}` 
      : null;

    if (!req.body.compania || !req.body.conductor || !req.body.vehiculo) {
      // Eliminar archivos subidos si los datos son inválidos
      deleteUploadedFiles([...fotos, firmaEncargado, firmaConductor]);
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevoIngreso = new Ingreso({
      compania: req.body.compania,
      conductor: JSON.parse(req.body.conductor),
      vehiculo: JSON.parse(req.body.vehiculo),
      reparacionesSolicitadas: JSON.parse(req.body.reparacionesSolicitadas),
      observaciones: req.body.observaciones,
      fotosEntrada: fotos,
      firmas: {
        encargado: firmaEncargado,
        conductor: firmaConductor
      }
    });

    await nuevoIngreso.save();
    res.status(201).json(nuevoIngreso);
  } catch (error) {
    // Limpiar archivos en caso de error
    const allFiles = [
      ...(req.files.fotos || []).map(f => `/uploads/${f.filename}`),
      ...(req.files.firmaEncargado || []).map(f => `/uploads/${f.filename}`),
      ...(req.files.firmaConductor || []).map(f => `/uploads/${f.filename}`)
    ];
    deleteUploadedFiles(allFiles);
    next(error);
  }
};

// Obtener todos los ingresos
exports.obtenerIngresos = async (req, res) => {
    try {
        const { estado } = req.query;
        const filter = estado ? { estado } : {};
        
        const ingresos = await Ingreso.find(filter).sort({ fechaEntrada: -1 });
        res.json(ingresos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un ingreso específico
exports.obtenerIngreso = async (req, res) => {
    try {
        const ingreso = await Ingreso.findById(req.params.id);
        if (!ingreso) {
            return res.status(404).json({ error: 'Registro de ingreso no encontrado' });
        }
        res.json(ingreso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un ingreso
exports.actualizarIngreso = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['compania', 'conductor', 'vehiculo', 'reparacionesSolicitadas', 'observaciones', 'estado'];
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Actualizaciones no permitidas' });
    }
    
    const ingreso = await Ingreso.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!ingreso) {
      return res.status(404).json({ error: 'Registro de ingreso no encontrado' });
    }
    
    res.json(ingreso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un ingreso (solo si no tiene salida asociada)
exports.eliminarIngreso = async (req, res) => {
  try {
    const salidaAsociada = await Salida.findOne({ ingreso: req.params.id });
    if (salidaAsociada) {
      return res.status(400).json({ error: 'No se puede eliminar, existe una salida asociada' });
    }

    const ingreso = await Ingreso.findByIdAndDelete(req.params.id);
    if (!ingreso) {
      return res.status(404).json({ error: 'Registro de ingreso no encontrado' });
    }

    const archivosAEliminar = [
      ...(ingreso.fotosEntrada || []),
      ingreso.firmas?.encargado,
      ingreso.firmas?.conductor
    ];
    deleteUploadedFiles(archivosAEliminar);

    res.json({ message: 'Ingreso eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};