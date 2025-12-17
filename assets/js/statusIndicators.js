// ===================================
// NEXO FRONTEND - STATUS INDICATORS
// ===================================

/**
 * Componente para mostrar indicadores de estado
 * Conexión, autenticación, carga, etc.
 */
const StatusIndicators = {
    /**
     * Inicializar indicadores de estado
     */
    init() {
        this.setupConnectionIndicator();
        this.setupGlobalStateListeners();
        CONFIG.log('Status indicators initialized', 'info');
    },
    
    /**
     * Configurar indicador de conexión
     */
    setupConnectionIndicator() {
        // Crear contenedor si no existe
        if (!document.getElementById('status-indicators')) {
            const container = document.createElement('div');
            container.id = 'status-indicators';
            container.className = 'position-fixed top-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
    },
    
    /**
     * Configurar listeners del estado global
     */
    setupGlobalStateListeners() {
        if (typeof GlobalState !== 'undefined') {
            GlobalState.addListener((type, data) => {
                switch (type) {
                    case 'connection':
                        this.updateConnectionStatus(data.status);
                        break;
                    case 'login':
                        this.showLoginSuccess(data);
                        break;
                    case 'logout':
                        this.showLogoutMessage();
                        break;
                }
            });
        }
    },
    
    /**
     * Actualizar estado de conexión
     */
    updateConnectionStatus(status) {
        const indicator = this.getOrCreateIndicator('connection');
        
        if (status === 'online') {
            indicator.className = 'badge bg-success';
            indicator.innerHTML = '<i class="fas fa-wifi me-1"></i>Online';
        } else {
            indicator.className = 'badge bg-danger';
            indicator.innerHTML = '<i class="fas fa-wifi me-1"></i>Offline';
        }
        
        // Auto-hide después de 3 segundos si está online
        if (status === 'online') {
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 3000);
        } else {
            indicator.style.display = 'block';
        }
    },
    
    /**
     * Mostrar éxito de login
     */
    showLoginSuccess(user) {
        const toast = this.createToast('success', 
            `¡Bienvenido, ${user.first_name}!`, 
            'Login exitoso'
        );
        this.showToast(toast);
    },
    
    /**
     * Mostrar mensaje de logout
     */
    showLogoutMessage() {
        const toast = this.createToast('info', 
            'Sesión cerrada correctamente', 
            'Logout'
        );
        this.showToast(toast);
    },
    
    /**
     * Mostrar indicador de carga
     */
    showLoading(message = 'Cargando...') {
        const indicator = this.getOrCreateIndicator('loading');
        indicator.className = 'badge bg-primary';
        indicator.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i>${message}`;
        indicator.style.display = 'block';
    },
    
    /**
     * Ocultar indicador de carga
     */
    hideLoading() {
        const indicator = document.getElementById('indicator-loading');
        if (indicator) {
            indicator.style.display = 'none';
        }
    },
    
    /**
     * Obtener o crear indicador
     */
    getOrCreateIndicator(type) {
        const id = `indicator-${type}`;
        let indicator = document.getElementById(id);
        
        if (!indicator) {
            const container = document.getElementById('status-indicators');
            indicator = document.createElement('span');
            indicator.id = id;
            indicator.className = 'badge me-2 mb-2';
            indicator.style.display = 'none';
            container.appendChild(indicator);
        }
        
        return indicator;
    },
    
    /**
     * Crear toast notification
     */
    createToast(type, message, title = '') {
        const toastId = 'toast-' + Date.now();
        const bgClass = {
            'success': 'bg-success',
            'error': 'bg-danger', 
            'warning': 'bg-warning',
            'info': 'bg-info'
        }[type] || 'bg-primary';
        
        return `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${bgClass} text-white">
                    <i class="fas fa-circle me-2"></i>
                    <strong class="me-auto">${title}</strong>
                    <small class="text-white-50">${new Date().toLocaleTimeString()}</small>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
    },
    
    /**
     * Mostrar toast
     */
    showToast(toastHtml) {
        // Crear contenedor de toasts si no existe
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '10000';
            document.body.appendChild(container);
        }
        
        // Agregar toast
        container.insertAdjacentHTML('beforeend', toastHtml);
        
        // Activar Bootstrap toast
        const toastElement = container.lastElementChild;
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 4000
        });
        toast.show();
        
        // Remover del DOM después de ocultarse
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    },
    
    /**
     * Mostrar mensaje de error
     */
    showError(message, title = 'Error') {
        const toast = this.createToast('error', message, title);
        this.showToast(toast);
    },
    
    /**
     * Mostrar mensaje de éxito
     */
    showSuccess(message, title = 'Éxito') {
        const toast = this.createToast('success', message, title);
        this.showToast(toast);
    },
    
    /**
     * Mostrar advertencia
     */
    showWarning(message, title = 'Advertencia') {
        const toast = this.createToast('warning', message, title);
        this.showToast(toast);
    },
    
    /**
     * Mostrar información
     */
    showInfo(message, title = 'Información') {
        const toast = this.createToast('info', message, title);
        this.showToast(toast);
    }
};

// Inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        StatusIndicators.init();
    });
}