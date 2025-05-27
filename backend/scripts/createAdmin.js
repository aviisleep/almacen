const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'admin@cyrgama.com' });
    if (existingUser) {
      console.log('El usuario administrador ya existe');
      process.exit(0);
    }

    // Crear usuario administrador
    const admin = await User.create({
      nombre: 'Administrador',
      email: 'admin@cyrgama.com',
      password: 'comprasGAMA+',
      role: 'admin',
      active: true
    });

    console.log('Usuario administrador creado exitosamente:', admin);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin(); 