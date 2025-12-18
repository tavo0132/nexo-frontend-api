// ===================================
// NEXO FRONTEND - POST COMPONENT
// ===================================

const PostComponent = {
    /**
     * Renderizar un post individual
     */
    render(post, currentUser) {
        const isOwner = currentUser && post.user.uuid === currentUser.uuid;
        const userFullName = `${post.user.first_name} ${post.user.last_name}`;
        const avatarUrl = post.user.avatar_url || 'https://via.placeholder.com/50';
        const timeAgo = this.getTimeAgo(post.created_at);
        
        return `
            <div class="card post-card mb-3 fade-in" data-post-id="${post.uuid}">
                <div class="card-body">
                    <!-- Header del post -->
                    <div class="d-flex align-items-center mb-3">
                        <img src="${avatarUrl}" 
                             alt="${userFullName}" 
                             class="rounded-circle me-3"
                             style="width: 50px; height: 50px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <h6 class="mb-0 fw-bold">${userFullName}</h6>
                            <small class="text-muted">@${post.user.username} • ${timeAgo}</small>
                        </div>
                        ${isOwner ? `
                            <div class="dropdown">
                                <button class="btn btn-link text-muted p-0" 
                                        type="button" 
                                        data-bs-toggle="dropdown">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <a class="dropdown-item text-danger" 
                                           href="#" 
                                           onclick="PostComponent.deletePost('${post.uuid}'); return false;">
                                            <i class="fas fa-trash me-2"></i>Eliminar
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Contenido del post -->
                    <div class="post-content mb-3">
                        <p class="mb-2">${this.escapeHtml(post.content)}</p>
                        ${post.image_url ? `
                            <img src="${post.image_url}" 
                                 alt="Post image" 
                                 class="img-fluid rounded"
                                 style="max-height: 400px; width: 100%; object-fit: cover;">
                        ` : ''}
                    </div>
                    
                    <!-- Acciones del post -->
                    <div class="post-actions d-flex align-items-center gap-3 border-top pt-3">
                        <button class="btn btn-link text-decoration-none p-0 like-btn" 
                                data-post-id="${post.uuid}"
                                onclick="PostComponent.toggleLike('${post.uuid}'); return false;">
                            <i class="fas fa-heart me-1"></i>
                            <span class="likes-count">${post.likes_count || 0}</span>
                        </button>
                        
                        <button class="btn btn-link text-decoration-none p-0"
                                onclick="PostComponent.toggleComments('${post.uuid}'); return false;">
                            <i class="fas fa-comment me-1"></i>
                            <span class="comments-count">${post.comments_count || 0}</span>
                        </button>
                    </div>
                    
                    <!-- Sección de comentarios (inicialmente oculta) -->
                    <div class="comments-section mt-3 d-none" id="comments-${post.uuid}">
                        <div class="comments-list mb-3" id="comments-list-${post.uuid}">
                            <!-- Los comentarios se cargarán aquí -->
                        </div>
                        
                        ${currentUser ? `
                            <form class="comment-form" onsubmit="PostComponent.submitComment(event, '${post.uuid}'); return false;">
                                <div class="input-group">
                                    <input type="text" 
                                           class="form-control" 
                                           placeholder="Escribe un comentario..."
                                           required>
                                    <button class="btn btn-primary" type="submit">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </form>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderizar un comentario
     */
    renderComment(comment, currentUser) {
        const isOwner = currentUser && comment.user.uuid === currentUser.uuid;
        const userFullName = `${comment.user.first_name} ${comment.user.last_name}`;
        const avatarUrl = comment.user.avatar_url || 'https://via.placeholder.com/40';
        const timeAgo = this.getTimeAgo(comment.created_at);
        
        return `
            <div class="comment d-flex mb-2" data-comment-id="${comment.uuid}">
                <img src="${avatarUrl}" 
                     alt="${userFullName}" 
                     class="rounded-circle me-2"
                     style="width: 40px; height: 40px; object-fit: cover;">
                <div class="flex-grow-1">
                    <div class="bg-light rounded p-2">
                        <h6 class="mb-0 small fw-bold">${userFullName}</h6>
                        <p class="mb-0 small">${this.escapeHtml(comment.content)}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <small class="text-muted">${timeAgo}</small>
                        ${isOwner ? `
                            <button class="btn btn-link btn-sm text-danger p-0" 
                                    onclick="PostComponent.deleteComment('${comment.post_uuid}', '${comment.uuid}'); return false;">
                                Eliminar
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Eliminar post
     */
    async deletePost(postId) {
        if (!confirm('¿Estás seguro de eliminar este post?')) {
            return;
        }
        
        try {
            await API.deletePost(postId);
            
            // Remover del DOM
            const postCard = document.querySelector(`[data-post-id="${postId}"]`);
            if (postCard) {
                postCard.remove();
            }
            
            CONFIG.log('Post eliminado', 'info');
        } catch (error) {
            CONFIG.log('Error eliminando post: ' + error.message, 'error');
            alert('Error al eliminar el post');
        }
    },
    
    /**
     * Toggle like en post
     */
    async toggleLike(postId) {
        const likeBtn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
        const icon = likeBtn.querySelector('i');
        const countSpan = likeBtn.querySelector('.likes-count');
        
        try {
            // Determinar si ya tiene like (corazón rojo)
            const hasLike = icon.classList.contains('text-danger');
            
            if (hasLike) {
                // Quitar like
                const response = await API.unlikePost(postId);
                icon.classList.remove('text-danger');
                countSpan.textContent = response.likes_count;
            } else {
                // Dar like
                const response = await API.likePost(postId);
                icon.classList.add('text-danger');
                countSpan.textContent = response.likes_count;
            }
        } catch (error) {
            CONFIG.log('Error con like: ' + error.message, 'error');
        }
    },
    
    /**
     * Toggle sección de comentarios
     */
    async toggleComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        
        if (commentsSection.classList.contains('d-none')) {
            // Mostrar y cargar comentarios
            commentsSection.classList.remove('d-none');
            await this.loadComments(postId);
        } else {
            // Ocultar
            commentsSection.classList.add('d-none');
        }
    },
    
    /**
     * Cargar comentarios de un post
     */
    async loadComments(postId) {
        const commentsList = document.getElementById(`comments-list-${postId}`);
        
        try {
            commentsList.innerHTML = '<div class="text-center"><div class="spinner-border spinner-border-sm"></div></div>';
            
            const response = await API.getComments(postId);
            const currentUser = Auth.getCurrentUser();
            
            if (response.comments && response.comments.length > 0) {
                commentsList.innerHTML = response.comments
                    .map(comment => this.renderComment(comment, currentUser))
                    .join('');
            } else {
                commentsList.innerHTML = '<p class="text-muted text-center small">No hay comentarios aún</p>';
            }
        } catch (error) {
            CONFIG.log('Error cargando comentarios: ' + error.message, 'error');
            commentsList.innerHTML = '<p class="text-danger text-center small">Error al cargar comentarios</p>';
        }
    },
    
    /**
     * Enviar comentario
     */
    async submitComment(event, postId) {
        event.preventDefault();
        
        const form = event.target;
        const input = form.querySelector('input');
        const content = input.value.trim();
        
        if (!content) return;
        
        try {
            const response = await API.createComment(postId, content);
            
            // Agregar comentario al DOM
            const commentsList = document.getElementById(`comments-list-${postId}`);
            const currentUser = Auth.getCurrentUser();
            
            // Si está vacío, limpiar mensaje de "no hay comentarios"
            if (commentsList.textContent.includes('No hay comentarios')) {
                commentsList.innerHTML = '';
            }
            
            commentsList.insertAdjacentHTML('beforeend', this.renderComment(response.comment, currentUser));
            
            // Actualizar contador
            const commentsCount = document.querySelector(`[data-post-id="${postId}"] .comments-count`);
            commentsCount.textContent = parseInt(commentsCount.textContent) + 1;
            
            // Limpiar formulario
            input.value = '';
        } catch (error) {
            CONFIG.log('Error enviando comentario: ' + error.message, 'error');
            alert('Error al enviar comentario');
        }
    },
    
    /**
     * Eliminar comentario
     */
    async deleteComment(postId, commentId) {
        if (!confirm('¿Eliminar este comentario?')) {
            return;
        }
        
        try {
            await API.deleteComment(postId, commentId);
            
            // Remover del DOM
            const commentEl = document.querySelector(`[data-comment-id="${commentId}"]`);
            if (commentEl) {
                commentEl.remove();
            }
            
            // Actualizar contador
            const commentsCount = document.querySelector(`[data-post-id="${postId}"] .comments-count`);
            commentsCount.textContent = parseInt(commentsCount.textContent) - 1;
            
            CONFIG.log('Comentario eliminado', 'info');
        } catch (error) {
            CONFIG.log('Error eliminando comentario: ' + error.message, 'error');
            alert('Error al eliminar comentario');
        }
    },
    
    /**
     * Obtener tiempo transcurrido (timeago)
     */
    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Justo ahora';
        if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
        if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
        if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;
        
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    },
    
    /**
     * Escapar HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Exportar para uso global
window.PostComponent = PostComponent;
