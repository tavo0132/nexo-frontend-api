// ===================================
// NEXO FRONTEND - USERS PAGE COMPONENT
// ===================================

const UsersComponent = {
    searchResults: [],
    
    /**
     * Renderizar página de búsqueda de usuarios
     */
    async render() {
        return `
            <div class="container py-4 fade-in">
                <div class="row">
                    <div class="col-12">
                        <div class="card card-nexo">
                            <div class="card-header bg-nexo-gradient text-white">
                                <h4 class="mb-0">
                                    <i class="fas fa-search me-2"></i>
                                    Buscar Personas
                                </h4>
                            </div>
                            <div class="card-body">
                                <div class="mb-4">
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text">
                                            <i class="fas fa-search"></i>
                                        </span>
                                        <input 
                                            type="text" 
                                            id="search-input" 
                                            class="form-control" 
                                            placeholder="Buscar por nombre, usuario o email..."
                                            autocomplete="off"
                                        />
                                    </div>
                                    <small class="text-muted">Escribe al menos 2 caracteres para buscar</small>
                                </div>
                                
                                <div id="search-results"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Inicializar página de usuarios
     */
    async init() {
        this.searchInput = document.getElementById('search-input');
        this.resultsContainer = document.getElementById('search-results');
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                const query = this.searchInput.value.trim();
                if (query.length >= 2) {
                    this.search(query);
                } else {
                    this.resultsContainer.innerHTML = '';
                }
            });
            
            // Focus automático
            this.searchInput.focus();
        }
        
        CONFIG.log('Users search component initialized', 'info');
    },
    
    /**
     * Buscar usuarios
     */
    async search(query) {
        try {
            this.resultsContainer.innerHTML = `
                <div class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Buscando...</span>
                    </div>
                    <p class="mt-2 text-muted">Buscando usuarios...</p>
                </div>
            `;
            
            const data = await API.searchUsers(query, 20, 0);
            this.searchResults = data.items || [];
            this.renderResults();
            
        } catch (error) {
            this.resultsContainer.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    ${error.message || 'Error al buscar usuarios'}
                </div>
            `;
        }
    },
    
    /**
     * Renderizar resultados de búsqueda
     */
    renderResults() {
        if (this.searchResults.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-user-slash fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No se encontraron usuarios</p>
                </div>
            `;
            return;
        }
        
        this.resultsContainer.innerHTML = '';
        
        for (const user of this.searchResults) {
            const userCard = this.createUserCard(user);
            this.resultsContainer.appendChild(userCard);
        }
    },
    
    /**
     * Crear tarjeta de usuario
     */
    createUserCard(user) {
        const avatar = user.avatar_url 
            ? CONFIG.API_BASE_URL + user.avatar_url
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre + ' ' + user.apellido)}&size=60&background=random`;
        
        const card = document.createElement('div');
        card.className = 'border rounded p-3 mb-3 d-flex align-items-center justify-content-between';
        
        card.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <img src="${avatar}" width="60" height="60" class="rounded-circle" alt="${user.nombre}" />
                <div>
                    <div class="fw-semibold fs-5">${user.nombre} ${user.apellido}</div>
                    <div class="text-muted">@${user.username}</div>
                    <div class="small text-muted">${user.email}</div>
                </div>
            </div>
            <button 
                class="btn btn-primary"
                data-user-id="${user.user_uuid}"
            >
                <i class="fas fa-user-plus me-1"></i>
                Enviar Solicitud
            </button>
        `;
        
        const button = card.querySelector('button');
        button.addEventListener('click', () => this.sendFriendRequest(user));
        
        return card;
    },
    
    /**
     * Enviar solicitud de amistad
     */
    async sendFriendRequest(user) {
        try {
            console.log('Enviando solicitud de amistad a:', user.user_uuid);
            const response = await API.requestFriend(user.user_uuid);
            console.log('Respuesta del servidor:', response);
            
            // Mostrar mensaje de éxito
            alert(`✅ Solicitud de amistad enviada a ${user.nombre} ${user.apellido}`);
            
            // Actualizar el botón
            const button = this.resultsContainer.querySelector(`button[data-user-id="${user.user_uuid}"]`);
            if (button) {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-check me-1"></i> Solicitud Enviada';
                button.classList.remove('btn-primary');
                button.classList.add('btn-secondary');
            }
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
            alert(`❌ Error: ${error.message || 'No se pudo enviar la solicitud. Verifica la consola para más detalles.'}`);
        }
    }
};

// Exportar para uso global
window.UsersComponent = UsersComponent;