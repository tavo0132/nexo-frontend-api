// ===================================
// NEXO FRONTEND - FOOTER COMPONENT
// ===================================

const FooterComponent = {
    /**
     * Renderizar footer
     */
    render() {
        return `
            <footer class="bg-nexo-gradient text-white py-4 mt-5">
                <div class="container">
                    <div class="row">
                        <!-- Información de la aplicación -->
                        <div class="col-md-4 mb-3">
                            <h5 class="fw-bold mb-3">
                                <i class="fas fa-network-wired me-2"></i>
                                ${CONFIG.APP_NAME}
                            </h5>
                            <p class="text-light">${CONFIG.APP_DESCRIPTION}</p>
                            <p class="small text-light">
                                <strong>Versión:</strong> ${CONFIG.APP_VERSION}
                            </p>
                        </div>
                        
                        <!-- Enlaces rápidos -->
                        <div class="col-md-4 mb-3">
                            <h6 class="fw-bold mb-3">Enlaces Rápidos</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2">
                                    <a href="/" class="text-light text-decoration-none" data-route="/">
                                        <i class="fas fa-home me-1"></i>
                                        Inicio
                                    </a>
                                </li>
                                <li class="mb-2">
                                    <a href="/about" class="text-light text-decoration-none" data-route="/about">
                                        <i class="fas fa-info-circle me-1"></i>
                                        Acerca de
                                    </a>
                                </li>
                                <li class="mb-2">
                                    <a href="/contact" class="text-light text-decoration-none" data-route="/contact">
                                        <i class="fas fa-envelope me-1"></i>
                                        Contacto
                                    </a>
                                </li>
                                ${this.renderAuthLinks()}
                            </ul>
                        </div>
                        
                        <!-- Información de contacto y redes -->
                        <div class="col-md-4 mb-3">
                            <h6 class="fw-bold mb-3">Conecta con nosotros</h6>
                            <div class="mb-3">
                                <a href="#" class="text-light text-decoration-none me-3" title="Facebook">
                                    <i class="fab fa-facebook fa-lg"></i>
                                </a>
                                <a href="#" class="text-light text-decoration-none me-3" title="Twitter">
                                    <i class="fab fa-twitter fa-lg"></i>
                                </a>
                                <a href="#" class="text-light text-decoration-none me-3" title="Instagram">
                                    <i class="fab fa-instagram fa-lg"></i>
                                </a>
                                <a href="#" class="text-light text-decoration-none" title="LinkedIn">
                                    <i class="fab fa-linkedin fa-lg"></i>
                                </a>
                            </div>
                            
                            <!-- Estado de la API -->
                            <div class="small">
                                <div class="d-flex align-items-center mb-1">
                                    <span class="me-2">Estado de la API:</span>
                                    <span id="api-status" class="badge bg-secondary">Verificando...</span>
                                </div>
                                <div id="api-status-text" class="text-light opacity-75"></div>
                            </div>
                        </div>
                    </div>
                    
                    <hr class="border-light opacity-25">
                    
                    <!-- Copyright -->
                    <div class="row">
                        <div class="col-md-6">
                            <p class="small mb-0 text-light opacity-75">
                                &copy; ${new Date().getFullYear()} ${CONFIG.APP_NAME}. 
                                Todos los derechos reservados.
                            </p>
                        </div>
                        <div class="col-md-6 text-md-end">
                            <p class="small mb-0 text-light opacity-75">
                                Desarrollado con 
                                <i class="fas fa-heart text-danger"></i> 
                                para conectar personas
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    },
    
    /**
     * Renderizar enlaces de autenticación según estado
     */
    renderAuthLinks() {
        const isAuthenticated = Auth.isAuthenticated();
        
        if (isAuthenticated) {
            return `
                <li class="mb-2">
                    <a href="/profile" class="text-light text-decoration-none" data-route="/profile">
                        <i class="fas fa-user me-1"></i>
                        Mi Perfil
                    </a>
                </li>
                <li class="mb-2">
                    <a href="/friends" class="text-light text-decoration-none" data-route="/friends">
                        <i class="fas fa-users me-1"></i>
                        Mis Amigos
                    </a>
                </li>
            `;
        } else {
            return `
                <li class="mb-2">
                    <a href="/login" class="text-light text-decoration-none" data-route="/login">
                        <i class="fas fa-sign-in-alt me-1"></i>
                        Iniciar Sesión
                    </a>
                </li>
                <li class="mb-2">
                    <a href="/register" class="text-light text-decoration-none" data-route="/register">
                        <i class="fas fa-user-plus me-1"></i>
                        Registrarse
                    </a>
                </li>
            `;
        }
    },
    
    /**
     * Inicializar footer
     */
    init() {
        this.checkApiStatus();
        this.attachEventListeners();
    },
    
    /**
     * Verificar estado de la API
     */
    async checkApiStatus() {
        const statusElement = document.getElementById('api-status');
        const statusTextElement = document.getElementById('api-status-text');
        
        if (!statusElement || !statusTextElement) return;
        
        try {
            statusElement.textContent = 'Verificando...';
            statusElement.className = 'badge bg-warning';
            statusTextElement.textContent = '';
            
            const response = await API.get(CONFIG.API_ENDPOINTS.HEALTH);
            
            if (response.status === 'ok') {
                statusElement.textContent = 'Online';
                statusElement.className = 'badge bg-success';
                statusTextElement.textContent = `Última verificación: ${new Date().toLocaleTimeString()}`;
            } else {
                throw new Error('API response not ok');
            }
        } catch (error) {
            statusElement.textContent = 'Offline';
            statusElement.className = 'badge bg-danger';
            statusTextElement.textContent = 'Error de conexión con el servidor';
            CONFIG.log(`API status check failed: ${error.message}`, 'error');
        }
    },
    
    /**
     * Adjuntar event listeners
     */
    attachEventListeners() {
        // Los enlaces ya son manejados por el router
        // Aquí podemos agregar listeners adicionales si es necesario
        
        // Agregar efecto hover a los iconos de redes sociales
        const socialLinks = document.querySelectorAll('footer .fab');
        socialLinks.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.2s ease';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
            });
        });
    },
    
    /**
     * Actualizar footer
     */
    update() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = this.render();
            this.init();
        }
    },
    
    /**
     * Actualizar estado de la API periódicamente
     */
    startStatusMonitoring() {
        // Verificar estado cada 5 minutos
        setInterval(() => {
            this.checkApiStatus();
        }, 5 * 60 * 1000);
    },
    
    /**
     * Mostrar información del desarrollador (Easter egg)
     */
    showDeveloperInfo() {
        const info = {
            app: CONFIG.APP_NAME,
            version: CONFIG.APP_VERSION,
            developer: 'Nexo Development Team',
            technologies: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript ES6+', 'Python Flask'],
            apiUrl: CONFIG.API_BASE_URL
        };
        
        console.group('🚀 Nexo Frontend Info');
        console.table(info);
        console.log('🔧 ¿Interesado en el desarrollo? ¡Contáctanos!');
        console.groupEnd();
    }
};

// Auto-renderizar footer al cargar el script
document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = FooterComponent.render();
        FooterComponent.init();
        FooterComponent.startStatusMonitoring();
    }
    
    // Easter egg: mostrar info del desarrollador si escriben 'nexo' en la consola
    window.nexo = FooterComponent.showDeveloperInfo;
});

// Exportar para uso global
window.FooterComponent = FooterComponent;