require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const createUser = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Obtener argumentos de la línea de comandos
    const [,, nombre, email, password] = process.argv;

    if (!nombre || !email || !password) {
      console.log('Uso: node createUser.js <nombre> <email> <password>');
      process.exit(1);
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('El usuario ya existe');
      process.exit(1);
    }

    // Crear el usuario
    const user = await User.create({
      nombre,
      email,
      password
    });

    console.log('Usuario creado exitosamente:');
    console.log({
      id: user._id,
      nombre: user.nombre,
      email: user.email
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createUser(); 