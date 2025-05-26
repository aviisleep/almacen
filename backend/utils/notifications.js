const cron = require('node-cron');
const Product = require('../models/product');
const nodemailer = require('nodemailer');

// Configurar el transportador de correo
const transporter = nodemailer.createTransport({
  // Configura aquí tu servidor de correo
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Función para obtener herramientas pendientes
async function getPendingTools() {
  try {
    const tools = await Product.find({
      esHerramienta: true,
      estado: 'En Uso'
    }).populate('asignaciones.empleado', 'nombre apellido');

    return tools.map(tool => {
      const activeAssignment = tool.asignaciones.find(a => !a.fechaDevolucion);
      return {
        herramienta: tool.nombre,
        SKU: tool.SKU,
        empleado: activeAssignment?.empleado?.nombre + ' ' + activeAssignment?.empleado?.apellido,
        fechaAsignacion: activeAssignment?.fechaAsignacion,
        diasEnUso: Math.floor((new Date() - new Date(activeAssignment?.fechaAsignacion)) / (1000 * 60 * 60 * 24))
      };
    });
  } catch (error) {
    console.error('Error al obtener herramientas pendientes:', error);
    return [];
  }
}

// Función para enviar notificación por correo
async function sendNotificationEmail(pendingTools) {
  if (pendingTools.length === 0) return;

  const htmlContent = `
    <h2>Herramientas Pendientes de Devolución</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th style="padding: 8px;">Herramienta</th>
        <th style="padding: 8px;">SKU</th>
        <th style="padding: 8px;">Empleado</th>
        <th style="padding: 8px;">Fecha Asignación</th>
        <th style="padding: 8px;">Días en Uso</th>
      </tr>
      ${pendingTools.map(tool => `
        <tr>
          <td style="padding: 8px;">${tool.herramienta}</td>
          <td style="padding: 8px;">${tool.SKU}</td>
          <td style="padding: 8px;">${tool.empleado}</td>
          <td style="padding: 8px;">${new Date(tool.fechaAsignacion).toLocaleDateString()}</td>
          <td style="padding: 8px;">${tool.diasEnUso}</td>
        </tr>
      `).join('')}
    </table>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.NOTIFICATION_EMAIL,
    subject: 'Recordatorio: Herramientas Pendientes de Devolución',
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notificación enviada exitosamente');
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
}

// Programar notificaciones
function scheduleNotifications() {
  // Lunes a Viernes a las 4:50 PM
  cron.schedule('50 16 * * 1-5', async () => {
    console.log('Ejecutando notificación de herramientas pendientes (L-V 4:50 PM)');
    const pendingTools = await getPendingTools();
    await sendNotificationEmail(pendingTools);
  });

  // Sábados a las 12:00 PM
  cron.schedule('0 12 * * 6', async () => {
    console.log('Ejecutando notificación de herramientas pendientes (Sábados 12:00 PM)');
    const pendingTools = await getPendingTools();
    await sendNotificationEmail(pendingTools);
  });
}

module.exports = {
  scheduleNotifications,
  getPendingTools,
  sendNotificationEmail
}; 