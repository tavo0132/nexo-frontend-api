// ===================================
// NEXO FRONTEND - NAVBAR COMPONENT
// ===================================

const NavbarComponent = {
    /**
     * Renderizar navbar
     */
    render() {
        const isAuthenticated = Auth.isAuthenticated();
        const user = Auth.getCurrentUser();
        
        return `
            <nav class="navbar navbar-expand-lg navbar-nexo">
                <div class="container">
                    <!-- Brand -->
                    <a class="navbar-brand" href="/" data-route="/">
                        <i class="fas fa-network-wired me-2"></i>
                        ${CONFIG.APP_NAME}
                    </a>
                    
                    <!-- Mobile menu button -->
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#navbarNav" aria-controls="navbarNav" 
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    
                    <!-- Navigation items -->
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="/" data-route="/">
                                    <i class="fas fa-home me-1"></i>
                                    Inicio
                                </a>
                            </li>
                            
                            ${isAuthenticated ? `
                                <li class="nav-item">
                                    <a class="nav-link" href="/friends" data-route="/friends">
                                        <i class="fas fa-users me-1"></i>
                                        Mis Amigos
                                    </a>
                                </li>
                                
                                <li class="nav-item">
                                    <a class="nav-link" href="/users" data-route="/users">
                                        <i class="fas fa-search me-1"></i>
                                        Buscar Personas
                                    </a>
                                </li>
                            ` : ''}
                            
                            <li class="nav-item">
                                <a class="nav-link" href="/about" data-route="/about">
                                    <i class="fas fa-info-circle me-1"></i>
                                    Acerca de
                                </a>
                            </li>
                        </ul>
                        
                        <!-- User menu -->
                        <ul class="navbar-nav">
                            ${isAuthenticated ? this.renderUserMenu(user) : this.renderGuestMenu()}
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    },
    
    /**
     * Renderizar menú de usuario autenticado
     */
    renderUserMenu(user) {
        return `
            <!-- User dropdown -->
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" 
                   id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="${user.avatar_url || CONFIG.FILES.DEFAULT_AVATAR}" 
                         alt="Avatar" class="rounded-circle me-2" 
                         style="width: 32px; height: 32px; object-fit: cover;">
                    <span class="d-none d-md-inline">${user.first_name} ${user.last_name}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                        <h6 class="dropdown-header">
                            <div class="d-flex align-items-center">
                                <img src="${user.avatar_url || CONFIG.FILES.DEFAULT_AVATAR}" 
                                     alt="Avatar" class="rounded-circle me-2" 
                                     style="width: 24px; height: 24px; object-fit: cover;">
                                ${user.first_name} ${user.last_name}
                            </div>
                        </h6>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <a class="dropdown-item" href="/profile" data-route="/profile">
                            <i class="fas fa-user me-2"></i>
                            Mi Perfil
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="/friends" data-route="/friends">
                            <i class="fas fa-users me-2"></i>
                            Mis Amigos
                        </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <a class="dropdown-item" href="#" id="logout-btn">
                            <i class="fas fa-sign-out-alt me-2"></i>
                            Cerrar Sesión
                        </a>
                    </li>
                </ul>
            </li>
        `;
    },
    
    /**
     * Renderizar menú de invitado
     */
    renderGuestMenu() {
        return `
            <li class="nav-item">
                <a class="nav-link" href="/login" data-route="/login">
                    <i class="fas fa-sign-in-alt me-1"></i>
                    Iniciar Sesión
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link btn btn-nexo-outline ms-2 px-3" href="/register" data-route="/register">
                    <i class="fas fa-user-plus me-1"></i>
                    Registrarse
                </a>
            </li>
        `;
    },
    
    /**
     * Inicializar navbar
     */
    init() {
        this.attachEventListeners();
        this.updateActiveLink();
    },
    
    /**
     * Adjuntar event listeners
     */
    attachEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }
        
        // Navbar links (ya manejados por el router)
        // pero podemos agregar efectos adicionales aquí
    },
    
    /**
     * Manejar logout
     */
    async handleLogout(event) {
        event.preventDefault();
        
        try {
            const result = await Utils.showConfirm(CONFIG.MESSAGES.CONFIRM_LOGOUT);
            if (result) {
                await Auth.logout();
                Utils.showToast(CONFIG.MESSAGES.LOGOUT_SUCCESS, 'success');
                Router.navigate('/');
                this.update(); // Actualizar navbar
            }
        } catch (error) {
            CONFIG.log(`Logout error: ${error.message}`, 'error');
            Utils.showToast('Error al cerrar sesión', 'error');
        }
    },
    
    /**
     * Actualizar enlace activo
     */
    updateActiveLink() {
        const currentPath = Router.getCurrentRoute()?.path || '/';
        const navLinks = document.querySelectorAll('.nav-link[data-route]');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === currentPath) {
                link.classList.add('active');
            }
        });
    },
    
    /**
     * Actualizar navbar completo
     */
    update() {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = this.render();
            this.init();
        }
    },
    
    /**
     * Mostrar indicador de carga en navbar
     */
    showLoading() {
        // Podemos agregar un indicador de carga en el navbar si es necesario
    },
    
    /**
     * Ocultar indicador de carga
     */
    hideLoading() {
        // Ocultar indicador de carga
    }
};

// Auto-renderizar navbar al cargar el script
document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = NavbarComponent.render();
        NavbarComponent.init();
    }
});

// Exportar para uso global
window.NavbarComponent = NavbarComponent;