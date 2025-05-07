const Salida = require('../models/salidaVehiculoSchema');
const Ingreso = require('../models/ingresoVehiculoSchema');
const { uploadImage } = require('../middleware/uploadMiddleware');

// Registrar salida de vehículo
exports.crearSalida = async (req, res) => {
    try {
        const { ingreso, reparacionesRealizadas, estadoReparaciones, observaciones } = req.body;
        
        // Verificar que el ingreso existe
        const ingresoExistente = await Ingreso.findById(ingreso);
        if (!ingresoExistente) {
            return res.status(404).json({ error: 'Registro de ingreso no encontrado' });
        }

        // Procesar fotos de salida
        const fotosSalida = [];
        if (req.files && req.files.fotos) {
            for (const foto of req.files.fotos) {
                const fotoUrl = await uploadImage(foto);
                fotosSalida.push(fotoUrl);
            }
        }

        // Procesar firmas
        const firmaEncargado = await uploadImage(req.files.firmaEncargado[0]);
        const firmaConductor = await uploadImage(req.files.firmaConductor[0]);

        // Crear registro de salida
        const nuevaSalida = new Salida({
            ingreso,
            reparacionesRealizadas,
            fotosSalida,
            firmas: {
                encargado: firmaEncargado,
                conductor: firmaConductor
            },
            estadoReparaciones,
            observaciones
        });

        // Actualizar estado del ingreso
        ingresoExistente.estado = 'completado';
        await ingresoExistente.save();

        await nuevaSalida.save();
        res.status(201).json(nuevaSalida);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las salidas
exports.obtenerSalidas = async (req, res) => {
    try {
        const salidas = await Salida.find()
            .populate('ingreso')
            .sort({ fechaSalida: -1 });
            
        res.json(salidas);
    } catch (error) {
        res.status(500).json({ error: error.message });
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