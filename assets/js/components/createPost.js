// ===================================
// NEXO FRONTEND - CREATE POST COMPONENT
// ===================================

const CreatePostComponent = {
    /**
     * Renderizar formulario para crear post
     */
    render(currentUser) {
        if (!currentUser) {
            return '';
        }
        
        const userFullName = `${currentUser.first_name} ${currentUser.last_name}`;
        const avatarUrl = currentUser.avatar_url || 'https://via.placeholder.com/50';
        
        return `
            <div class="card mb-4 fade-in">
                <div class="card-body">
                    <div class="d-flex align-items-start">
                        <img src="${avatarUrl}" 
                             alt="${userFullName}" 
                             class="rounded-circle me-3"
                             style="width: 50px; height: 50px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <form id="create-post-form" onsubmit="CreatePostComponent.submitPost(event); return false;">
                                <textarea class="form-control mb-2" 
                                          id="post-content"
                                          rows="3" 
                                          placeholder="¿Qué estás pensando, ${currentUser.first_name}?"
                                          maxlength="5000"
                                          required></textarea>
                                
                                <!-- Contador de caracteres -->
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">
                                        <span id="char-count">0</span>/5000 caracteres
                                    </small>
                                    
                                    <div class="d-flex gap-2">
                                        <!-- Botón de imagen (opcional para futuro) -->
                                        <!--
                                        <button type="button" class="btn btn-outline-secondary btn-sm">
                                            <i class="fas fa-image"></i> Imagen
                                        </button>
                                        -->
                                        
                                        <button type="submit" 
                                                class="btn btn-primary btn-sm"
                                                id="post-submit-btn">
                                            <i class="fas fa-paper-plane me-1"></i>
                                            Publicar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Inicializar componente
     */
    init() {
        // Actualizar contador de caracteres
        const textarea = document.getElementById('post-content');
        if (textarea) {
            textarea.addEventListener('input', this.updateCharCount.bind(this));
        }
    },
    
    /**
     * Actualizar contador de caracteres
     */
    updateCharCount() {
        const textarea = document.getElementById('post-content');
        const charCount = document.getElementById('char-count');
        
        if (textarea && charCount) {
            charCount.textContent = textarea.value.length;
            
            // Cambiar color si se acerca al límite
            if (textarea.value.length > 4500) {
                charCount.classList.add('text-danger');
            } else if (textarea.value.length > 4000) {
                charCount.classList.add('text-warning');
                charCount.classList.remove('text-danger');
            } else {
                charCount.classList.remove('text-warning', 'text-danger');
            }
        }
    },
    
    /**
     * Enviar post
     */
    async submitPost(event) {
        event.preventDefault();
        
        const textarea = document.getElementById('post-content');
        const submitBtn = document.getElementById('post-submit-btn');
        const content = textarea.value.trim();
        
        if (!content) {
            alert('El contenido del post no puede estar vacío');
            return;
        }
        
        try {
            // Deshabilitar botón y mostrar loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Publicando...';
            
            // Crear post
            const response = await API.createPost({ content });
            
            CONFIG.log('Post creado exitosamente', 'info');
            
            // Limpiar formulario
            textarea.value = '';
            this.updateCharCount();
            
            // Agregar post al feed
            if (typeof FeedComponent !== 'undefined' && FeedComponent.prependPost) {
                FeedComponent.prependPost(response.post);
            } else {
                // Recargar página si no está disponible el método
                window.location.reload();
            }
            
        } catch (error) {
            CONFIG.log('Error creando post: ' + error.message, 'error');
            alert('Error al crear el post. Por favor intenta nuevamente.');
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-1"></i> Publicar';
        }
    }
};

// Exportar para uso global
window.CreatePostComponent = CreatePostComponent;
