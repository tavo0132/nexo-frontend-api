// ===================================
// NEXO FRONTEND - ROUTER SPA
// ===================================

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.isNavigating = false;
        
        // Bind methods
        this.navigate = this.navigate.bind(this);
        this.handlePopState = this.handlePopState.bind(this);
        
        // Initialize router
        this.init();
    }
    
    /**
     * Inicializar el router
     */
    init() {
        // Registrar rutas
        this.registerRoutes();
        
        // Escuchar eventos del navegador
        window.addEventListener('popstate', this.handlePopState);
        
        // Manejar clics en enlaces
        document.addEventListener('click', this.handleLinkClick.bind(this));
        
        // Cargar ruta inicial
        this.loadInitialRoute();
        
        CONFIG.log('Router initialized', 'info');
    }
    
    /**
     * Registrar todas las rutas de la aplicación
     */
    registerRoutes() {
        this.addRoute('/', {
            title: 'Inicio - Nexo',
            component: 'home',
            requiresAuth: false
        });
        
        this.addRoute('/login', {
            title: 'Iniciar Sesión - Nexo',
            component: 'login',
            requiresAuth: false,
            redirectIfAuth: true
        });
        
        this.addRoute('/register', {
            title: 'Registrarse - Nexo',
            component: 'register',
            requiresAuth: false,
            redirectIfAuth: true
        });
        
        this.addRoute('/profile', {
            title: 'Mi Perfil - Nexo',
            component: 'profile',
            requiresAuth: true
        });
        
        this.addRoute('/feed', {
            title: 'Feed - Nexo',
            component: 'feed',
            requiresAuth: true
        });
        
        this.addRoute('/friends', {
            title: 'Mis Amigos - Nexo',
            component: 'friends',
            requiresAuth: true
        });
        
        this.addRoute('/users', {
            title: 'Usuarios - Nexo',
            component: 'users',
            requiresAuth: true
        });
        
        this.addRoute('/about', {
            title: 'Acerca de - Nexo',
            component: 'about',
            requiresAuth: false
        });
        
        this.addRoute('/contact', {
            title: 'Contacto - Nexo',
            component: 'contact',
            requiresAuth: false
        });
    }
    
    /**
     * Agregar una nueva ruta
     */
    addRoute(path, config) {
        this.routes.set(path, {
            path,
            title: config.title || 'Nexo',
            component: config.component,
            requiresAuth: config.requiresAuth || false,
            redirectIfAuth: config.redirectIfAuth || false,
            beforeEnter: config.beforeEnter || null,
            afterEnter: config.afterEnter || null
        });
    }
    
    /**
     * Navegar a una ruta específica
     */
    async navigate(path, replace = false) {
        if (this.isNavigating) {
            CONFIG.log('Navigation in progress, ignoring request', 'warn');
            return;
        }
        
        this.isNavigating = true;
        
        try {
            // Normalizar path
            path = this.normalizePath(path);
            
            // Buscar ruta
            const route = this.findRoute(path);
            if (!route) {
                CONFIG.log(`Route not found: ${path}`, 'error');
                this.navigate('/', true);
                return;
            }
            
            // Verificar autenticación
            const authCheck = this.checkAuthentication(route);
            if (authCheck !== true) {
                this.navigate(authCheck, true);
                return;
            }
            
            // Ejecutar beforeEnter hook
            if (route.beforeEnter) {
                const canEnter = await route.beforeEnter(route, this.currentRoute);
                if (canEnter === false) {
                    CONFIG.log(`Route blocked by beforeEnter hook: ${path}`, 'warn');
                    return;
                }
            }
            
            // Actualizar historial del navegador
            this.updateHistory(path, route.title, replace);
            
            // Cargar componente
            await this.loadComponent(route);
            
            // Actualizar ruta actual
            this.currentRoute = route;
            
            // Actualizar navbar
            this.updateNavbar();
            
            // Ejecutar afterEnter hook
            if (route.afterEnter) {
                await route.afterEnter(route);
            }
            
            CONFIG.log(`Navigated to: ${path}`, 'info');
            
        } catch (error) {
            CONFIG.log(`Navigation error: ${error.message}`, 'error');
            this.navigate('/', true);
        } finally {
            this.isNavigating = false;
        }
    }
    
    /**
     * Encontrar ruta que coincida con el path
     */
    findRoute(path) {
        // Buscar coincidencia exacta
        if (this.routes.has(path)) {
            return this.routes.get(path);
        }
        
        // Buscar coincidencia con parámetros (futuro)
        // TODO: Implementar rutas con parámetros como /users/:id
        
        return null;
    }
    
    /**
     * Verificar autenticación para la ruta
     */
    checkAuthentication(route) {
        const isAuthenticated = Auth.isAuthenticated();
        
        // Si la ruta requiere autenticación y no está autenticado
        if (route.requiresAuth && !isAuthenticated) {
            return '/login';
        }
        
        // Si está autenticado y la ruta redirige usuarios autenticados
        if (route.redirectIfAuth && isAuthenticated) {
            return '/profile';
        }
        
        return true;
    }
    
    /**
     * Cargar componente de la ruta
     */
    async loadComponent(route) {
        const mainContent = document.getElementById('main-content');
        
        if (!mainContent) {
            throw new Error('Main content container not found');
        }
        
        // Mostrar loading
        this.showLoading(mainContent);
        
        try {
            // Cargar contenido del componente
            let content = '';
            
            switch (route.component) {
                case 'home':
                    content = await HomeComponent.render();
                    break;
                case 'login':
                    content = await LoginComponent.render();
                    break;
                case 'register':
                    content = await RegisterComponent.render();
                    break;
                case 'profile':
                    content = await ProfileComponent.render();
                    break;
                case 'feed':
                    content = await FeedComponent.render();
                    break;
                case 'friends':
                    content = await FriendsComponent.render();
                    break;
                case 'users':
                    content = await UsersComponent.render();
                    break;
                default:
                    content = await this.render404();
                    break;
            }
            
            // Actualizar contenido
            mainContent.innerHTML = content;
            
            // Ejecutar scripts del componente
            await this.executeComponentScripts(route.component);
            
            // Actualizar título de la página
            document.title = route.title;
            
        } catch (error) {
            CONFIG.log(`Error loading component ${route.component}: ${error.message}`, 'error');
            mainContent.innerHTML = await this.renderError(error);
        }
    }
    
    /**
     * Ejecutar scripts específicos del componente
     */
    async executeComponentScripts(component) {
        try {
            switch (component) {
                case 'login':
                    if (typeof LoginComponent.init === 'function') {
                        await LoginComponent.init();
                    }
                    break;
                case 'register':
                    if (typeof RegisterComponent.init === 'function') {
                        await RegisterComponent.init();
                    }
                    break;
                case 'profile':
                    if (typeof ProfileComponent.init === 'function') {
                        await ProfileComponent.init();
                    }
                    break;
                case 'feed':
                    if (typeof FeedComponent.init === 'function') {
                        await FeedComponent.init();
                    }
                    break;
                case 'friends':
                    if (typeof FriendsComponent.init === 'function') {
                        await FriendsComponent.init();
                    }
                    break;
                case 'users':
                    if (typeof UsersComponent.init === 'function') {
                        await UsersComponent.init();
                    }
                    break;
            }
        } catch (error) {
            CONFIG.log(`Error executing component scripts: ${error.message}`, 'error');
        }
    }
    
    /**
     * Mostrar loading
     */
    showLoading(container) {
        container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2 text-muted">Cargando...</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizar página 404
     */
    async render404() {
        return `
            <div class="container mt-5">
                <div class="row justify-content-center">
                    <div class="col-md-6 text-center">
                        <h1 class="display-1 text-nexo-blue">404</h1>
                        <h2>Página no encontrada</h2>
                        <p class="text-muted">La página que buscas no existe o ha sido movida.</p>
                        <a href="/" class="btn btn-nexo mt-3">Volver al inicio</a>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizar página de error
     */
    async renderError(error) {
        return `
            <div class="container mt-5">
                <div class="row justify-content-center">
                    <div class="col-md-6 text-center">
                        <h1 class="text-danger">Error</h1>
                        <p class="text-muted">Ha ocurrido un error al cargar la página.</p>
                        <p class="small text-muted">${error.message}</p>
                        <a href="/" class="btn btn-nexo mt-3">Volver al inicio</a>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Actualizar historial del navegador
     */
    updateHistory(path, title, replace) {
        if (replace) {
            history.replaceState({ path }, title, path);
        } else {
            history.pushState({ path }, title, path);
        }
    }
    
    /**
     * Actualizar navbar activo
     */
    updateNavbar() {
        const navLinks = document.querySelectorAll('.nav-link[data-route]');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === this.currentRoute?.path) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Manejar evento popstate (botón atrás/adelante)
     */
    handlePopState(event) {
        const path = event.state?.path || window.location.pathname;
        this.navigate(path, true);
    }
    
    /**
     * Manejar clics en enlaces
     */
    handleLinkClick(event) {
        const link = event.target.closest('a[href]');
        
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Solo manejar enlaces internos
        if (href.startsWith('/') && !link.hasAttribute('target')) {
            event.preventDefault();
            this.navigate(href);
        }
    }
    
    /**
     * Normalizar path
     */
    normalizePath(path) {
        // Remover query string y hash
        path = path.split('?')[0].split('#')[0];
        
        // Asegurar que empiece con /
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        
        // Remover / final excepto para root
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        
        return path;
    }
    
    /**
     * Cargar ruta inicial
     */
    loadInitialRoute() {
        const path = this.normalizePath(window.location.pathname);
        this.navigate(path, true);
    }
    
    /**
     * Obtener ruta actual
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    /**
     * Recargar ruta actual
     */
    reload() {
        if (this.currentRoute) {
            this.navigate(this.currentRoute.path, true);
        }
    }
}

// Crear instancia global del router
const router = new Router();

// Exportar para uso global
window.Router = router;