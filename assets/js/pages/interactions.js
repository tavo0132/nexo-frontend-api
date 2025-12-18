// ===================================
// NEXO FRONTEND - INTERACTIONS PAGE
// ===================================

const InteractionsComponent = {
    items: [],
    offset: 0,
    limit: 20,
    hasMore: true,
    loading: false,
    query: '',

    /**
     * Renderizar página de interacciones
     */
    async render() {
        return `
            <div class="container py-4 fade-in">
                <div class="row">
                    <div class="col-12">
                        <div class="card card-nexo">
                            <div class="card-header bg-nexo-gradient text-white">
                                <h4 class="mb-0">
                                    <i class="fas fa-bell me-2"></i>
                                    Mis Interacciones
                                </h4>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <input 
                                        id="filter-users" 
                                        type="text" 
                                        class="form-control"
                                        placeholder="Filtrar por usuario (nombre, username o email)" 
                                    />
                                </div>
                                
                                <div id="interactions-list"></div>
                                
                                <div class="d-grid mt-3">
                                    <button 
                                        id="btn-load-more" 
                                        class="btn btn-outline-secondary"
                                    >
                                        Cargar más
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Inicializar después de renderizar
     */
    async afterRender() {
        this.listBox = document.getElementById('interactions-list');
        this.loadMoreBtn = document.getElementById('btn-load-more');
        this.filterInput = document.getElementById('filter-users');

        if (this.filterInput) {
            this.filterInput.addEventListener('input', () => {
                this.query = this.filterInput.value.trim().toLowerCase();
                this.refresh();
            });
        }

        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMore());
        }

        await this.refresh();
    },

    /**
     * Refrescar lista
     */
    async refresh() {
        this.items = [];
        this.offset = 0;
        this.hasMore = true;
        if (this.listBox) {
            this.listBox.innerHTML = '';
        }
        await this.loadMore();
    },

    /**
     * Cargar más interacciones
     */
    async loadMore() {
        if (this.loading || !this.hasMore) return;

        this.loading = true;
        this.setLoadingState(true);

        try {
            const data = await API.listMyInteractions({
                user_search: this.query,
                limit: this.limit,
                offset: this.offset,
            });

            const items = data.items || [];
            const paging = data.paging || {};

            this.offset = paging.next_cursor ?? this.offset;
            this.hasMore = paging.next_cursor != null;

            this.appendItems(items);
        } catch (error) {
            if (this.listBox) {
                this.listBox.innerHTML += `
                    <div class="alert alert-danger">
                        ${error.message || 'Error al cargar interacciones'}
                    </div>
                `;
            }
        } finally {
            this.loading = false;
            this.setLoadingState(false);
        }
    },

    /**
     * Agregar items a la lista
     */
    appendItems(items) {
        if (!items || items.length === 0) {
            if (this.offset === 0 && this.listBox) {
                this.listBox.innerHTML = `
                    <div class="text-center text-muted py-5">
                        <i class="fas fa-bell-slash fa-3x mb-3"></i>
                        <p>No tienes interacciones aún</p>
                    </div>
                `;
            }
            this.hasMore = false;
            if (this.loadMoreBtn) {
                this.loadMoreBtn.classList.add('d-none');
            }
            return;
        }

        for (const ev of items) {
            const wrapper = document.createElement('div');
            wrapper.className = 'border rounded p-3 mb-3 interaction-item';

            const other = ev.other_user;
            const avatar = other.avatar_url
                ? CONFIG.API_BASE_URL + other.avatar_url
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(other.nombre + ' ' + other.apellido)}&size=40&background=random`;

            const typeIcon = this.getTypeIcon(ev.type);
            const typeText = this.getTypeText(ev.type);
            const createdAt = Utils.timeAgo(new Date(ev.created_at));

            wrapper.innerHTML = `
                <div class="d-flex gap-3 mb-2">
                    <img src="${avatar}" width="50" height="50" class="rounded-circle" alt="${other.nombre}" />
                    <div class="flex-grow-1">
                        <div class="fw-semibold">
                            ${other.nombre} ${other.apellido}
                            <span class="text-muted small">@${other.username}</span>
                        </div>
                        <div class="small text-muted">${createdAt}</div>
                        <div class="mt-2">
                            <i class="${typeIcon} me-1"></i>
                            <strong>${typeText}</strong> en post #${ev.post.id}
                        </div>
                        ${ev.type === 'comment' && ev.comment ? `
                            <div class="mt-2 border-start border-3 ps-3 text-muted">
                                ${Utils.escapeHtml(ev.comment.texto)}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

            this.listBox.appendChild(wrapper);
        }

        if (!this.hasMore && this.loadMoreBtn) {
            this.loadMoreBtn.classList.add('d-none');
        }
    },

    /**
     * Obtener icono según tipo de interacción
     */
    getTypeIcon(type) {
        const icons = {
            'like': 'fas fa-heart text-danger',
            'comment': 'fas fa-comment text-primary',
            'share': 'fas fa-share text-success'
        };
        return icons[type] || 'fas fa-bell';
    },

    /**
     * Obtener texto según tipo de interacción
     */
    getTypeText(type) {
        const texts = {
            'like': 'Le gustó tu publicación',
            'comment': 'Comentó tu publicación',
            'share': 'Compartió tu publicación'
        };
        return texts[type] || type;
    },

    /**
     * Establecer estado de carga
     */
    setLoadingState(isLoading) {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.disabled = isLoading || !this.hasMore;
            this.loadMoreBtn.innerHTML = isLoading 
                ? '<span class="spinner-border spinner-border-sm me-2"></span>Cargando...' 
                : 'Cargar más';
        }
    }
};

// Exportar componente
window.InteractionsComponent = InteractionsComponent;
