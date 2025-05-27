const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Usar la URI de MongoDB Atlas si está disponible, sino usar la local
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/almacen';
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI no está definida en el archivo .env');
    }

    // Conectar a MongoDB sin opciones deprecadas
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;