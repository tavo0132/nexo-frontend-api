// ===================================
// NEXO FRONTEND - APLICACIÓN PRINCIPAL
// ===================================

class NexoApp {
    constructor() {
        this.isInitialized = false;
        this.components = {};
        
        // Bind methods
        this.init = this.init.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleNetworkStatus = this.handleNetworkStatus.bind(this);
    }
    
    /**
     * Inicializar aplicación
     */
    async init() {
        if (this.isInitialized) {
            CONFIG.log('App already initialized', 'warn');
            return;
        }
        
        try {
            CONFIG.log('Initializing Nexo App...', 'info');
            
            // Verificar dependencias críticas
            this.checkDependencies();
            
            // Configurar manejo de errores globales
            this.setupGlobalErrorHandling();
            
            // Configurar eventos de red
            this.setupNetworkHandling();
            
            // Inicializar componentes principales
            await this.initializeComponents();
            
            // Configurar eventos de la aplicación
            this.setupAppEvents();
            
            // Marcar como inicializado
            this.isInitialized = true;
            
            CONFIG.log('Nexo App initialized successfully!', 'info');
            
            // Mostrar información de bienvenida en consola
            this.showWelcomeMessage();
            
        } catch (error) {
            CONFIG.log('Failed to initialize app: ' + error.message, 'error');
            this.showCriticalError(error);
        }
    }
    
    /**
     * Verificar dependencias críticas
     */
    checkDependencies() {
        const requiredGlobals = [
            'CONFIG', 
            'Auth', 
            'API', 
            'Router', 
            'NavbarComponent', 
            'FooterComponent'
        ];
        
        const missing = requiredGlobals.filter(dep => typeof window[dep] === 'undefined');
        
        if (missing.length > 0) {
            throw new Error(`Missing required dependencies: ${missing.join(', ')}`);
        }
        
        // Verificar Bootstrap
        if (typeof bootstrap === 'undefined') {
            throw new Error('Bootstrap is required but not loaded');
        }
        
        CONFIG.log('All dependencies verified', 'info');
    }
    
    /**
     * Inicializar componentes principales
     */
    async initializeComponents() {
        // Verificar que los contenedores existan
        const requiredContainers = [
            'navbar-container',
            'main-content',
            'footer-container'
        ];
        
        const missingContainers = requiredContainers.filter(id => 
            !document.getElementById(id)
        );
        
        if (missingContainers.length > 0) {
            throw new Error(`Missing required containers: ${missingContainers.join(', ')}`);
        }
        
        // Los componentes ya se inicializan automáticamente
        // Solo necesitamos verificar que estén funcionando
        
        CONFIG.log('Components initialized', 'info');
    }
    
    /**
     * Configurar manejo de errores globales
     */
    setupGlobalErrorHandling() {
        // Errores JavaScript no capturados
        window.addEventListener('error', this.handleError);
        
        // Promesas rechazadas no capturadas
        window.addEventListener('unhandledrejection', (event) => {
            CONFIG.log('Unhandled promise rejection: ' + event.reason, 'error');
            this.handleError(event);
        });
        
        CONFIG.log('Global error handling setup', 'info');
    }
    
    /**
     * Configurar manejo de estado de red
     */
    setupNetworkHandling() {
        window.addEventListener('online', this.handleNetworkStatus);
        window.addEventListener('offline', this.handleNetworkStatus);
        
        CONFIG.log('Network status handling setup', 'info');
    }
    
    /**
     * Configurar eventos de la aplicación
     */
    setupAppEvents() {
        // Evento antes de cerrar/recargar la página
        window.addEventListener('beforeunload', (event) => {
            // Aquí podríamos guardar datos pendientes, etc.
            CONFIG.log('App is being unloaded', 'info');
        });
        
        // Eventos de visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                CONFIG.log('App became visible', 'info');
                this.onAppVisible();
            } else {
                CONFIG.log('App became hidden', 'info');
                this.onAppHidden();
            }
        });
        
        CONFIG.log('App events setup', 'info');
    }
    
    /**
     * Manejar errores globales
     */
    handleError(error) {
        const errorInfo = {
            message: error.message || error.reason || 'Unknown error',
            filename: error.filename || 'Unknown file',
            lineno: error.lineno || 0,
            colno: error.colno || 0,
            stack: error.error?.stack || error.stack || 'No stack trace',
            timestamp: new Date().toISOString()
        };
        
        CONFIG.log(`Global error: ${errorInfo.message}`, 'error');
        
        // En un entorno de producción, aquí enviaríamos el error a un servicio de logging
        if (!CONFIG.DEBUG) {
            // this.sendErrorToLoggingService(errorInfo);
        }
        
        // Mostrar notificación al usuario solo para errores críticos
        if (this.isCriticalError(error)) {
            this.showUserErrorNotification();
        }
    }
    
    /**
     * Manejar cambios de estado de red
     */
    handleNetworkStatus() {
        if (navigator.onLine) {
            CONFIG.log('Network connection restored', 'info');
            this.showNetworkNotification('Conexión restaurada', 'success');
            
            // Revalidar autenticación si estaba autenticado
            if (Auth.isAuthenticated()) {
                Auth.checkAuth();
            }
        } else {
            CONFIG.log('Network connection lost', 'warn');
            this.showNetworkNotification('Sin conexión a internet', 'warning');
        }
    }
    
    /**
     * Cuando la app se vuelve visible
     */
    onAppVisible() {
        // Revalidar autenticación si está autenticada
        if (Auth.isAuthenticated()) {
            Auth.checkAuth();
        }
        
        // Refrescar datos si es necesario
        // this.refreshDataIfNeeded();
    }
    
    /**
     * Cuando la app se oculta
     */
    onAppHidden() {
        // Limpiar recursos temporales
        // this.cleanupResources();
    }
    
    /**
     * Verificar si es un error crítico
     */
    isCriticalError(error) {
        const criticalPatterns = [
            /ChunkLoadError/,
            /Loading chunk/,
            /Script error/,
            /Network Error/
        ];
        
        const message = error.message || error.reason || '';
        return criticalPatterns.some(pattern => pattern.test(message));
    }
    
    /**
     * Mostrar error crítico al usuario
     */
    showCriticalError(error) {
        const errorContainer = document.createElement('div');
        errorContainer.innerHTML = `
            <div class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                 style="background: rgba(0,0,0,0.8); z-index: 9999;">
                <div class="card shadow-lg" style="max-width: 500px;">
                    <div class="card-header bg-danger text-white text-center">
                        <h5 class="mb-0">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Error Crítico
                        </h5>
                    </div>
                    <div class="card-body text-center">
                        <p class="mb-3">Ha ocurrido un error inesperado que impide el funcionamiento de la aplicación.</p>
                        <p class="text-muted small mb-4">${error.message}</p>
                        <button class="btn btn-primary me-2" onclick="window.location.reload()">
                            <i class="fas fa-redo me-1"></i>
                            Recargar Página
                        </button>
                        <a href="/" class="btn btn-secondary">
                            <i class="fas fa-home me-1"></i>
                            Ir al Inicio
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorContainer);
    }
    
    /**
     * Mostrar notificación de error al usuario
     */
    showUserErrorNotification() {
        this.showNotification(
            'Ha ocurrido un error inesperado. Si el problema persiste, recarga la página.',
            'error'
        );
    }
    
    /**
     * Mostrar notificación de red
     */
    showNetworkNotification(message, type) {
        this.showNotification(message, type);
    }
    
    /**
     * Mostrar notificación genérica
     */
    showNotification(message, type = 'info') {
        // Crear contenedor de notificaciones si no existe
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.className = 'position-fixed top-0 end-0 p-3';
            notificationContainer.style.zIndex = '9999';
            document.body.appendChild(notificationContainer);
        }
        
        const notificationId = 'notification-' + Date.now();
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type] || 'alert-info';
        
        const icon = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        }[type] || 'info-circle';
        
        const notificationHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" id="${notificationId}" role="alert">
                <i class="fas fa-${icon} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        notificationContainer.insertAdjacentHTML('beforeend', notificationHTML);
        
        // Auto-remove después de 5 segundos
        setTimeout(() => {
            const notification = document.getElementById(notificationId);
            if (notification) {
                const alert = new bootstrap.Alert(notification);
                alert.close();
            }
        }, 5000);
    }
    
    /**
     * Mostrar mensaje de bienvenida
     */
    showWelcomeMessage() {
        const styles = [
            'color: #3498db',
            'font-size: 18px',
            'font-weight: bold',
            'text-shadow: 2px 2px 4px rgba(0,0,0,0.3)'
        ].join(';');
        
        console.log('%c🚀 Nexo Frontend v' + CONFIG.APP_VERSION, styles);
        console.log('¡Bienvenido a Nexo! La aplicación se ha cargado correctamente.');
        console.log('Escribe "nexo" en la consola para ver información del desarrollador.');
        
        if (CONFIG.DEBUG) {
            console.log('🔧 Modo de desarrollo activado');
            console.log('API Base URL:', CONFIG.API_BASE_URL);
        }
    }
    
    /**
     * Obtener información de la aplicación
     */
    getAppInfo() {
        return {
            name: CONFIG.APP_NAME,
            version: CONFIG.APP_VERSION,
            initialized: this.isInitialized,
            authenticated: Auth.isAuthenticated(),
            currentRoute: Router.getCurrentRoute()?.path || '/',
            apiUrl: CONFIG.API_BASE_URL,
            debug: CONFIG.DEBUG
        };
    }
    
    /**
     * Reinicializar aplicación
     */
    async reinitialize() {
        CONFIG.log('Reinitializing app...', 'info');
        this.isInitialized = false;
        await this.init();
    }
}

// ===================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ===================================

// Crear instancia global de la aplicación
const app = new NexoApp();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    CONFIG.log('DOM loaded, initializing app...', 'info');
    await app.init();
});

// Exportar para uso global
window.NexoApp = app;

// Utilidades globales para debugging
window.getAppInfo = () => app.getAppInfo();
window.reinitializeApp = () => app.reinitialize();