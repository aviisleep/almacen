const Ingreso = require('../models/ingresoVehiculoSchema');
const { uploadImage } = require('../middleware/uploadMiddleware');

// Crear nuevo registro de ingreso
exports.crearIngreso = async (req, res) => {
    try {
        const { compania, conductor, vehiculo, reparacionesSolicitadas, observaciones } = req.body;
        
        // Procesar fotos
        const fotosEntrada = [];
        if (req.files && req.files.fotos) {
            for (const foto of req.files.fotos) {
                const fotoUrl = await uploadImage(foto);
                fotosEntrada.push(fotoUrl);
            }
        }

        // Procesar firmas
        const firmaEncargado = await uploadImage(req.files.firmaEncargado[0]);
        const firmaConductor = await uploadImage(req.files.firmaConductor[0]);

        const nuevoIngreso = new Ingreso({
            compania,
            conductor,
            vehiculo,
            reparacionesSolicitadas,
            fotosEntrada,
            firmas: {
                encargado: firmaEncargado,
                conductor: firmaConductor
            },
            observaciones
        });

        await nuevoIngreso.save();
        res.status(201).json(nuevoIngreso);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        const ingreso = await Ingreso.findByIdAndUpdate(
            req.params.id,
            req.body,
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
        
        // Aquí deberías eliminar también las imágenes asociadas del almacenamiento
        res.json({ message: 'Ingreso eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};