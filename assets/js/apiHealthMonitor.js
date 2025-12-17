// ===================================
// NEXO FRONTEND - API HEALTH MONITOR
// ===================================

/**
 * Monitor de salud de la API
 * Verifica periódicamente la conexión con el backend
 */
const APIHealthMonitor = {
    // Estado del monitor
    isRunning: false,
    intervalId: null,
    lastStatus: 'unknown',
    checkInterval: 30000, // 30 segundos
    
    /**
     * Iniciar el monitor
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        // Verificación inicial
        this.checkHealth();
        
        // Verificación periódica
        this.intervalId = setInterval(() => {
            this.checkHealth();
        }, this.checkInterval);
        
        CONFIG.log('API Health Monitor started', 'info');
    },
    
    /**
     * Detener el monitor
     */
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        CONFIG.log('API Health Monitor stopped', 'info');
    },
    
    /**
     * Verificar salud de la API
     */
    async checkHealth() {
        try {
            const startTime = Date.now();
            const response = await fetch(CONFIG.API_BASE_URL + CONFIG.API_ENDPOINTS.HEALTH, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000 // 5 segundos timeout
            });
            
            const responseTime = Date.now() - startTime;
            
            if (response.ok) {
                const data = await response.json();
                this.updateStatus('healthy', {
                    responseTime,
                    timestamp: new Date().toISOString(),
                    data: data
                });
            } else {
                this.updateStatus('unhealthy', {
                    status: response.status,
                    statusText: response.statusText,
                    responseTime,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            this.updateStatus('error', {
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },
    
    /**
     * Actualizar estado de la API
     */
    updateStatus(status, details) {
        const prevStatus = this.lastStatus;
        this.lastStatus = status;
        
        // Actualizar estado global si cambió
        if (prevStatus !== status) {
            if (typeof GlobalState !== 'undefined') {
                const connectionStatus = status === 'healthy' ? 'online' : 'offline';
                GlobalState.setState({ connectionStatus });
            }
            
            // Notificar cambio de estado
            this.notifyStatusChange(status, details);
        }
        
        // Actualizar footer con información de la API
        this.updateFooterStatus(status, details);
    },
    
    /**
     * Notificar cambio de estado
     */
    notifyStatusChange(status, details) {
        if (typeof StatusIndicators === 'undefined') return;
        
        switch (status) {
            case 'healthy':
                if (this.lastStatus === 'error' || this.lastStatus === 'unhealthy') {
                    StatusIndicators.showSuccess('Conexión restablecida con el servidor', 'Conectado');
                }
                break;
            case 'unhealthy':
                StatusIndicators.showWarning(
                    `Servidor respondió con estado ${details.status}: ${details.statusText}`, 
                    'Problema de Conexión'
                );
                break;
            case 'error':
                StatusIndicators.showError(
                    `No se puede conectar al servidor: ${details.error}`, 
                    'Sin Conexión'
                );
                break;
        }
    },
    
    /**
     * Actualizar estado en el footer
     */
    updateFooterStatus(status, details) {
        const statusElement = document.getElementById('api-status');
        if (!statusElement) return;
        
        let className, icon, text;
        
        switch (status) {
            case 'healthy':
                className = 'text-success';
                icon = 'fas fa-circle';
                text = `API Online (${details.responseTime}ms)`;
                break;
            case 'unhealthy':
                className = 'text-warning';
                icon = 'fas fa-exclamation-circle';
                text = `API Issues (${details.status})`;
                break;
            case 'error':
                className = 'text-danger';
                icon = 'fas fa-times-circle';
                text = 'API Offline';
                break;
            default:
                className = 'text-muted';
                icon = 'fas fa-question-circle';
                text = 'Checking...';
        }
        
        statusElement.className = className;
        statusElement.innerHTML = `<i class="${icon} me-1"></i>${text}`;
        statusElement.title = `Último check: ${new Date().toLocaleTimeString()}`;
    },
    
    /**
     * Obtener estado actual
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            lastStatus: this.lastStatus,
            checkInterval: this.checkInterval
        };
    },
    
    /**
     * Configurar intervalo de verificación
     */
    setCheckInterval(interval) {
        this.checkInterval = interval;
        
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }
};

// Auto-iniciar el monitor cuando se carga la página
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Esperar un poco para que otros componentes se inicializen
        setTimeout(() => {
            APIHealthMonitor.start();
        }, 1000);
    });
    
    // Detener el monitor cuando se cierra la página
    window.addEventListener('beforeunload', () => {
        APIHealthMonitor.stop();
    });
}