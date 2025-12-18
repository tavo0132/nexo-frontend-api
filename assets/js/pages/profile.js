// ===================================
// NEXO FRONTEND - PROFILE PAGE COMPONENT
// ===================================

const ProfileComponent = {
    /**
     * Renderizar página de perfil
     */
    async render() {
        return `
            <div class="container py-4 fade-in">
                <!-- Header del perfil -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card card-nexo">
                            <div class="card-header bg-nexo-gradient text-white">
                                <h4 class="mb-0">
                                    <i class="fas fa-user me-2"></i>
                                    Mi Perfil
                                </h4>
                            </div>
                            <div class="card-body" id="profile-header">
                                <!-- Se cargará dinámicamente -->
                                <div class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Cargando perfil...</span>
                                    </div>
                                    <p class="mt-2 text-muted">Cargando información del perfil...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Contenido del perfil -->
                <div class="row">
                    <!-- Información personal -->
                    <div class="col-lg-8 mb-4">
                        <div class="card card-nexo">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="fas fa-edit me-2"></i>
                                    Información Personal
                                </h5>
                            </div>
                            <div class="card-body">
                                <!-- Alertas -->
                                <div id="profile-alerts"></div>
                                
                                <!-- Formulario -->
                                <form id="profile-form" novalidate>
                                    <!-- Se cargará dinámicamente -->
                                    <div class="text-center py-4">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Cargando formulario...</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sidebar -->
                    <div class="col-lg-4">
                        <!-- Avatar -->
                        <div class="card card-nexo mb-4">
                            <div class="card-header">
                                <h6 class="mb-0">
                                    <i class="fas fa-camera me-2"></i>
                                    Foto de Perfil
                                </h6>
                            </div>
                            <div class="card-body text-center" id="avatar-section">
                                <!-- Se cargará dinámicamente -->
                                <div class="py-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Estadísticas -->
                        <div class="card card-nexo">
                            <div class="card-header">
                                <h6 class="mb-0">
                                    <i class="fas fa-chart-bar me-2"></i>
                                    Estadísticas
                                </h6>
                            </div>
                            <div class="card-body" id="profile-stats">
                                <!-- Se cargará dinámicamente -->
                                <div class="text-center py-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Cargando estadísticas...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal para cambiar avatar -->
            <div class="modal fade" id="avatarModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Cambiar Foto de Perfil</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="avatar-alerts"></div>
                            
                            <div class="text-center mb-3">
                                <img id="avatar-preview" 
                                     src="" 
                                     alt="Vista previa" 
                                     class="rounded-circle"
                                     style="width: 150px; height: 150px; object-fit: cover; border: 3px solid #e9ecef;">
                            </div>
                            
                            <div class="mb-3">
                                <label for="avatar-file" class="form-label">Seleccionar nueva imagen:</label>
                                <input type="file" 
                                       class="form-control" 
                                       id="avatar-file"
                                       accept="image/*">
                                <div class="form-text">
                                    Formatos permitidos: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB.
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="button" class="btn btn-nexo" id="save-avatar-btn">
                                <span class="btn-text">
                                    <i class="fas fa-save me-2"></i>
                                    Guardar Cambios
                                </span>
                                <span class="btn-loading d-none">
                                    <span class="loading-spinner me-2"></span>
                                    Guardando...
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Inicializar página de perfil
     */
    async init() {
        await this.loadProfileData();
        this.attachEventListeners();
    },
    
    /**
     * Cargar datos del perfil
     */
    async loadProfileData() {
        try {
            const user = await API.getMyProfile();
            
            // Renderizar header del perfil
            this.renderProfileHeader(user);
            
            // Renderizar formulario
            this.renderProfileForm(user);
            
            // Renderizar sección de avatar
            this.renderAvatarSection(user);
            
            // Cargar estadísticas
            await this.loadProfileStats();
            
        } catch (error) {
            CONFIG.log('Error loading profile data: ' + error.message, 'error');
            this.showAlert('Error al cargar los datos del perfil', 'error');
        }
    },
    
    /**
     * Renderizar header del perfil
     */
    renderProfileHeader(user) {
        const headerContainer = document.getElementById('profile-header');
        headerContainer.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-3 text-center mb-3 mb-md-0">
                    <img src="${user.avatar_url || CONFIG.FILES.DEFAULT_AVATAR}" 
                         alt="Avatar" 
                         class="rounded-circle shadow"
                         style="width: 100px; height: 100px; object-fit: cover;">
                </div>
                <div class="col-md-9">
                    <h3 class="text-white mb-1">${user.first_name} ${user.last_name}</h3>
                    <p class="text-light mb-2">
                        <i class="fas fa-envelope me-2"></i>
                        ${user.email}
                    </p>
                    <p class="text-light mb-0">
                        <i class="fas fa-calendar-alt me-2"></i>
                        Miembro desde ${new Date(user.created_at).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderizar formulario del perfil
     */
    renderProfileForm(user) {
        const formContainer = document.getElementById('profile-form');
        formContainer.innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="first_name" class="form-label form-label-nexo">
                        <i class="fas fa-user me-1"></i>
                        Nombre
                    </label>
                    <input type="text" 
                           class="form-control form-control-nexo" 
                           id="first_name" 
                           name="first_name"
                           value="${user.first_name || ''}"
                           required>
                    <div class="invalid-feedback"></div>
                </div>
                
                <div class="col-md-6 mb-3">
                    <label for="last_name" class="form-label form-label-nexo">
                        <i class="fas fa-user me-1"></i>
                        Apellido
                    </label>
                    <input type="text" 
                           class="form-control form-control-nexo" 
                           id="last_name" 
                           name="last_name"
                           value="${user.last_name || ''}"
                           required>
                    <div class="invalid-feedback"></div>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label form-label-nexo">
                    <i class="fas fa-envelope me-1"></i>
                    Correo Electrónico
                </label>
                <input type="email" 
                       class="form-control form-control-nexo" 
                       id="email" 
                       name="email"
                       value="${user.email || ''}"
                       readonly
                       title="El email no se puede modificar">
                <div class="form-text text-muted">
                    El correo electrónico no se puede modificar por razones de seguridad.
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="birth_date" class="form-label form-label-nexo">
                        <i class="fas fa-calendar me-1"></i>
                        Fecha de Nacimiento
                    </label>
                    <input type="date" 
                           class="form-control form-control-nexo" 
                           id="birth_date" 
                           name="birth_date"
                           value="${user.birth_date || ''}">
                    <div class="invalid-feedback"></div>
                </div>
                
                <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label form-label-nexo">
                        <i class="fas fa-phone me-1"></i>
                        Teléfono
                    </label>
                    <input type="tel" 
                           class="form-control form-control-nexo" 
                           id="phone" 
                           name="phone"
                           value="${user.phone || ''}"
                           placeholder="+57 300 123 4567">
                    <div class="invalid-feedback"></div>
                </div>
            </div>
            
            <div class="mb-4">
                <label for="bio" class="form-label form-label-nexo">
                    <i class="fas fa-pen me-1"></i>
                    Biografía
                </label>
                <textarea class="form-control form-control-nexo" 
                          id="bio" 
                          name="bio"
                          rows="3"
                          placeholder="Cuéntanos sobre ti..."
                          maxlength="500">${user.bio || ''}</textarea>
                <div class="form-text text-muted">
                    <span id="bio-counter">${(user.bio || '').length}</span>/500 caracteres
                </div>
            </div>
            
            <div class="text-end">
                <button type="submit" class="btn btn-nexo" id="save-profile-btn">
                    <span class="btn-text">
                        <i class="fas fa-save me-2"></i>
                        Guardar Cambios
                    </span>
                    <span class="btn-loading d-none">
                        <span class="loading-spinner me-2"></span>
                        Guardando...
                    </span>
                </button>
            </div>
        `;
    },
    
    /**
     * Renderizar sección de avatar
     */
    renderAvatarSection(user) {
        const avatarContainer = document.getElementById('avatar-section');
        avatarContainer.innerHTML = `
            <img src="${user.avatar_url || CONFIG.FILES.DEFAULT_AVATAR}" 
                 alt="Avatar" 
                 class="rounded-circle shadow mb-3"
                 style="width: 120px; height: 120px; object-fit: cover;">
            
            <div>
                <button type="button" class="btn btn-nexo-outline btn-sm" id="change-avatar-btn">
                    <i class="fas fa-camera me-1"></i>
                    Cambiar Foto
                </button>
            </div>
            
            <div class="mt-2">
                <small class="text-muted">
                    Formatos: JPG, PNG, GIF<br>
                    Tamaño máximo: 5MB
                </small>
            </div>
        `;
    },
    
    /**
     * Cargar estadísticas del perfil
     */
    async loadProfileStats() {
        const statsContainer = document.getElementById('profile-stats');
        
        try {
            // Obtener datos de amigos
            const friends = await API.getFriends();
            const friendRequests = await API.getFriendRequests();
            
            const friendsCount = friends.length;
            const pendingRequests = friendRequests.filter(req => req.status === 'pending').length;
            
            // Calcular días como miembro
            const user = Auth.getCurrentUser();
            const memberSince = new Date(user.created_at);
            const now = new Date();
            const daysDiff = Math.floor((now - memberSince) / (1000 * 60 * 60 * 24));
            
            statsContainer.innerHTML = `
                <div class="row text-center">
                    <div class="col-6 mb-3">
                        <div class="p-2">
                            <div class="h4 text-nexo-blue mb-1">${friendsCount}</div>
                            <div class="small text-muted">Amigos</div>
                        </div>
                    </div>
                    <div class="col-6 mb-3">
                        <div class="p-2">
                            <div class="h4 text-nexo-light-blue mb-1">${pendingRequests}</div>
                            <div class="small text-muted">Solicitudes</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="p-2">
                            <div class="h5 text-nexo-green mb-1">${daysDiff}</div>
                            <div class="small text-muted">Días en Nexo</div>
                        </div>
                    </div>
                </div>
                
                <hr>
                
                <div class="d-grid gap-2">
                    <a href="/friends" class="btn btn-nexo-outline btn-sm">
                        <i class="fas fa-users me-1"></i>
                        Ver Mis Amigos
                    </a>
                    <a href="/users" class="btn btn-nexo-outline btn-sm">
                        <i class="fas fa-search me-1"></i>
                        Buscar Personas
                    </a>
                </div>
            `;
            
        } catch (error) {
            CONFIG.log('Error loading profile stats: ' + error.message, 'error');
            statsContainer.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-exclamation-triangle mb-2"></i>
                    <p class="small mb-0">Error al cargar estadísticas</p>
                </div>
            `;
        }
    },
    
    /**
     * Adjuntar event listeners
     */
    attachEventListeners() {
        // Formulario de perfil
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', this.handleProfileUpdate.bind(this));
        }
        
        // Botón cambiar avatar
        const changeAvatarBtn = document.getElementById('change-avatar-btn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', this.openAvatarModal.bind(this));
        }
        
        // Avatar file input
        const avatarFileInput = document.getElementById('avatar-file');
        if (avatarFileInput) {
            avatarFileInput.addEventListener('change', this.previewAvatar.bind(this));
        }
        
        // Guardar avatar
        const saveAvatarBtn = document.getElementById('save-avatar-btn');
        if (saveAvatarBtn) {
            saveAvatarBtn.addEventListener('click', this.handleAvatarUpdate.bind(this));
        }
        
        // Counter de bio
        const bioField = document.getElementById('bio');
        if (bioField) {
            bioField.addEventListener('input', this.updateBioCounter.bind(this));
        }
    },
    
    /**
     * Manejar actualización del perfil
     */
    async handleProfileUpdate(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const profileData = {
            first_name: formData.get('first_name').trim(),
            last_name: formData.get('last_name').trim(),
            birth_date: formData.get('birth_date'),
            phone: formData.get('phone').trim(),
            bio: formData.get('bio').trim()
        };
        
        // Validar datos
        if (!profileData.first_name || !profileData.last_name) {
            this.showAlert('El nombre y apellido son obligatorios', 'error');
            return;
        }
        
        this.setProfileLoading(true);
        this.clearAlerts();
        
        try {
            const response = await API.updateProfile(profileData);
            
            // Actualizar datos del usuario en localStorage
            const updatedUser = { ...Auth.getCurrentUser(), ...profileData };
            localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(updatedUser));
            
            // Actualizar header del perfil
            this.renderProfileHeader(updatedUser);
            
            // Actualizar navbar
            if (typeof NavbarComponent !== 'undefined') {
                NavbarComponent.update();
            }
            
            this.showAlert(CONFIG.MESSAGES.PROFILE_UPDATE_SUCCESS, 'success');
            
        } catch (error) {
            CONFIG.log('Profile update error: ' + error.message, 'error');
            this.showAlert(error.message || CONFIG.MESSAGES.PROFILE_UPDATE_ERROR, 'error');
        } finally {
            this.setProfileLoading(false);
        }
    },
    
    /**
     * Abrir modal de avatar
     */
    openAvatarModal() {
        const user = Auth.getCurrentUser();
        const avatarPreview = document.getElementById('avatar-preview');
        avatarPreview.src = user.avatar_url || CONFIG.FILES.DEFAULT_AVATAR;
        
        const modal = new bootstrap.Modal(document.getElementById('avatarModal'));
        modal.show();
    },
    
    /**
     * Preview del avatar
     */
    previewAvatar(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validar archivo
        if (!CONFIG.FILES.ALLOWED_AVATAR_TYPES.includes(file.type)) {
            this.showAvatarAlert(CONFIG.MESSAGES.INVALID_FILE_TYPE, 'error');
            return;
        }
        
        if (file.size > CONFIG.FILES.MAX_AVATAR_SIZE) {
            this.showAvatarAlert(CONFIG.MESSAGES.FILE_TOO_LARGE, 'error');
            return;
        }
        
        // Mostrar preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarPreview = document.getElementById('avatar-preview');
            avatarPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        this.clearAvatarAlerts();
    },
    
    /**
     * Manejar actualización de avatar
     */
    async handleAvatarUpdate() {
        const fileInput = document.getElementById('avatar-file');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showAvatarAlert('Selecciona una imagen primero', 'error');
            return;
        }
        
        this.setAvatarLoading(true);
        this.clearAvatarAlerts();
        
        try {
            const response = await API.uploadAvatar(file);
            
            // Actualizar usuario en localStorage
            const updatedUser = { ...Auth.getCurrentUser(), avatar_url: response.avatar_url };
            localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(updatedUser));
            
            // Actualizar UI
            this.renderProfileHeader(updatedUser);
            this.renderAvatarSection(updatedUser);
            
            // Actualizar navbar
            if (typeof NavbarComponent !== 'undefined') {
                NavbarComponent.update();
            }
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('avatarModal'));
            modal.hide();
            
            this.showAlert(CONFIG.MESSAGES.AVATAR_UPDATE_SUCCESS, 'success');
            
        } catch (error) {
            CONFIG.log('Avatar update error: ' + error.message, 'error');
            this.showAvatarAlert(error.message || CONFIG.MESSAGES.AVATAR_UPDATE_ERROR, 'error');
        } finally {
            this.setAvatarLoading(false);
        }
    },
    
    /**
     * Actualizar contador de bio
     */
    updateBioCounter() {
        const bioField = document.getElementById('bio');
        const counter = document.getElementById('bio-counter');
        if (bioField && counter) {
            counter.textContent = bioField.value.length;
        }
    },
    
    /**
     * Mostrar/ocultar loading del perfil
     */
    setProfileLoading(loading) {
        const saveBtn = document.getElementById('save-profile-btn');
        const btnText = saveBtn.querySelector('.btn-text');
        const btnLoading = saveBtn.querySelector('.btn-loading');
        
        if (loading) {
            saveBtn.disabled = true;
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            saveBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    },
    
    /**
     * Mostrar/ocultar loading del avatar
     */
    setAvatarLoading(loading) {
        const saveBtn = document.getElementById('save-avatar-btn');
        const btnText = saveBtn.querySelector('.btn-text');
        const btnLoading = saveBtn.querySelector('.btn-loading');
        
        if (loading) {
            saveBtn.disabled = true;
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            saveBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    },
    
    /**
     * Mostrar alerta
     */
    showAlert(message, type) {
        const alertsContainer = document.getElementById('profile-alerts');
        const alertClass = type === 'success' ? 'alert-nexo-success' : 'alert-nexo-error';
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        alertsContainer.innerHTML = `
            <div class="alert alert-nexo ${alertClass} fade-in mb-3">
                <i class="${icon} me-2"></i>
                ${message}
            </div>
        `;
        
        // Auto-hide después de unos segundos si es éxito
        if (type === 'success') {
            setTimeout(() => {
                alertsContainer.innerHTML = '';
            }, 5000);
        }
    },
    
    /**
     * Mostrar alerta en modal de avatar
     */
    showAvatarAlert(message, type) {
        const alertsContainer = document.getElementById('avatar-alerts');
        const alertClass = type === 'success' ? 'alert-nexo-success' : 'alert-nexo-error';
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        alertsContainer.innerHTML = `
            <div class="alert alert-nexo ${alertClass} fade-in mb-3">
                <i class="${icon} me-2"></i>
                ${message}
            </div>
        `;
    },
    
    /**
     * Limpiar alertas
     */
    clearAlerts() {
        const alertsContainer = document.getElementById('profile-alerts');
        alertsContainer.innerHTML = '';
    },
    
    /**
     * Limpiar alertas del avatar
     */
    clearAvatarAlerts() {
        const alertsContainer = document.getElementById('avatar-alerts');
        alertsContainer.innerHTML = '';
    }
};

// Exportar para uso global
window.ProfileComponent = ProfileComponent;