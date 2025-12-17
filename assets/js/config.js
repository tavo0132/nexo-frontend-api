// ===================================
// NEXO FRONTEND - CONFIGURACIÓN GLOBAL
// ===================================

const CONFIG = {
    // URL base del backend API
    API_BASE_URL: 'http://localhost:5000',
    
    // Endpoints de la API
    API_ENDPOINTS: {
        // Autenticación
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
        
        // Usuarios
        USERS: '/users',
        USER_PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        UPLOAD_AVATAR: '/users/upload-avatar',
        
        // Amistades
        FRIENDS: '/friends',
        FRIEND_REQUESTS: '/friends/requests',
        SEND_REQUEST: '/friends/send-request',
        ACCEPT_REQUEST: '/friends/accept-request',
        REJECT_REQUEST: '/friends/reject-request',
        REMOVE_FRIEND: '/friends/remove-friend',
        
        // Health check
        HEALTH: '/health'
    },
    
    // Configuración de la aplicación
    APP_NAME: 'Nexo',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'Red Social para conectar personas',
    
    // Configuración de autenticación
    AUTH: {
        TOKEN_KEY: 'nexo_access_token',
        REFRESH_KEY: 'nexo_refresh_token',
        USER_KEY: 'nexo_user_data',
        TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutos en millisegundos
        TOKEN_CHECK_INTERVAL: 30000, // Verificar token cada 30 segundos
        AUTO_LOGOUT_WARNING: 2 * 60 * 1000, // Advertir 2 minutos antes del logout automático
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 horas timeout de sesión
    },
    
    // Configuración de archivos
    FILES: {
        MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        DEFAULT_AVATAR: 'assets/img/default-avatar.png'
    },
    
    // Configuración de paginación
    PAGINATION: {
        USERS_PER_PAGE: 12,
        FRIENDS_PER_PAGE: 20,
        POSTS_PER_PAGE: 10
    },
    
    // Configuración de UI
    UI: {
        LOADING_DELAY: 300, // milisegundos
        TOAST_DURATION: 5000, // milisegundos
        ANIMATION_DURATION: 300 // milisegundos
    },
    
    // Mensajes de la aplicación
    MESSAGES: {
        // Errores generales
        NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
        SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
        UNAUTHORIZED: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
        FORBIDDEN: 'No tienes permisos para realizar esta acción.',
        NOT_FOUND: 'Recurso no encontrado.',
        
        // Autenticación
        LOGIN_SUCCESS: '¡Bienvenido! Sesión iniciada correctamente.',
        LOGIN_ERROR: 'Credenciales incorrectas. Verifica tu email y contraseña.',
        REGISTER_SUCCESS: '¡Registro exitoso! Ya puedes iniciar sesión.',
        REGISTER_ERROR: 'Error en el registro. Verifica la información ingresada.',
        LOGOUT_SUCCESS: 'Sesión cerrada correctamente.',
        
        // Profile
        PROFILE_UPDATE_SUCCESS: 'Perfil actualizado correctamente.',
        PROFILE_UPDATE_ERROR: 'Error al actualizar el perfil.',
        AVATAR_UPDATE_SUCCESS: 'Avatar actualizado correctamente.',
        AVATAR_UPDATE_ERROR: 'Error al actualizar el avatar.',
        
        // Amistades
        FRIEND_REQUEST_SENT: 'Solicitud de amistad enviada.',
        FRIEND_REQUEST_ACCEPTED: 'Solicitud de amistad aceptada.',
        FRIEND_REQUEST_REJECTED: 'Solicitud de amistad rechazada.',
        FRIEND_REMOVED: 'Amigo eliminado de tu lista.',
        
        // Validaciones
        REQUIRED_FIELD: 'Este campo es obligatorio.',
        INVALID_EMAIL: 'Ingresa un email válido.',
        PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 6 caracteres.',
        PASSWORDS_NOT_MATCH: 'Las contraseñas no coinciden.',
        FILE_TOO_LARGE: 'El archivo es demasiado grande. Máximo 5MB.',
        INVALID_FILE_TYPE: 'Tipo de archivo no válido. Solo se permiten imágenes.',
        
        // Loading
        LOADING: 'Cargando...',
        PLEASE_WAIT: 'Por favor espera...',
        PROCESSING: 'Procesando...',
        
        // Confirmaciones
        CONFIRM_DELETE: '¿Estás seguro de que quieres eliminar este elemento?',
        CONFIRM_LOGOUT: '¿Estás seguro de que quieres cerrar sesión?',
        CONFIRM_REMOVE_FRIEND: '¿Estás seguro de que quieres eliminar este amigo?'
    },
    
    // Rutas de la aplicación (SPA)
    ROUTES: {
        HOME: '/',
        LOGIN: '/login',
        REGISTER: '/register',
        PROFILE: '/profile',
        FRIENDS: '/friends',
        USERS: '/users',
        ABOUT: '/about',
        CONTACT: '/contact'
    },
    
    // Configuración de desarrollo
    DEBUG: true,
    
    // Funciones de utilidad
    getFullApiUrl: function(endpoint) {
        return this.API_BASE_URL + endpoint;
    },
    
    log: function(message, type = 'info') {
        if (this.DEBUG) {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
            
            switch(type) {
                case 'error':
                    console.error(prefix, message);
                    break;
                case 'warn':
                    console.warn(prefix, message);
                    break;
                case 'info':
                default:
                    console.log(prefix, message);
                    break;
            }
        }
    },
    
    // Validar configuración
    validate: function() {
        if (!this.API_BASE_URL) {
            console.error('CONFIG: API_BASE_URL is required');
            return false;
        }
        
        if (!this.API_ENDPOINTS) {
            console.error('CONFIG: API_ENDPOINTS is required');
            return false;
        }
        
        return true;
    }
};

// Validar configuración al cargar
if (!CONFIG.validate()) {
    throw new Error('Invalid configuration. Please check CONFIG object.');
}

// Exportar configuración para uso global
window.CONFIG = CONFIG;