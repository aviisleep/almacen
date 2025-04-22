// src/controllers/ingresoSalidaController.js

const IngresoSalida = require('../models/ingresoSalida');

// Obtener todos los registros
exports.getAllIngresoSalida = async (req, res) => {
    try {
        const registros = await IngresoSalida.find().sort({ fecha: -1 });
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los registros', error });
    }
};

// Crear un nuevo registro
exports.createIngresoSalida = async (req, res) => {
    try {
        const nuevoRegistro = new IngresoSalida(req.body);
        const registroGuardado = await nuevoRegistro.save();
        res.status(201).json(registroGuardado);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el registro', error });
    }
};

// Actualizar un registro
exports.updateIngresoSalida = async (req, res) => {
    try {
        const { id } = req.params;
        const registroActualizado = await IngresoSalida.findByIdAndUpdate(id, req.body, { new: true });
        if (!registroActualizado) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json(registroActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el registro', error });
    }
};

// Eliminar un registro
exports.deleteIngresoSalida = async (req, res) => {
    try {
        const { id } = req.params;
        const registroEliminado = await IngresoSalida.findByIdAndDelete(id);
        if (!registroEliminado) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el registro', error });
    }
};