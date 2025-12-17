// ===================================
// NEXO FRONTEND - ESTADO GLOBAL
// ===================================

/**
 * Gestor de estado global de la aplicación
 * Maneja el estado de autenticación y datos del usuario
 */
const GlobalState = {
    // Estado inicial
    state: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastActivity: null,
        connectionStatus: 'online'
    },
    
    // Listeners para cambios de estado
    listeners: new Set(),
    
    /**
     * Inicializar el estado global
     */
    init() {
        // Cargar estado desde localStorage si existe
        this.loadPersistedState();
        
        // Configurar listeners
        this.setupEventListeners();
        
        // Verificar conexión inicial
        this.checkConnection();
        
        CONFIG.log('Global state initialized', 'info');
    },
    
    /**
     * Cargar estado persistido
     */
    loadPersistedState() {
        try {
            if (Auth.isAuthenticated()) {
                const user = Auth.getCurrentUser();
                if (user) {
                    this.setState({
                        user: user,
                        isAuthenticated: true,
                        lastActivity: Date.now()
                    });
                }
            }
        } catch (error) {
            CONFIG.log('Error loading persisted state: ' + error.message, 'error');
            this.clearState();
        }
    },
    
    /**
     * Configurar listeners de eventos
     */
    setupEventListeners() {
        // Detectar cambios de conexión
        window.addEventListener('online', () => {
            this.setState({ connectionStatus: 'online' });
            this.notifyListeners('connection', { status: 'online' });
        });
        
        window.addEventListener('offline', () => {
            this.setState({ connectionStatus: 'offline' });
            this.notifyListeners('connection', { status: 'offline' });
        });
        
        // Detectar actividad del usuario
        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
            document.addEventListener(event, () => {
                this.updateLastActivity();
            }, true);
        });
        
        // Verificar tokens periódicamente
        setInterval(() => {
            this.checkTokenValidity();
        }, CONFIG.AUTH.TOKEN_CHECK_INTERVAL || 30000); // 30 segundos
    },
    
    /**
     * Actualizar estado
     */
    setState(newState) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...newState };
        
        // Notificar cambios
        this.notifyListeners('stateChange', {
            prevState,
            newState: this.state
        });
        
        CONFIG.log('State updated', 'debug', { newState: this.state });
    },
    
    /**
     * Obtener estado actual
     */
    getState() {
        return { ...this.state };
    },
    
    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        return this.state.user;
    },
    
    /**
     * Verificar si está autenticado
     */
    isAuthenticated() {
        return this.state.isAuthenticated && Auth.isAuthenticated();
    },
    
    /**
     * Actualizar datos del usuario
     */
    updateUser(userData) {
        const updatedUser = { ...this.state.user, ...userData };
        this.setState({ user: updatedUser });
        
        // Persistir en localStorage
        localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(updatedUser));
        
        this.notifyListeners('userUpdated', updatedUser);
    },
    
    /**
     * Login exitoso - actualizar estado
     */
    onLoginSuccess(user, tokens) {
        this.setState({
            user: user,
            isAuthenticated: true,
            lastActivity: Date.now()
        });
        
        this.notifyListeners('login', user);
        CONFIG.log('Login state updated', 'info');
    },
    
    /**
     * Logout - limpiar estado
     */
    onLogout() {
        this.clearState();
        this.notifyListeners('logout');
        CONFIG.log('Logout state cleared', 'info');
    },
    
    /**
     * Limpiar todo el estado
     */
    clearState() {
        this.setState({
            user: null,
            isAuthenticated: false,
            lastActivity: null
        });
    },
    
    /**
     * Actualizar última actividad
     */
    updateLastActivity() {
        if (this.state.isAuthenticated) {
            this.setState({ lastActivity: Date.now() });
        }
    },
    
    /**
     * Verificar validez del token
     */
    async checkTokenValidity() {
        if (this.state.isAuthenticated) {
            if (!Auth.isAuthenticated()) {
                // Token expirado
                CONFIG.log('Token expired, logging out', 'warn');
                await this.forceLogout();
            }
        }
    },
    
    /**
     * Forzar logout por token expirado
     */
    async forceLogout() {
        await Auth.logout();
        this.onLogout();
        
        // Redirigir a login
        if (typeof Router !== 'undefined') {
            Router.navigate('/login?expired=true');
        }
    },
    
    /**
     * Verificar conexión a internet
     */
    async checkConnection() {
        try {
            const response = await fetch(CONFIG.API_BASE_URL + CONFIG.API_ENDPOINTS.HEALTH, {
                method: 'GET',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                this.setState({ connectionStatus: 'online' });
            } else {
                this.setState({ connectionStatus: 'offline' });
            }
        } catch (error) {
            this.setState({ connectionStatus: 'offline' });
        }
    },
    
    /**
     * Agregar listener para cambios de estado
     */
    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    },
    
    /**
     * Remover listener
     */
    removeListener(callback) {
        return this.listeners.delete(callback);
    },
    
    /**
     * Notificar a todos los listeners
     */
    notifyListeners(type, data) {
        this.listeners.forEach(callback => {
            try {
                callback(type, data);
            } catch (error) {
                CONFIG.log('Listener error: ' + error.message, 'error');
            }
        });
    },
    
    /**
     * Obtener estadísticas de la sesión
     */
    getSessionStats() {
        if (!this.state.isAuthenticated) return null;
        
        const now = Date.now();
        const sessionDuration = this.state.lastActivity 
            ? (now - this.state.lastActivity) / 1000 / 60 // minutos
            : 0;
            
        return {
            user: this.state.user,
            sessionDuration: Math.floor(sessionDuration),
            lastActivity: new Date(this.state.lastActivity),
            connectionStatus: this.state.connectionStatus,
            isTokenValid: Auth.isAuthenticated()
        };
    }
};

// Inicializar estado global cuando se carga el script
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        GlobalState.init();
    });
}