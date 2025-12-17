// ===================================
// NEXO FRONTEND - UTILIDADES
// ===================================

const Utils = {
    /**
     * Mostrar toast notification
     */
    showToast(message, type = 'info', duration = 5000) {
        // Crear contenedor de toasts si no existe
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }
        
        const toastId = 'toast-' + Date.now();
        const bgClass = {
            'success': 'bg-success',
            'error': 'bg-danger',
            'warning': 'bg-warning',
            'info': 'bg-info'
        }[type] || 'bg-info';
        
        const icon = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        }[type] || 'info-circle';
        
        const toastHTML = `
            <div class="toast ${bgClass} text-white" id="${toastId}" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${icon} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                            data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: duration });
        toast.show();
        
        // Remover el elemento después de que se oculte
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
        
        return toast;
    },
    
    /**
     * Mostrar confirmación modal
     */
    showConfirm(message, title = 'Confirmar', confirmText = 'Confirmar', cancelText = 'Cancelar') {
        return new Promise((resolve) => {
            // Crear modal si no existe
            let confirmModal = document.getElementById('utils-confirm-modal');
            if (!confirmModal) {
                const modalHTML = `
                    <div class="modal fade" id="utils-confirm-modal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="utils-confirm-title">Confirmar</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body" id="utils-confirm-body">
                                    <!-- Contenido dinámico -->
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="utils-cancel-btn">
                                        Cancelar
                                    </button>
                                    <button type="button" class="btn btn-primary" id="utils-confirm-btn">
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                confirmModal = document.getElementById('utils-confirm-modal');
            }
            
            // Actualizar contenido
            document.getElementById('utils-confirm-title').textContent = title;
            document.getElementById('utils-confirm-body').innerHTML = message;
            document.getElementById('utils-confirm-btn').textContent = confirmText;
            document.getElementById('utils-cancel-btn').textContent = cancelText;
            
            // Configurar eventos
            const confirmBtn = document.getElementById('utils-confirm-btn');
            const cancelBtn = document.getElementById('utils-cancel-btn');
            
            const handleConfirm = () => {
                resolve(true);
                modal.hide();
                cleanup();
            };
            
            const handleCancel = () => {
                resolve(false);
                cleanup();
            };
            
            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
                confirmModal.removeEventListener('hidden.bs.modal', handleCancel);
            };
            
            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
            confirmModal.addEventListener('hidden.bs.modal', handleCancel);
            
            // Mostrar modal
            const modal = new bootstrap.Modal(confirmModal);
            modal.show();
        });
    },
    
    /**
     * Validar email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * Formatear fecha
     */
    formatDate(date, locale = 'es-ES') {
        if (!date) return '';
        
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    /**
     * Formatear fecha y hora
     */
    formatDateTime(date, locale = 'es-ES') {
        if (!date) return '';
        
        const dateObj = new Date(date);
        return dateObj.toLocaleString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Calcular tiempo relativo (hace X tiempo)
     */
    timeAgo(date, locale = 'es-ES') {
        if (!date) return '';
        
        const now = new Date();
        const dateObj = new Date(date);
        const diffInSeconds = Math.floor((now - dateObj) / 1000);
        
        if (diffInSeconds < 60) {
            return 'hace unos segundos';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `hace ${days} día${days > 1 ? 's' : ''}`;
        } else {
            return this.formatDate(date, locale);
        }
    },
    
    /**
     * Truncar texto
     */
    truncateText(text, maxLength = 100, suffix = '...') {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + suffix;
    },
    
    /**
     * Escapar HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * Generar ID único
     */
    generateUniqueId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    /**
     * Debounce function
     */
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Copiar texto al portapapeles
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Texto copiado al portapapeles', 'success', 2000);
            return true;
        } catch (error) {
            // Fallback para navegadores más antiguos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showToast('Texto copiado al portapapeles', 'success', 2000);
                return true;
            } catch (fallbackError) {
                this.showToast('No se pudo copiar el texto', 'error');
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    },
    
    /**
     * Detectar si es dispositivo móvil
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    /**
     * Detectar si es modo oscuro preferido
     */
    isDarkModePreferred() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    
    /**
     * Validar tamaño de archivo
     */
    validateFileSize(file, maxSizeInBytes) {
        return file.size <= maxSizeInBytes;
    },
    
    /**
     * Validar tipo de archivo
     */
    validateFileType(file, allowedTypes) {
        return allowedTypes.includes(file.type);
    },
    
    /**
     * Convertir bytes a formato legible
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
};

// Exportar para uso global
window.Utils = Utils;