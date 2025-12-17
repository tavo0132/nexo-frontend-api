// ===================================
// NEXO FRONTEND - HOME PAGE COMPONENT
// ===================================

const HomeComponent = {
    /**
     * Renderizar página de inicio
     */
    async render() {
        const isAuthenticated = Auth.isAuthenticated();
        const user = Auth.getCurrentUser();
        
        return `
            <div class="fade-in">
                ${isAuthenticated ? this.renderAuthenticatedHome(user) : this.renderGuestHome()}
            </div>
        `;
    },
    
    /**
     * Renderizar home para usuarios autenticados
     */
    renderAuthenticatedHome(user) {
        return `
            <!-- Hero Section para usuarios autenticados -->
            <div class="bg-nexo-gradient text-white py-5 mb-4">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h1 class="display-4 fw-bold mb-3">
                                ¡Hola, ${user.first_name}! 👋
                            </h1>
                            <p class="lead mb-4">
                                Bienvenido de vuelta a tu red social. 
                                Conecta, comparte y descubre nuevas amistades.
                            </p>
                        </div>
                        <div class="col-md-4 text-center">
                            <img src="${user.avatar_url || CONFIG.FILES.DEFAULT_AVATAR}" 
                                 alt="Avatar" 
                                 class="rounded-circle shadow-lg" 
                                 style="width: 120px; height: 120px; object-fit: cover;">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Dashboard -->
            <div class="container">
                <div class="row">
                    <!-- Tarjetas de acciones rápidas -->
                    <div class="col-md-4 mb-4">
                        <div class="card card-nexo h-100">
                            <div class="card-body text-center">
                                <div class="mb-3">
                                    <i class="fas fa-users fa-3x text-nexo-blue"></i>
                                </div>
                                <h5 class="card-title">Mis Amigos</h5>
                                <p class="card-text text-muted">
                                    Ve tu lista de amigos y gestiona tus conexiones.
                                </p>
                                <a href="/friends" class="btn btn-nexo">
                                    Ver Amigos
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4 mb-4">
                        <div class="card card-nexo h-100">
                            <div class="card-body text-center">
                                <div class="mb-3">
                                    <i class="fas fa-search fa-3x text-nexo-light-blue"></i>
                                </div>
                                <h5 class="card-title">Buscar Personas</h5>
                                <p class="card-text text-muted">
                                    Encuentra nuevas personas para conectar.
                                </p>
                                <a href="/users" class="btn btn-nexo">
                                    Explorar
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4 mb-4">
                        <div class="card card-nexo h-100">
                            <div class="card-body text-center">
                                <div class="mb-3">
                                    <i class="fas fa-user-edit fa-3x text-nexo-green"></i>
                                </div>
                                <h5 class="card-title">Mi Perfil</h5>
                                <p class="card-text text-muted">
                                    Actualiza tu información y foto de perfil.
                                </p>
                                <a href="/profile" class="btn btn-nexo">
                                    Editar Perfil
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Estadísticas rápidas -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card card-nexo">
                            <div class="card-header bg-nexo-gradient text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-chart-line me-2"></i>
                                    Tu Actividad
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row text-center" id="user-stats">
                                    <div class="col-md-3">
                                        <div class="p-3">
                                            <div class="h2 text-nexo-blue mb-1" id="friends-count">
                                                <div class="loading-spinner"></div>
                                            </div>
                                            <div class="text-muted">Amigos</div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="p-3">
                                            <div class="h2 text-nexo-light-blue mb-1" id="pending-requests-count">
                                                <div class="loading-spinner"></div>
                                            </div>
                                            <div class="text-muted">Solicitudes Pendientes</div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="p-3">
                                            <div class="h2 text-nexo-green mb-1">
                                                ${this.getDaysAsMember(user.created_at)}
                                            </div>
                                            <div class="text-muted">Días en Nexo</div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="p-3">
                                            <div class="h2 text-nexo-orange mb-1">
                                                ${new Date(user.created_at).getFullYear()}
                                            </div>
                                            <div class="text-muted">Miembro desde</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderizar home para visitantes
     */
    renderGuestHome() {
        return `
            <!-- Hero Section -->
            <div class="bg-nexo-gradient text-white py-5 mb-5">
                <div class="container">
                    <div class="row align-items-center min-vh-50">
                        <div class="col-lg-6">
                            <h1 class="display-3 fw-bold mb-4">
                                Conecta con el mundo en 
                                <span class="text-warning">Nexo</span>
                            </h1>
                            <p class="lead mb-4">
                                La red social que te permite crear conexiones auténticas, 
                                compartir momentos especiales y descubrir nuevas amistades 
                                en un ambiente seguro y amigable.
                            </p>
                            <div class="d-flex flex-column flex-sm-row gap-3">
                                <a href="/register" class="btn btn-warning btn-lg px-4">
                                    <i class="fas fa-user-plus me-2"></i>
                                    Únete Ahora
                                </a>
                                <a href="/login" class="btn btn-outline-light btn-lg px-4">
                                    <i class="fas fa-sign-in-alt me-2"></i>
                                    Iniciar Sesión
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-6 text-center">
                            <i class="fas fa-network-wired display-1 opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Características -->
            <div class="container py-5">
                <div class="row">
                    <div class="col-12 text-center mb-5">
                        <h2 class="display-5 fw-bold text-nexo-blue">
                            ¿Por qué elegir Nexo?
                        </h2>
                        <p class="lead text-muted">
                            Descubre las características que hacen de Nexo tu mejor opción
                        </p>
                    </div>
                </div>
                
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="card card-nexo h-100 text-center">
                            <div class="card-body p-4">
                                <div class="mb-3">
                                    <i class="fas fa-shield-alt fa-3x text-nexo-green"></i>
                                </div>
                                <h5 class="card-title">Seguro y Privado</h5>
                                <p class="card-text text-muted">
                                    Tu privacidad es nuestra prioridad. Controla quién ve tu información 
                                    y mantén tus datos seguros con nuestra encriptación avanzada.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card card-nexo h-100 text-center">
                            <div class="card-body p-4">
                                <div class="mb-3">
                                    <i class="fas fa-users fa-3x text-nexo-blue"></i>
                                </div>
                                <h5 class="card-title">Conexiones Auténticas</h5>
                                <p class="card-text text-muted">
                                    Encuentra personas afines a tus intereses y construye 
                                    relaciones duraderas en nuestra comunidad global.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card card-nexo h-100 text-center">
                            <div class="card-body p-4">
                                <div class="mb-3">
                                    <i class="fas fa-mobile-alt fa-3x text-nexo-light-blue"></i>
                                </div>
                                <h5 class="card-title">Acceso Multiplataforma</h5>
                                <p class="card-text text-muted">
                                    Mantente conectado desde cualquier dispositivo. 
                                    Nexo funciona perfectamente en móviles, tablets y computadoras.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Llamada a la acción -->
            <div class="bg-light py-5 mt-5">
                <div class="container text-center">
                    <h3 class="fw-bold text-nexo-blue mb-3">
                        ¿Listo para comenzar tu aventura en Nexo?
                    </h3>
                    <p class="lead text-muted mb-4">
                        Únete a miles de personas que ya forman parte de nuestra comunidad
                    </p>
                    <a href="/register" class="btn btn-nexo btn-lg px-5">
                        <i class="fas fa-rocket me-2"></i>
                        Crear mi cuenta gratis
                    </a>
                </div>
            </div>
        `;
    },
    
    /**
     * Calcular días como miembro
     */
    getDaysAsMember(createdAt) {
        if (!createdAt) return 0;
        
        const now = new Date();
        const created = new Date(createdAt);
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    },
    
    /**
     * Cargar estadísticas del usuario
     */
    async loadUserStats() {
        try {
            const friendsCountElement = document.getElementById('friends-count');
            const pendingRequestsElement = document.getElementById('pending-requests-count');
            
            if (friendsCountElement && pendingRequestsElement) {
                // Cargar amigos
                try {
                    const friends = await API.getFriends();
                    friendsCountElement.textContent = friends.length || 0;
                } catch (error) {
                    friendsCountElement.textContent = '0';
                    CONFIG.log('Error loading friends count: ' + error.message, 'error');
                }
                
                // Cargar solicitudes pendientes
                try {
                    const requests = await API.getFriendRequests();
                    const pendingCount = requests.filter(req => req.status === 'pending').length;
                    pendingRequestsElement.textContent = pendingCount || 0;
                } catch (error) {
                    pendingRequestsElement.textContent = '0';
                    CONFIG.log('Error loading pending requests count: ' + error.message, 'error');
                }
            }
        } catch (error) {
            CONFIG.log('Error loading user stats: ' + error.message, 'error');
        }
    },
    
    /**
     * Inicializar página de inicio
     */
    async init() {
        // Si el usuario está autenticado, cargar estadísticas
        if (Auth.isAuthenticated()) {
            await this.loadUserStats();
        }
        
        // Agregar animaciones a las tarjetas
        this.addCardAnimations();
    },
    
    /**
     * Agregar animaciones a las tarjetas
     */
    addCardAnimations() {
        const cards = document.querySelectorAll('.card-nexo');
        
        // Intersection Observer para animaciones al scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.6s ease-out';
                }
            });
        });
        
        cards.forEach(card => {
            observer.observe(card);
            
            // Efecto hover
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
};

// Exportar para uso global
window.HomeComponent = HomeComponent;