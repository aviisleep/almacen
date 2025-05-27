const Ingreso = require('../models/ingresoVehiculoSchema');
const Salida = require('../models/salidaVehiculoSchema');
const { deleteUploadedFiles } = require('../middleware/uploadMiddleware');

// URL base del servidor
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

// Crear nuevo registro de ingreso
exports.crearIngreso = async (req, res, next) => {
  try {
    // Procesar archivos subidos
    const fotos = req.files?.fotos?.map(file => `${SERVER_URL}/uploads/${file.filename}`) || [];
    const firmaEncargado = req.files?.firmaEncargado?.[0]?.filename 
      ? `${SERVER_URL}/uploads/${req.files.firmaEncargado[0].filename}` 
      : null;
    const firmaConductor = req.files?.firmaConductor?.[0]?.filename 
      ? `${SERVER_URL}/uploads/${req.files.firmaConductor[0].filename}` 
      : null;

    // Validar campos requeridos
    if (!req.body.compania || !req.body.conductor || !req.body.vehiculo) {
      // Eliminar archivos subidos si los datos son inválidos
      deleteUploadedFiles([...fotos, firmaEncargado, firmaConductor].filter(Boolean));
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar firmas
    if (!firmaEncargado || !firmaConductor) {
      deleteUploadedFiles([...fotos, firmaEncargado, firmaConductor].filter(Boolean));
      return res.status(400).json({ error: 'Las firmas son obligatorias' });
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
      ...(req.files?.fotos || []).map(f => `${SERVER_URL}/uploads/${f.filename}`),
      ...(req.files?.firmaEncargado || []).map(f => `${SERVER_URL}/uploads/${f.filename}`),
      ...(req.files?.firmaConductor || []).map(f => `${SERVER_URL}/uploads/${f.filename}`)
    ];
    deleteUploadedFiles(allFiles);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// Obtener todos los ingresos
exports.obtenerIngresos = async (req, res) => {
    try {
        const { estado } = req.query;
        const filter = estado ? { estado } : {};
        
        const ingresos = await Ingreso.find(filter).sort({ fechaEntrada: -1 });
        
        // Procesar las URLs de las imágenes para incluir la URL base
        const ingresosConUrlsCompletas = ingresos.map(ingreso => {
            const ingresoObj = ingreso.toObject();
            if (ingresoObj.fotosEntrada) {
                ingresoObj.fotosEntrada = ingresoObj.fotosEntrada.map(foto => 
                    foto.startsWith('http') ? foto : `${SERVER_URL}${foto}`
                );
            }
            if (ingresoObj.firmas) {
                if (ingresoObj.firmas.encargado && !ingresoObj.firmas.encargado.startsWith('http')) {
                    ingresoObj.firmas.encargado = `${SERVER_URL}${ingresoObj.firmas.encargado}`;
                }
                if (ingresoObj.firmas.conductor && !ingresoObj.firmas.conductor.startsWith('http')) {
                    ingresoObj.firmas.conductor = `${SERVER_URL}${ingresoObj.firmas.conductor}`;
                }
            }
            return ingresoObj;
        });

        res.json(ingresosConUrlsCompletas);
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
    // Verificar si existe el ingreso antes de buscar salidas asociadas
    const ingreso = await Ingreso.findById(req.params.id);
    if (!ingreso) {
      return res.status(404).json({ error: 'Registro de ingreso no encontrado' });
    }

    // Verificar si tiene salida asociada
    const salidaAsociada = await Salida.findOne({ ingreso: req.params.id });
    if (salidaAsociada) {
      return res.status(400).json({ error: 'No se puede eliminar, existe una salida asociada' });
    }

    // Eliminar el ingreso
    await Ingreso.findByIdAndDelete(req.params.id);

    // Eliminar archivos asociados
    const archivosAEliminar = [
      ...(ingreso.fotosEntrada || []),
      ingreso.firmas?.encargado,
      ingreso.firmas?.conductor
    ].filter(Boolean); // Filtrar valores nulos o undefined

    if (archivosAEliminar.length > 0) {
      await deleteUploadedFiles(archivosAEliminar);
    }

    res.json({ message: 'Ingreso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar ingreso:', error);
    res.status(500).json({ 
      error: 'Error al eliminar el ingreso',
      details: error.message 
    });
  }
};