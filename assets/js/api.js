// ===================================
// NEXO FRONTEND - API CLIENT
// ===================================

const API = {
    /**
     * Realizar petición HTTP
     */
    async request(endpoint, options = {}) {
        const url = CONFIG.getFullApiUrl(endpoint);
        
        // Headers por defecto
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        // Agregar headers de autenticación si están disponibles
        const authHeaders = await Auth.getAuthHeaders();
        
        // Configurar opciones de la petición
        const requestOptions = {
            method: options.method || 'GET',
            headers: {
                ...defaultHeaders,
                ...authHeaders,
                ...options.headers
            },
            ...options
        };
        
        // Agregar body si es necesario
        if (options.body && requestOptions.headers['Content-Type'] === 'application/json') {
            requestOptions.body = JSON.stringify(options.body);
        }
        
        try {
            CONFIG.log(`${requestOptions.method} ${url}`, 'info');
            
            const response = await fetch(url, requestOptions);
            
            // Manejar respuestas sin contenido
            if (response.status === 204) {
                return { success: true };
            }
            
            // Intentar parsear JSON
            let data;
            try {
                data = await response.json();
            } catch (error) {
                // Si no es JSON válido, usar texto
                data = { message: await response.text() };
            }
            
            // Si la respuesta no es exitosa, lanzar error
            if (!response.ok) {
                throw new APIError(
                    data.message || `HTTP ${response.status}`,
                    response.status,
                    data
                );
            }
            
            CONFIG.log(`Response: ${response.status}`, 'info');
            return data;
            
        } catch (error) {
            CONFIG.log(`Request failed: ${error.message}`, 'error');
            
            // Manejar errores de red
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                throw new APIError(CONFIG.MESSAGES.NETWORK_ERROR, 0);
            }
            
            // Manejar errores de API
            if (error instanceof APIError) {
                throw error;
            }
            
            // Error desconocido
            throw new APIError(CONFIG.MESSAGES.SERVER_ERROR, 500);
        }
    },
    
    /**
     * Petición GET
     */
    async get(endpoint, params = null) {
        let url = endpoint;
        
        // Agregar parámetros de query si existen
        if (params) {
            const queryString = new URLSearchParams(params).toString();
            url += `?${queryString}`;
        }
        
        return this.request(url);
    },
    
    /**
     * Petición POST
     */
    async post(endpoint, body = null) {
        return this.request(endpoint, {
            method: 'POST',
            body
        });
    },
    
    /**
     * Petición PUT
     */
    async put(endpoint, body = null) {
        return this.request(endpoint, {
            method: 'PUT',
            body
        });
    },
    
    /**
     * Petición PATCH
     */
    async patch(endpoint, body = null) {
        return this.request(endpoint, {
            method: 'PATCH',
            body
        });
    },
    
    /**
     * Petición DELETE
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    },
    
    /**
     * Subir archivo
     */
    async uploadFile(endpoint, file, fieldName = 'file', additionalData = {}) {
        const formData = new FormData();
        formData.append(fieldName, file);
        
        // Agregar datos adicionales
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });
        
        // Headers de autenticación
        const authHeaders = await Auth.getAuthHeaders();
        
        return this.request(endpoint, {
            method: 'POST',
            headers: {
                // No incluir Content-Type para que el navegador lo establezca automáticamente
                ...authHeaders
            },
            body: formData
        });
    },
    
    /**
     * Endpoints específicos de la API
     */
    
    // Autenticación
    login: (email, password) => API.post(CONFIG.API_ENDPOINTS.LOGIN, { email, password }),
    register: (userData) => API.post(CONFIG.API_ENDPOINTS.REGISTER, userData),
    logout: () => API.post(CONFIG.API_ENDPOINTS.LOGOUT),
    refreshToken: (refreshToken) => API.post(CONFIG.API_ENDPOINTS.REFRESH_TOKEN, { refresh_token: refreshToken }),
    
    // Health check
    healthCheck: () => API.get(CONFIG.API_ENDPOINTS.HEALTH),
    
    // Usuarios
    getUsers: (params) => API.get(CONFIG.API_ENDPOINTS.USERS, params),
    getUserProfile: () => API.get(CONFIG.API_ENDPOINTS.USER_PROFILE),
    updateProfile: (userData) => API.put(CONFIG.API_ENDPOINTS.UPDATE_PROFILE, userData),
    uploadAvatar: (file) => API.uploadFile(CONFIG.API_ENDPOINTS.UPLOAD_AVATAR, file, 'avatar'),
    
    // Amistades
    getFriends: () => API.get(CONFIG.API_ENDPOINTS.FRIENDS),
    getFriendRequests: () => API.get(CONFIG.API_ENDPOINTS.FRIEND_REQUESTS),
    sendFriendRequest: (userId) => API.post(CONFIG.API_ENDPOINTS.SEND_REQUEST, { user_id: userId }),
    acceptFriendRequest: (requestId) => API.post(CONFIG.API_ENDPOINTS.ACCEPT_REQUEST, { request_id: requestId }),
    rejectFriendRequest: (requestId) => API.post(CONFIG.API_ENDPOINTS.REJECT_REQUEST, { request_id: requestId }),
    removeFriend: (userId) => API.delete(`${CONFIG.API_ENDPOINTS.REMOVE_FRIEND}/${userId}`),
};

/**
 * Clase para errores de API personalizados
 */
class APIError extends Error {
    constructor(message, status = 500, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
    
    /**
     * Verificar si es un error de autenticación
     */
    isAuthError() {
        return this.status === 401;
    }
    
    /**
     * Verificar si es un error de permisos
     */
    isForbiddenError() {
        return this.status === 403;
    }
    
    /**
     * Verificar si es un error de no encontrado
     */
    isNotFoundError() {
        return this.status === 404;
    }
    
    /**
     * Verificar si es un error de servidor
     */
    isServerError() {
        return this.status >= 500;
    }
    
    /**
     * Verificar si es un error de red
     */
    isNetworkError() {
        return this.status === 0;
    }
    
    /**
     * Obtener mensaje de error amigable
     */
    getFriendlyMessage() {
        switch (this.status) {
            case 0:
                return CONFIG.MESSAGES.NETWORK_ERROR;
            case 401:
                return CONFIG.MESSAGES.UNAUTHORIZED;
            case 403:
                return CONFIG.MESSAGES.FORBIDDEN;
            case 404:
                return CONFIG.MESSAGES.NOT_FOUND;
            case 500:
            case 502:
            case 503:
                return CONFIG.MESSAGES.SERVER_ERROR;
            default:
                return this.message;
        }
    }
}

// Exportar para uso global
window.API = API;
window.APIError = APIError;