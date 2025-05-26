const User = require('../models/user');
const { sendResponse, handleError } = require('../utils/responseHandler');

// @desc    Registrar un nuevo usuario (solo admin)
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    // Verificar si el usuario que hace la petición es admin
    if (req.user.role !== 'admin') {
      return handleError(res, 'No autorizado - Solo los administradores pueden crear usuarios', 403);
    }

    // Verificar si el email ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return handleError(res, 'El email ya está registrado', 400);
    }

    // Crear el usuario
    const user = await User.create({
      nombre,
      email,
      password,
      role: role || 'empleado' // Por defecto es empleado si no se especifica
    });

    sendResponse(res, 201, {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    handleError(res, error.message);
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingrese email y contraseña'
      });
    }

    // Buscar usuario y verificar contraseña
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Actualizar último login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generar token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          nombre: user.nombre,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verificar que se proporcionen ambas contraseñas
    if (!currentPassword || !newPassword) {
      return handleError(res, 'Por favor ingrese la contraseña actual y la nueva contraseña', 400);
    }

    // Buscar usuario y verificar contraseña actual
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return handleError(res, 'Contraseña actual incorrecta', 401);
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    sendResponse(res, 200, { message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    handleError(res, error.message);
  }
};

// @desc    Obtener perfil del usuario actual
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    sendResponse(res, 200, user);
  } catch (error) {
    handleError(res, error.message);
  }
};

// @desc    Actualizar perfil del usuario actual
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const fieldsToUpdate = {};

    if (nombre) fieldsToUpdate.nombre = nombre;
    if (email) fieldsToUpdate.email = email;

    // No permitir actualizar contraseña o rol desde aquí
    if (req.body.password || req.body.role) {
      return handleError(res, 'No se puede actualizar la contraseña o el rol desde esta ruta', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    sendResponse(res, 200, user);
  } catch (error) {
    handleError(res, error.message);
  }
};

// @desc    Desactivar usuario (solo admin)
// @route   PUT /api/auth/:id/deactivate
// @access  Private/Admin
const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return handleError(res, 'Usuario no encontrado', 404);
    }

    // No permitir desactivar a otros admins
    if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
      return handleError(res, 'No se puede desactivar a otro administrador', 403);
    }

    user.active = false;
    await user.save();

    sendResponse(res, 200, { message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    handleError(res, error.message);
  }
};

module.exports = {
  registerUser,
  login,
  changePassword,
  getMe,
  updateMe,
  deactivateUser
}; 