// ===================================
// NEXO FRONTEND - AUTHENTICATION
// ===================================

const Auth = {
    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated() {
        const token = this.getToken();
        return token && !this.isTokenExpired(token);
    },
    
    /**
     * Obtener token de acceso
     */
    getToken() {
        return localStorage.getItem(CONFIG.AUTH.TOKEN_KEY);
    },
    
    /**
     * Obtener token de refresh
     */
    getRefreshToken() {
        return localStorage.getItem(CONFIG.AUTH.REFRESH_KEY);
    },
    
    /**
     * Obtener datos del usuario actual
     */
    getCurrentUser() {
        const userData = localStorage.getItem(CONFIG.AUTH.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },
    
    /**
     * Guardar datos de autenticación
     */
    saveAuthData(tokens, user) {
        localStorage.setItem(CONFIG.AUTH.TOKEN_KEY, tokens.access_token);
        if (tokens.refresh_token) {
            localStorage.setItem(CONFIG.AUTH.REFRESH_KEY, tokens.refresh_token);
        }
        localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(user));
        
        CONFIG.log('Auth data saved', 'info');
    },
    
    /**
     * Limpiar datos de autenticación
     */
    clearAuthData() {
        localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
        localStorage.removeItem(CONFIG.AUTH.REFRESH_KEY);
        localStorage.removeItem(CONFIG.AUTH.USER_KEY);
        
        CONFIG.log('Auth data cleared', 'info');
    },
    
    /**
     * Verificar si el token ha expirado
     */
    isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            // Verificar con buffer de tiempo
            return payload.exp < (currentTime + CONFIG.AUTH.TOKEN_EXPIRY_BUFFER / 1000);
        } catch (error) {
            CONFIG.log('Error parsing token: ' + error.message, 'error');
            return true;
        }
    },
    
    /**
     * Iniciar sesión
     */
    async login(email, password) {
        try {
            const response = await API.post(CONFIG.API_ENDPOINTS.LOGIN, {
                username: email,
                password
            });
            
            if (response.access_token && response.user) {
                this.saveAuthData(response, response.user);
                
                // Actualizar estado global
                if (typeof GlobalState !== 'undefined') {
                    GlobalState.onLoginSuccess(response.user, response);
                }
                
                // Actualizar navbar después del login
                if (typeof NavbarComponent !== 'undefined') {
                    NavbarComponent.update();
                }
                
                return {
                    success: true,
                    user: response.user,
                    message: CONFIG.MESSAGES.LOGIN_SUCCESS
                };
            } else {
                throw new Error('Respuesta de login inválida');
            }
        } catch (error) {
            CONFIG.log('Login error: ' + error.message, 'error');
            return {
                success: false,
                message: error.message || CONFIG.MESSAGES.LOGIN_ERROR
            };
        }
    },
    
    /**
     * Registrar usuario
     */
    async register(userData) {
        try {
            const response = await API.post(CONFIG.API_ENDPOINTS.REGISTER, userData);
            
            if (response.success) {
                return {
                    success: true,
                    message: response.message || CONFIG.MESSAGES.REGISTER_SUCCESS
                };
            } else {
                throw new Error(response.message || 'Error en el registro');
            }
        } catch (error) {
            CONFIG.log('Register error: ' + error.message, 'error');
            return {
                success: false,
                message: error.message || CONFIG.MESSAGES.REGISTER_ERROR
            };
        }
    },
    
    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            // Intentar notificar al servidor (opcional)
            try {
                await API.post(CONFIG.API_ENDPOINTS.LOGOUT);
            } catch (error) {
                // No es crítico si falla
                CONFIG.log('Logout API call failed: ' + error.message, 'warn');
            }
            
            // Limpiar datos locales
            this.clearAuthData();
            
            // Actualizar estado global
            if (typeof GlobalState !== 'undefined') {
                GlobalState.onLogout();
            }
            
            // Actualizar navbar
            if (typeof NavbarComponent !== 'undefined') {
                NavbarComponent.update();
            }
            
            return {
                success: true,
                message: CONFIG.MESSAGES.LOGOUT_SUCCESS
            };
        } catch (error) {
            CONFIG.log('Logout error: ' + error.message, 'error');
            
            // Limpiar datos locales aunque falle la API
            this.clearAuthData();
            
            return {
                success: false,
                message: 'Error al cerrar sesión'
            };
        }
    },
    
    /**
     * Refrescar token
     */
    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        
        try {
            const response = await API.post(CONFIG.API_ENDPOINTS.REFRESH_TOKEN, {
                refresh_token: refreshToken
            });
            
            if (response.access_token) {
                // Actualizar solo el access token
                localStorage.setItem(CONFIG.AUTH.TOKEN_KEY, response.access_token);
                
                if (response.user) {
                    localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(response.user));
                }
                
                CONFIG.log('Token refreshed successfully', 'info');
                return response.access_token;
            } else {
                throw new Error('Invalid refresh response');
            }
        } catch (error) {
            CONFIG.log('Token refresh failed: ' + error.message, 'error');
            
            // Si falla el refresh, cerrar sesión
            this.clearAuthData();
            
            throw error;
        }
    },
    
    /**
     * Obtener token válido (refrescar si es necesario)
     */
    async getValidToken() {
        const token = this.getToken();
        
        if (!token) {
            return null;
        }
        
        // Si el token está por expirar, intentar refrescarlo
        if (this.isTokenExpired(token)) {
            try {
                return await this.refreshToken();
            } catch (error) {
                return null;
            }
        }
        
        return token;
    },
    
    /**
     * Verificar autenticación automáticamente
     */
    async checkAuth() {
        const token = await this.getValidToken();
        
        if (!token) {
            this.clearAuthData();
            return false;
        }
        
        return true;
    },
    
    /**
     * Obtener headers de autenticación
     */
    async getAuthHeaders() {
        const token = await this.getValidToken();
        
        if (!token) {
            return {};
        }
        
        return {
            'Authorization': `Bearer ${token}`
        };
    },
    
    /**
     * Inicializar sistema de autenticación
     */
    init() {
        // Verificar autenticación al cargar la página
        this.checkAuth().then(isAuthenticated => {
            CONFIG.log(`Auth status: ${isAuthenticated ? 'authenticated' : 'not authenticated'}`, 'info');
            
            // Actualizar navbar si está disponible
            if (typeof NavbarComponent !== 'undefined') {
                NavbarComponent.update();
            }
        });
        
        // Configurar verificación periódica de token
        this.setupTokenRefresh();
    },
    
    /**
     * Configurar refrescado automático de token
     */
    setupTokenRefresh() {
        // Verificar token cada 5 minutos
        setInterval(() => {
            if (this.isAuthenticated()) {
                this.checkAuth();
            }
        }, 5 * 60 * 1000);
    }
};

// Inicializar autenticación cuando se carga el script
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// Exportar para uso global
window.Auth = Auth;