const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const createError = require('http-errors');

// 1. Configuración de almacenamiento mejorada
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Verificar y crear directorio de manera asíncrona
    fs.access(uploadDir, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(uploadDir, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            console.error('Error al crear directorio:', mkdirErr);
            return cb(new Error('No se pudo crear el directorio de uploads'));
          }
          cb(null, uploadDir);
        });
      } else {
        cb(null, uploadDir);
      }
    });
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${fileExt}`;
    cb(null, uniqueName);
  }
});

// 2. Filtro de tipos de archivos
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(createError(400, `Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

// 3. Configuración principal de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 20 // Máximo 20 archivos en total
  }
});

// 4. Configuraciones específicas para diferentes rutas
const uploadConfigs = {
  // Para ingresos de vehículos
  ingreso: upload.fields([
    { name: 'fotos', maxCount: 10 },
    { name: 'firmaEncargado', maxCount: 1 },
    { name: 'firmaConductor', maxCount: 1 }
  ]),

  // Para salidas de vehículos
  salida: upload.fields([
    { name: 'fotosSalida', maxCount: 10 },
    { name: 'firmaRecibido', maxCount: 1 }
  ]),

  // Para documentos genéricos
  documentos: upload.array('documentos', 5)
};

// 5. Middleware para manejo de errores
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Errores específicos de Multer
    let errorMessage = 'Error al subir archivos';
    
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        errorMessage = 'El archivo excede el tamaño máximo permitido (10MB)';
        break;
      case 'LIMIT_FILE_COUNT':
        errorMessage = 'Se excedió el número máximo de archivos permitidos';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        errorMessage = 'Campo de archivo no reconocido';
        break;
    }

    return res.status(400).json({ 
      success: false,
      error: errorMessage 
    });
  } else if (err) {
    // Otros tipos de errores
    return res.status(400).json({
      success: false,
      error: err.message || 'Error desconocido al procesar archivos'
    });
  }
  next();
};

// 6. Utilidad para limpieza de archivos
const deleteUploadedFiles = (filePaths) => {
  if (!Array.isArray(filePaths)) {
    filePaths = [filePaths];
  }

  filePaths.forEach(filePath => {
    if (!filePath) return;

    const fullPath = path.join(__dirname, '../uploads', path.basename(filePath));
    
    fs.unlink(fullPath, err => {
      if (err && err.code !== 'ENOENT') { // Ignorar si el archivo no existe
        console.error(`Error al eliminar archivo ${filePath}:`, err);
      }
    });
  });
};

module.exports = {
  ...uploadConfigs,
  handleUploadErrors,
  deleteUploadedFiles,
  // Exportar upload básico por si acaso
  upload
};