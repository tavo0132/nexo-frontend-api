// ===================================
// NEXO FRONTEND - FRIENDS PAGE COMPONENT
// ===================================

const FriendsComponent = {
    /**
     * Renderizar página de amigos
     */
    async render() {
        return `
            <div class="container py-4 fade-in">
                <!-- Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card card-nexo">
                            <div class="card-header bg-nexo-gradient text-white">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4 class="mb-0">
                                        <i class="fas fa-users me-2"></i>
                                        Mis Amigos
                                    </h4>
                                    <a href="/users" class="btn btn-light btn-sm">
                                        <i class="fas fa-user-plus me-1"></i>
                                        Buscar Personas
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Navegación de pestañas -->
                <div class="row mb-4">
                    <div class="col-12">
                        <ul class="nav nav-tabs nav-fill" id="friendsTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="friends-tab" data-bs-toggle="tab" 
                                        data-bs-target="#friends-pane" type="button" role="tab">
                                    <i class="fas fa-heart me-2"></i>
                                    Mis Amigos
                                    <span class="badge bg-primary ms-2" id="friends-badge">0</span>
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="requests-tab" data-bs-toggle="tab" 
                                        data-bs-target="#requests-pane" type="button" role="tab">
                                    <i class="fas fa-clock me-2"></i>
                                    Solicitudes Pendientes
                                    <span class="badge bg-warning ms-2" id="requests-badge">0</span>
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="sent-tab" data-bs-toggle="tab" 
                                        data-bs-target="#sent-pane" type="button" role="tab">
                                    <i class="fas fa-paper-plane me-2"></i>
                                    Enviadas
                                    <span class="badge bg-info ms-2" id="sent-badge">0</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <!-- Contenido de las pestañas -->
                <div class="tab-content" id="friendsTabContent">
                    <!-- Pestaña de Amigos -->
                    <div class="tab-pane fade show active" id="friends-pane" role="tabpanel">
                        <div class="row" id="friends-list">
                            <!-- Se cargará dinámicamente -->
                            <div class="col-12 text-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando amigos...</span>
                                </div>
                                <p class="mt-2 text-muted">Cargando lista de amigos...</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Pestaña de Solicitudes Recibidas -->
                    <div class="tab-pane fade" id="requests-pane" role="tabpanel">
                        <div class="row" id="requests-list">
                            <!-- Se cargará dinámicamente -->
                            <div class="col-12 text-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando solicitudes...</span>
                                </div>
                                <p class="mt-2 text-muted">Cargando solicitudes pendientes...</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Pestaña de Solicitudes Enviadas -->
                    <div class="tab-pane fade" id="sent-pane" role="tabpanel">
                        <div class="row" id="sent-list">
                            <!-- Se cargará dinámicamente -->
                            <div class="col-12 text-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando solicitudes enviadas...</span>
                                </div>
                                <p class="mt-2 text-muted">Cargando solicitudes enviadas...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal de confirmación -->
            <div class="modal fade" id="confirmModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmModalTitle">Confirmar Acción</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="confirmModalBody">
                            <!-- Contenido dinámico -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="button" class="btn btn-danger" id="confirmActionBtn">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Inicializar página de amigos
     */
    async init() {
        await this.loadAllData();
        this.attachEventListeners();
    },
    
    /**
     * Cargar todos los datos
     */
    async loadAllData() {
        await Promise.all([
            this.loadFriends(),
            this.loadFriendRequests()
        ]);
    },
    
    /**
     * Cargar lista de amigos
     */
    async loadFriends() {
        const friendsList = document.getElementById('friends-list');
        const friendsBadge = document.getElementById('friends-badge');
        
        try {
            const data = await API.listFriends('accepted');
            const friendships = data.friendships || [];
            
            // Actualizar badge
            friendsBadge.textContent = friendships.length;
            
            if (friendships.length === 0) {
                friendsList.innerHTML = this.renderEmptyState('amigos', 'users');
            } else {
                friendsList.innerHTML = friendships.map(friendship => 
                    this.renderFriendCard(friendship.other_user, friendship)
                ).join('');
            }
            
        } catch (error) {
            CONFIG.log('Error loading friends: ' + error.message, 'error');
            friendsList.innerHTML = this.renderErrorState('Error al cargar amigos');
        }
    },
    
    /**
     * Cargar solicitudes de amistad
     */
    async loadFriendRequests() {
        const requestsList = document.getElementById('requests-list');
        const sentList = document.getElementById('sent-list');
        const requestsBadge = document.getElementById('requests-badge');
        const sentBadge = document.getElementById('sent-badge');
        
        try {
            const data = await API.listFriends('pending');
            const allRequests = data.friendships || [];
            const currentUserId = Auth.getCurrentUser().user_uuid || Auth.getCurrentUser().uuid;
            
            // Separar solicitudes recibidas y enviadas
            const receivedRequests = allRequests.filter(req => req.requested_by_me === false);
            const sentRequests = allRequests.filter(req => req.requested_by_me === true);
            
            // Actualizar badges
            requestsBadge.textContent = receivedRequests.length;
            sentBadge.textContent = sentRequests.length;
            
            // Renderizar solicitudes recibidas
            if (receivedRequests.length === 0) {
                requestsList.innerHTML = this.renderEmptyState('solicitudes pendientes', 'clock');
            } else {
                requestsList.innerHTML = receivedRequests.map(request => 
                    this.renderRequestCard(request.other_user, request, 'received')
                ).join('');
            }
            
            // Renderizar solicitudes enviadas
            if (sentRequests.length === 0) {
                sentList.innerHTML = this.renderEmptyState('solicitudes enviadas', 'paper-plane');
            } else {
                sentList.innerHTML = sentRequests.map(request => 
                    this.renderRequestCard(request.other_user, request, 'sent')
                ).join('');
            }
            
        } catch (error) {
            CONFIG.log('Error loading friend requests: ' + error.message, 'error');
            requestsList.innerHTML = this.renderErrorState('Error al cargar solicitudes');
            sentList.innerHTML = this.renderErrorState('Error al cargar solicitudes');
        }
    },
    
    /**
     * Renderizar tarjeta de amigo
     */
    renderFriendCard(friend, friendship) {
        const avatar = friend.avatar_url 
            ? CONFIG.API_BASE_URL + friend.avatar_url
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.first_name + ' ' + friend.last_name)}&size=80&background=random`;
            
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card card-nexo h-100">
                    <div class="card-body text-center">
                        <img src="${avatar}" 
                             alt="Avatar" 
                             class="rounded-circle mb-3"
                             style="width: 80px; height: 80px; object-fit: cover;">
                        
                        <h6 class="card-title mb-2">
                            ${friend.first_name || ''} ${friend.last_name || ''}
                        </h6>
                        
                        <p class="card-text text-muted small mb-3">
                            @${friend.username}
                        </p>
                        
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-danger btn-sm remove-friend-btn" 
                                    data-user-uuid="${friend.uuid}"
                                    data-user-name="${friend.first_name} ${friend.last_name}">
                                <i class="fas fa-user-minus me-1"></i>
                                Eliminar Amigo
                            </button>
                        </div>
                        
                        <div class="mt-2">
                            <small class="text-muted">
                                Amigos desde ${new Date(friendship.created_at).toLocaleDateString('es-ES')}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderizar tarjeta de solicitud
     */
    renderRequestCard(user, request, type) {
        const avatar = user.avatar_url 
            ? CONFIG.API_BASE_URL + user.avatar_url
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + user.last_name)}&size=80&background=random`;
            
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card card-nexo h-100">
                    <div class="card-body text-center">
                        <img src="${avatar}" 
                             alt="Avatar" 
                             class="rounded-circle mb-3"
                             style="width: 80px; height: 80px; object-fit: cover;">
                        
                        <h6 class="card-title mb-2">
                            ${user.first_name || ''} ${user.last_name || ''}
                        </h6>
                        
                        <p class="card-text text-muted small mb-3">
                            @${user.username}
                        </p>
                        
                        ${type === 'received' ? `
                            <div class="d-grid gap-2">
                                <button class="btn btn-nexo btn-sm accept-request-btn" 
                                        data-user-uuid="${user.uuid}"
                                        data-user-name="${user.first_name} ${user.last_name}">
                                    <i class="fas fa-check me-1"></i>
                                    Aceptar
                                </button>
                                <button class="btn btn-outline-danger btn-sm reject-request-btn" 
                                        data-user-uuid="${user.uuid}"
                                        data-user-name="${user.first_name} ${user.last_name}">
                                    <i class="fas fa-times me-1"></i>
                                    Rechazar
                                </button>
                            </div>
                        ` : `
                            <div class="d-grid">
                                <button class="btn btn-outline-secondary btn-sm" disabled>
                                    <i class="fas fa-clock me-1"></i>
                                    Pendiente
                                </button>
                            </div>
                        `}
                        
                        <div class="mt-2">
                            <small class="text-muted">
                                ${type === 'received' ? 'Recibida' : 'Enviada'} el 
                                ${new Date(request.created_at).toLocaleDateString('es-ES')}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderizar estado vacío
     */
    renderEmptyState(type, icon) {
        return `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-${icon} fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No tienes ${type}</h5>
                    <p class="text-muted">
                        ${type === 'amigos' ? 
                            'Comienza a conectar con personas buscando usuarios y enviando solicitudes de amistad.' :
                            type === 'solicitudes pendientes' ?
                            'No tienes solicitudes de amistad pendientes en este momento.' :
                            'No has enviado solicitudes de amistad recientemente.'
                        }
                    </p>
                    ${type === 'amigos' || type === 'solicitudes pendientes' ? `
                        <a href="/users" class="btn btn-nexo">
                            <i class="fas fa-search me-2"></i>
                            Buscar Personas
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    /**
     * Renderizar estado de error
     */
    renderErrorState(message) {
        return `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h5 class="text-danger">Error</h5>
                    <p class="text-muted">${message}</p>
                    <button class="btn btn-nexo" onclick="FriendsComponent.loadAllData()">
                        <i class="fas fa-redo me-2"></i>
                        Reintentar
                    </button>
                </div>
            </div>
        `;
    },
    
    /**
     * Adjuntar event listeners
     */
    attachEventListeners() {
        // Botones de eliminar amigo
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-friend-btn')) {
                const btn = e.target.closest('.remove-friend-btn');
                const userUuid = btn.dataset.userUuid;
                const userName = btn.dataset.userName;
                this.confirmRemoveFriend(userUuid, userName);
            }
        });
        
        // Botones de aceptar solicitud
        document.addEventListener('click', (e) => {
            if (e.target.closest('.accept-request-btn')) {
                const btn = e.target.closest('.accept-request-btn');
                const userUuid = btn.dataset.userUuid;
                const userName = btn.dataset.userName;
                this.acceptFriendRequest(userUuid, userName);
            }
        });
        
        // Botones de rechazar solicitud
        document.addEventListener('click', (e) => {
            if (e.target.closest('.reject-request-btn')) {
                const btn = e.target.closest('.reject-request-btn');
                const userUuid = btn.dataset.userUuid;
                const userName = btn.dataset.userName;
                this.confirmRejectRequest(userUuid, userName);
            }
        });
    },
    
    /**
     * Confirmar eliminación de amigo
     */
    confirmRemoveFriend(userUuid, userName) {
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        
        document.getElementById('confirmModalTitle').textContent = 'Eliminar Amigo';
        document.getElementById('confirmModalBody').innerHTML = `
            <p>¿Estás seguro de que quieres eliminar a <strong>${userName}</strong> de tu lista de amigos?</p>
            <p class="text-muted small">Esta acción no se puede deshacer.</p>
        `;
        
        const confirmBtn = document.getElementById('confirmActionBtn');
        confirmBtn.textContent = 'Eliminar';
        confirmBtn.className = 'btn btn-danger';
        
        confirmBtn.onclick = () => {
            this.removeFriend(userUuid);
            modal.hide();
        };
        
        modal.show();
    },
    
    /**
     * Confirmar rechazo de solicitud
     */
    confirmRejectRequest(userUuid, userName) {
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        
        document.getElementById('confirmModalTitle').textContent = 'Rechazar Solicitud';
        document.getElementById('confirmModalBody').innerHTML = `
            <p>¿Estás seguro de que quieres rechazar la solicitud de amistad de <strong>${userName}</strong>?</p>
        `;
        
        const confirmBtn = document.getElementById('confirmActionBtn');
        confirmBtn.textContent = 'Rechazar';
        confirmBtn.className = 'btn btn-danger';
        
        confirmBtn.onclick = () => {
            this.rejectFriendRequest(userUuid, userName);
            modal.hide();
        };
        
        modal.show();
    },
    
    /**
     * Eliminar amigo
     */
    async removeFriend(userUuid) {
        try {
            await API.unfriend(userUuid);
            
            // Mostrar mensaje de éxito
            alert('Amigo eliminado');
            
            // Recargar datos
            await this.loadAllData();
            
        } catch (error) {
            CONFIG.log('Error removing friend: ' + error.message, 'error');
            this.showToast('Error al eliminar amigo', 'error');
        }
    },
    
    /**
     * Aceptar solicitud de amistad
     */
    async acceptFriendRequest(userUuid, userName) {
        try {
            await API.acceptFriend(userUuid);
            
            // Mostrar mensaje de éxito
            alert(`Solicitud de ${userName} aceptada`);
            
            // Recargar datos
            await this.loadAllData();
            
            // Cambiar a la pestaña de amigos
            const friendsTab = document.getElementById('friends-tab');
            if (friendsTab) {
                const tab = new bootstrap.Tab(friendsTab);
                tab.show();
            }
            
        } catch (error) {
            CONFIG.log('Error accepting friend request: ' + error.message, 'error');
            this.showToast('Error al aceptar solicitud', 'error');
        }
    },
    
    /**
     * Rechazar solicitud de amistad
     */
    async rejectFriendRequest(userUuid, userName) {
        try {
            await API.rejectFriend(userUuid);
            
            // Mostrar mensaje de éxito
            alert(`Solicitud de ${userName} rechazada`);
            
            // Recargar datos
            await this.loadAllData();
            
        } catch (error) {
            CONFIG.log('Error rejecting friend request: ' + error.message, 'error');
            this.showToast('Error al rechazar solicitud', 'error');
        }
    },
    
    /**
     * Mostrar toast notification
     */
    showToast(message, type) {
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
        const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        
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
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        // Remover el elemento después de que se oculte
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
};

// Exportar para uso global
window.FriendsComponent = FriendsComponent;