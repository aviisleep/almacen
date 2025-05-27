import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Cache simple para GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para esperar
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Configuración automática de headers según el tipo de datos
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token enviado en la solicitud:', token.substring(0, 20) + '...');
    } else if (!config.url.includes('/auth/login')) {
      console.warn('No se encontró token de autenticación para:', config.url);
    }
    
    // Implementar caché para GET requests
    if (config.method === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = cache.get(cacheKey);
      
      if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
        return Promise.reject({
          __CACHE__: true,
          data: cachedResponse.data
        });
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Error en la configuración de la solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    // Guardar en caché las respuestas GET
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  async (error) => {
    if (error.response) {
      // Si el error es de autenticación (401)
      if (error.response.status === 401) {
        // Solo redirigir si no estamos ya en la página de login y no es una petición a /auth/me
        if (!window.location.pathname.includes('/login') && 
            !error.config.url.includes('/auth/me') &&
            !error.config.url.includes('/auth/login')) {
          console.log('Error de autenticación, redirigiendo a login');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      
      // Si el error es de permisos (403)
      if (error.response.status === 403) {
        console.error('No tienes permisos para realizar esta acción');
      }
    }
    
    // Si es una respuesta de caché, devolver los datos
    if (error.__CACHE__) {
      return { data: error.data };
    }

    const config = error.config;

    // Si no hay configuración o ya se intentó el máximo de reintentos, rechazar
    if (!config || !config.retry || config.__retryCount >= config.retry) {
      if (error.response) {
        // Error con respuesta del servidor
        const errorData = {
          status: error.response.status,
          message: error.response.data?.message || 'Error en la solicitud',
          data: error.response.data,
        };
        console.error('API Error:', errorData);
        return Promise.reject(errorData);
      } else if (error.request) {
        // Error sin respuesta del servidor
        const errorData = {
          message: 'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.',
          isConnectionError: true,
          details: error.message,
        };
        console.error('Connection Error:', errorData);
        return Promise.reject(errorData);
      } else {
        // Error en configuración de la solicitud
        console.error('Request Error:', error.message);
        return Promise.reject({ 
          message: 'Error en la configuración de la solicitud',
          details: error.message 
        });
      }
    }

    // Incrementar contador de reintentos
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount++;

    // Esperar antes de reintentar
    await wait(config.retryDelay * config.__retryCount);

    // Reintentar la solicitud
    return api(config);
  }
);

// Función para obtener estadísticas del dashboard con manejo de errores mejorado
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

export default api;