// ===================================
// NEXO FRONTEND - FEED PAGE COMPONENT
// ===================================

const FeedComponent = {
    posts: [],
    currentUser: null,
    
    /**
     * Renderizar página de feed
     */
    async render() {
        this.currentUser = Auth.getCurrentUser();
        
        if (!this.currentUser) {
            // Si no está autenticado, redirigir al login
            Router.navigate('/login');
            return '';
        }
        
        return `
            <div class="container py-4">
                <div class="row justify-content-center">
                    <div class="col-lg-8 col-md-10">
                        <!-- Header del Feed -->
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2 class="mb-0">
                                <i class="fas fa-rss me-2 text-primary"></i>
                                Feed
                            </h2>
                            <div class="btn-group" role="group" id="feed-filter-buttons">
                                <button type="button" class="btn btn-sm btn-outline-primary active" data-filter="all">
                                    <i class="fas fa-globe me-1"></i>
                                    Todos
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-primary" data-filter="friends">
                                    <i class="fas fa-user-friends me-1"></i>
                                    Amigos
                                </button>
                            </div>
                        </div>
                        
                        <!-- Componente para crear post -->
                        <div id="create-post-container"></div>
                        
                        <!-- Lista de posts -->
                        <div id="feed-container">
                            <div class="text-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                                <p class="mt-3 text-muted">Cargando posts...</p>
                            </div>
                        </div>
                        
                        <!-- Botón de cargar más -->
                        <div id="load-more-container" class="text-center mt-4 d-none">
                            <button class="btn btn-outline-primary" onclick="FeedComponent.loadMore(); return false;">
                                <i class="fas fa-arrow-down me-2"></i>
                                Cargar más posts
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Inicializar página de feed
     */
    async init() {
        this.currentUser = Auth.getCurrentUser();
        this.currentFilter = 'all'; // all o friends
        
        // Renderizar componente para crear post
        const createPostContainer = document.getElementById('create-post-container');
        if (createPostContainer && this.currentUser) {
            createPostContainer.innerHTML = CreatePostComponent.render(this.currentUser);
            CreatePostComponent.init();
        }
        
        // Agregar event listeners a los botones de filtro
        this.attachFilterListeners();
        
        // Cargar posts iniciales
        await this.loadPosts();
    },
    
    /**
     * Agregar event listeners a los botones de filtro
     */
    attachFilterListeners() {
        const filterButtons = document.getElementById('feed-filter-buttons');
        if (!filterButtons) return;
        
        filterButtons.addEventListener('click', async (e) => {
            const btn = e.target.closest('button[data-filter]');
            if (!btn) return;
            
            const filter = btn.dataset.filter;
            if (filter === this.currentFilter) return; // Ya está en ese filtro
            
            // Actualizar estado
            this.currentFilter = filter;
            
            // Actualizar botones activos
            filterButtons.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Recargar posts con el nuevo filtro
            await this.loadPosts(0);
        });
    },
    
    /**
     * Cargar posts del feed
     */
    async loadPosts(offset = 0) {
        const feedContainer = document.getElementById('feed-container');
        
        try {
            const params = {
                limit: 20,
                offset: offset
            };
            
            // Agregar filtro de amigos si está activo
            if (this.currentFilter === 'friends') {
                params.friends_only = true;
            }
            
            const response = await API.getPosts(params);
            
            if (response.posts && response.posts.length > 0) {
                // Agregar posts al array
                this.posts = offset === 0 ? response.posts : [...this.posts, ...response.posts];
                
                // Renderizar posts
                if (offset === 0) {
                    feedContainer.innerHTML = this.renderPosts(response.posts);
                } else {
                    feedContainer.insertAdjacentHTML('beforeend', this.renderPosts(response.posts));
                }
                
                // Mostrar/ocultar botón de cargar más
                const loadMoreContainer = document.getElementById('load-more-container');
                if (response.posts.length === 20) {
                    loadMoreContainer.classList.remove('d-none');
                } else {
                    loadMoreContainer.classList.add('d-none');
                }
            } else {
                if (offset === 0) {
                    feedContainer.innerHTML = `
                        <div class="card text-center py-5">
                            <div class="card-body">
                                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                <h4>No hay posts aún</h4>
                                <p class="text-muted">
                                    Sé el primero en publicar algo o espera a que tus amigos compartan contenido.
                                </p>
                            </div>
                        </div>
                    `;
                }
            }
        } catch (error) {
            CONFIG.log('Error cargando posts: ' + error.message, 'error');
            feedContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    Error al cargar el feed. Por favor intenta nuevamente.
                </div>
            `;
        }
    },
    
    /**
     * Renderizar lista de posts
     */
    renderPosts(posts) {
        return posts.map(post => PostComponent.render(post, this.currentUser)).join('');
    },
    
    /**
     * Cargar más posts
     */
    async loadMore() {
        await this.loadPosts(this.posts.length);
    },
    
    /**
     * Agregar un nuevo post al inicio del feed
     */
    prependPost(post) {
        const feedContainer = document.getElementById('feed-container');
        
        // Si el feed está vacío, reemplazar contenido
        if (feedContainer.querySelector('.card.text-center')) {
            feedContainer.innerHTML = '';
        }
        
        // Agregar post al inicio
        feedContainer.insertAdjacentHTML('afterbegin', PostComponent.render(post, this.currentUser));
        this.posts.unshift(post);
        
        CONFIG.log('Post agregado al feed', 'info');
    }
};

// Exportar para uso global
window.FeedComponent = FeedComponent;
