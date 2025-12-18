// ===================================
// NEXO FRONTEND - REGISTER PAGE COMPONENT
// ===================================

const RegisterComponent = {
    /**
     * Renderizar página de registro
     */
    async render() {
        return `
            <div class="container-fluid">
                <div class="row min-vh-100">
                    <!-- Panel izquierdo - Información -->
                    <div class="col-lg-6 bg-nexo-gradient d-flex align-items-center">
                        <div class="container text-white text-center">
                            <div class="fade-in">
                                <i class="fas fa-user-plus display-1 mb-4 opacity-75"></i>
                                <h1 class="display-4 fw-bold mb-4">
                                    Únete a Nexo
                                </h1>
                                <p class="lead mb-4">
                                    Crea tu cuenta gratuita y comienza a conectar con personas 
                                    increíbles de todo el mundo. Solo te tomará unos minutos.
                                </p>
                                <div class="d-flex justify-content-center">
                                    <div class="text-start">
                                        <div class="d-flex align-items-center mb-2">
                                            <i class="fas fa-gift me-3"></i>
                                            <span>Completamente gratis</span>
                                        </div>
                                        <div class="d-flex align-items-center mb-2">
                                            <i class="fas fa-shield-alt me-3"></i>
                                            <span>Datos seguros y protegidos</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-rocket me-3"></i>
                                            <span>Configuración rápida</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Panel derecho - Formulario -->
                    <div class="col-lg-6 d-flex align-items-center py-5">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-10 col-lg-8">
                                    <div class="slide-in-right">
                                        <!-- Header -->
                                        <div class="text-center mb-4">
                                            <h2 class="fw-bold text-nexo-blue">Crear Cuenta</h2>
                                            <p class="text-muted">
                                                Completa la información para crear tu cuenta
                                            </p>
                                        </div>
                                        
                                        <!-- Alertas -->
                                        <div id="register-alerts"></div>
                                        
                                        <!-- Formulario -->
                                        <form id="register-form" novalidate>
                                            <div class="row">
                                                <!-- Nombre -->
                                                <div class="col-md-6 mb-3">
                                                    <label for="first_name" class="form-label form-label-nexo">
                                                        <i class="fas fa-user me-1"></i>
                                                        Nombre *
                                                    </label>
                                                    <input type="text" 
                                                           class="form-control form-control-nexo" 
                                                           id="first_name" 
                                                           name="first_name"
                                                           placeholder="Tu nombre"
                                                           required>
                                                    <div class="invalid-feedback"></div>
                                                </div>
                                                
                                                <!-- Apellido -->
                                                <div class="col-md-6 mb-3">
                                                    <label for="last_name" class="form-label form-label-nexo">
                                                        <i class="fas fa-user me-1"></i>
                                                        Apellido *
                                                    </label>
                                                    <input type="text" 
                                                           class="form-control form-control-nexo" 
                                                           id="last_name" 
                                                           name="last_name"
                                                           placeholder="Tu apellido"
                                                           required>
                                                    <div class="invalid-feedback"></div>
                                                </div>
                                            </div>
                                            
                                            <!-- Email -->
                                            <div class="mb-3">
                                                <label for="email" class="form-label form-label-nexo">
                                                    <i class="fas fa-envelope me-1"></i>
                                                    Correo Electrónico *
                                                </label>
                                                <input type="email" 
                                                       class="form-control form-control-nexo" 
                                                       id="email" 
                                                       name="email"
                                                       placeholder="tu@email.com"
                                                       required>
                                                <div class="invalid-feedback"></div>
                                                <div class="form-text text-muted">
                                                    Usaremos este email para enviarte notificaciones importantes.
                                                </div>
                                            </div>
                            
                            <!-- Username -->
                            <div class="mb-3">
                                <label for="username" class="form-label form-label-nexo">
                                    <i class="fas fa-at me-1"></i>
                                    Nombre de Usuario *
                                </label>
                                <input type="text" 
                                       class="form-control form-control-nexo" 
                                       id="username" 
                                       name="username"
                                       placeholder="mi_usuario_unico"
                                       required
                                       minlength="3"
                                       maxlength="20"
                                       pattern="^[a-zA-Z0-9_]+$">
                                <div class="invalid-feedback"></div>
                                <div class="form-text text-muted">
                                    Solo letras, números y guión bajo. Entre 3 y 20 caracteres.
                                </div>
                            </div>
                            
                            <!-- Password -->
                            <div class="mb-3">
                                <label for="password" class="form-label form-label-nexo">
                                    <i class="fas fa-lock me-1"></i>
                                    Contraseña *
                                </label>
                                <div class="position-relative">
                                    <input type="password" 
                                           class="form-control form-control-nexo" 
                                           id="password" 
                                           name="password"
                                           placeholder="Crea una contraseña segura"
                                           required
                                           minlength="6">
                                    <button type="button" 
                                            class="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent"
                                            onclick="RegisterComponent.togglePasswordVisibility('password')"
                                            tabindex="-1">
                                        <i class="fas fa-eye text-muted"></i>
                                    </button>
                                </div>
                                <div class="invalid-feedback"></div>
                                <!-- Password strength indicator -->
                                <div class="password-strength mt-2">
                                    <div class="progress" style="height: 4px;">
                                        <div class="progress-bar" id="password-strength-bar"></div>
                                    </div>
                                    <small class="text-muted" id="password-strength-text"></small>
                                </div>
                            </div>
                                            
                                            <!-- Confirm Password -->
                                            <div class="mb-3">
                                                <label for="confirm_password" class="form-label form-label-nexo">
                                                    <i class="fas fa-lock me-1"></i>
                                                    Confirmar Contraseña *
                                                </label>
                                                <input type="password" 
                                                       class="form-control form-control-nexo" 
                                                       id="confirm_password" 
                                                       name="confirm_password"
                                                       placeholder="Repite tu contraseña"
                                                       required>
                                                <div class="invalid-feedback"></div>
                                            </div>
                                            
                                            <div class="row">
                                                <!-- Fecha de nacimiento -->
                                                <div class="col-md-6 mb-3">
                                                    <label for="birth_date" class="form-label form-label-nexo">
                                                        <i class="fas fa-calendar me-1"></i>
                                                        Fecha de Nacimiento
                                                    </label>
                                                    <input type="date" 
                                                           class="form-control form-control-nexo" 
                                                           id="birth_date" 
                                                           name="birth_date">
                                                    <div class="invalid-feedback"></div>
                                                </div>
                                                
                                                <!-- Teléfono -->
                                                <div class="col-md-6 mb-3">
                                                    <label for="phone" class="form-label form-label-nexo">
                                                        <i class="fas fa-phone me-1"></i>
                                                        Teléfono
                                                    </label>
                                                    <input type="tel" 
                                                           class="form-control form-control-nexo" 
                                                           id="phone" 
                                                           name="phone"
                                                           placeholder="+57 300 123 4567">
                                                    <div class="invalid-feedback"></div>
                                                </div>
                                            </div>
                                            
                                            <!-- Términos y condiciones -->
                                            <div class="mb-4">
                                                <div class="form-check">
                                                    <input type="checkbox" 
                                                           class="form-check-input" 
                                                           id="terms"
                                                           required>
                                                    <label class="form-check-label text-muted" for="terms">
                                                        Acepto los 
                                                        <a href="#" class="text-nexo-blue text-decoration-none">términos y condiciones</a> 
                                                        y la 
                                                        <a href="#" class="text-nexo-blue text-decoration-none">política de privacidad</a>
                                                        de Nexo *
                                                    </label>
                                                    <div class="invalid-feedback"></div>
                                                </div>
                                            </div>
                                            
                                            <!-- Submit button -->
                                            <button type="submit" 
                                                    class="btn btn-nexo w-100 mb-3" 
                                                    id="register-btn">
                                                <span class="btn-text">
                                                    <i class="fas fa-user-plus me-2"></i>
                                                    Crear mi cuenta
                                                </span>
                                                <span class="btn-loading d-none">
                                                    <span class="loading-spinner me-2"></span>
                                                    Creando cuenta...
                                                </span>
                                            </button>
                                        </form>
                                        
                                        <!-- Divider -->
                                        <div class="text-center">
                                            <hr class="my-4">
                                            <p class="text-muted">
                                                ¿Ya tienes una cuenta?
                                                <a href="/login" class="text-nexo-blue fw-bold text-decoration-none">
                                                    Inicia sesión aquí
                                                </a>
                                            </p>
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
     * Inicializar página de registro
     */
    async init() {
        this.attachEventListeners();
        this.setupValidation();
        
        // Focus en el primer campo
        setTimeout(() => {
            const firstNameField = document.getElementById('first_name');
            if (firstNameField) firstNameField.focus();
        }, 100);
    },
    
    /**
     * Adjuntar event listeners
     */
    attachEventListeners() {
        // Formulario de registro
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }
        
        // Toggle password visibility
        const togglePassword = document.getElementById('toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
        }
        
        // Password strength indicator
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.addEventListener('input', this.updatePasswordStrength.bind(this));
        }
        
        // Limpiar errores al escribir
        const inputs = document.querySelectorAll('#register-form input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    },
    
    /**
     * Configurar validación en tiempo real
     */
    setupValidation() {
        const fields = {
            first_name: this.validateName,
            last_name: this.validateName,
            email: this.validateEmail,
            password: this.validatePassword,
            confirm_password: this.validateConfirmPassword,
            phone: this.validatePhone
        };
        
        Object.keys(fields).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => {
                    fields[fieldName].call(this, field.value, field);
                });
            }
        });
    },
    
    /**
     * Manejar envío del formulario
     */
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            username: formData.get('username').trim(),
            first_name: formData.get('first_name').trim(),
            last_name: formData.get('last_name').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            birth_date: formData.get('birth_date'),
            phone: formData.get('phone').trim()
        };
        
        // Validar formulario
        if (!this.validateForm(userData)) {
            return;
        }
        
        // Verificar términos
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            this.setFieldError(termsCheckbox, 'Debes aceptar los términos y condiciones');
            return;
        }
        
        // Mostrar loading
        this.setLoading(true);
        this.clearAlerts();
        
        try {
            // Remover confirm_password antes de enviar
            delete userData.confirm_password;
            
            console.log('=== REGISTER DEBUG ===');
            console.log('User data to send:', userData);
            
            // Intentar registro
            const result = await Auth.register(userData);
            
            console.log('Register result:', result);
            
            if (result.success) {
                // Mostrar éxito con opciones
                this.showSuccessWithActions(result.message);
            } else {
                // Mostrar error específico del backend
                const errorMessage = result.message || result.error || 'Error en el registro';
                this.showAlert(errorMessage, 'error');
                CONFIG.log('Register failed: ' + errorMessage, 'error');
            }
        } catch (error) {
            CONFIG.log('Register error: ' + error.message, 'error');
            // Intentar extraer mensaje del error si es una respuesta HTTP
            let errorMessage = CONFIG.MESSAGES.REGISTER_ERROR;
            if (error.response && error.response.error) {
                errorMessage = error.response.error;
            }
            this.showAlert(errorMessage, 'error');
        } finally {
            this.setLoading(false);
        }
    },
    
    /**
     * Validar formulario completo
     */
    validateForm(userData) {
        let isValid = true;
        
        // Validar campos requeridos
        if (!this.validateUsername(userData.username, document.getElementById('username'))) {
            isValid = false;
        }
        
        if (!this.validateName(userData.first_name, document.getElementById('first_name'))) {
            isValid = false;
        }
        
        if (!this.validateName(userData.last_name, document.getElementById('last_name'))) {
            isValid = false;
        }
        
        if (!this.validateEmail(userData.email, document.getElementById('email'))) {
            isValid = false;
        }
        
        if (!this.validatePassword(userData.password, document.getElementById('password'))) {
            isValid = false;
        }
        
        if (!this.validateConfirmPassword(userData.confirm_password, document.getElementById('confirm_password'))) {
            isValid = false;
        }
        
        // Validar campos opcionales si tienen valor
        if (userData.phone && !this.validatePhone(userData.phone, document.getElementById('phone'))) {
            isValid = false;
        }
        
        return isValid;
    },
    
    /**
     * Validar nombre de usuario
     */
    validateUsername(username, field = null) {
        if (!username || username.length < 3) {
            if (field) this.setFieldError(field, 'El nombre de usuario debe tener al menos 3 caracteres');
            return false;
        }
        
        if (username.length > 20) {
            if (field) this.setFieldError(field, 'El nombre de usuario no puede tener más de 20 caracteres');
            return false;
        }
        
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            if (field) this.setFieldError(field, 'Solo se permiten letras, números y guión bajo');
            return false;
        }
        
        if (field) this.clearFieldError(field);
        return true;
    },

    /**
     * Validar nombre
     */
    validateName(name, field = null) {
        if (!name || name.length < 2) {
            if (field) this.setFieldError(field, 'El nombre debe tener al menos 2 caracteres');
            return false;
        }
        
        if (field) this.clearFieldError(field);
        return true;
    },
    
    /**
     * Validar email
     */
    validateEmail(email, field = null) {
        if (!email) {
            if (field) this.setFieldError(field, CONFIG.MESSAGES.REQUIRED_FIELD);
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (field) this.setFieldError(field, CONFIG.MESSAGES.INVALID_EMAIL);
            return false;
        }
        
        if (field) this.clearFieldError(field);
        return true;
    },
    
    /**
     * Validar contraseña
     */
    validatePassword(password, field = null) {
        if (!password) {
            if (field) this.setFieldError(field, CONFIG.MESSAGES.REQUIRED_FIELD);
            return false;
        }
        
        if (password.length < 6) {
            if (field) this.setFieldError(field, CONFIG.MESSAGES.PASSWORD_MIN_LENGTH);
            return false;
        }
        
        if (field) this.clearFieldError(field);
        return true;
    },
    
    /**
     * Validar confirmación de contraseña
     */
    validateConfirmPassword(confirmPassword, field = null) {
        const password = document.getElementById('password')?.value;
        
        if (!confirmPassword) {
            if (field) this.setFieldError(field, CONFIG.MESSAGES.REQUIRED_FIELD);
            return false;
        }
        
        if (confirmPassword !== password) {
            if (field) this.setFieldError(field, CONFIG.MESSAGES.PASSWORDS_NOT_MATCH);
            return false;
        }
        
        if (field) this.clearFieldError(field);
        return true;
    },
    
    /**
     * Validar teléfono
     */
    validatePhone(phone, field = null) {
        if (!phone) return true; // Campo opcional
        
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            if (field) this.setFieldError(field, 'Ingresa un número de teléfono válido');
            return false;
        }
        
        if (field) this.clearFieldError(field);
        return true;
    },
    
    /**
     * Actualizar indicador de fortaleza de contraseña
     */
    updatePasswordStrength() {
        const password = document.getElementById('password').value;
        const strengthBar = document.getElementById('password-strength-bar');
        const strengthText = document.getElementById('password-strength-text');
        
        if (!password) {
            strengthBar.style.width = '0%';
            strengthText.textContent = '';
            return;
        }
        
        let strength = 0;
        let strengthLabel = '';
        let strengthClass = '';
        
        // Criterios de fortaleza
        if (password.length >= 6) strength += 20;
        if (password.length >= 8) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 10;
        if (/[^A-Za-z0-9]/.test(password)) strength += 10;
        
        // Determinar etiqueta y clase
        if (strength < 40) {
            strengthLabel = 'Débil';
            strengthClass = 'bg-danger';
        } else if (strength < 70) {
            strengthLabel = 'Media';
            strengthClass = 'bg-warning';
        } else {
            strengthLabel = 'Fuerte';
            strengthClass = 'bg-success';
        }
        
        // Actualizar UI
        strengthBar.style.width = `${strength}%`;
        strengthBar.className = `progress-bar ${strengthClass}`;
        strengthText.textContent = strengthLabel;
    },
    
    /**
     * Alternar visibilidad de contraseña
     */
    togglePasswordVisibility() {
        const passwordField = document.getElementById('password');
        const toggleIcon = document.querySelector('#toggle-password i');
        
        if (passwordField && toggleIcon) {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleIcon.className = 'fas fa-eye-slash text-muted';
            } else {
                passwordField.type = 'password';
                toggleIcon.className = 'fas fa-eye text-muted';
            }
        }
    },
    
    /**
     * Mostrar error en campo
     */
    setFieldError(field, message) {
        field.classList.add('is-invalid');
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        
        // Si es checkbox, buscar en el contenedor padre
        if (!feedback && field.type === 'checkbox') {
            feedback = field.closest('.form-check').querySelector('.invalid-feedback');
        }
        
        if (feedback) {
            feedback.textContent = message;
        }
    },
    
    /**
     * Limpiar error de campo
     */
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        
        // Si es checkbox, buscar en el contenedor padre
        if (!feedback && field.type === 'checkbox') {
            feedback = field.closest('.form-check').querySelector('.invalid-feedback');
        }
        
        if (feedback) {
            feedback.textContent = '';
        }
    },
    
    /**
     * Mostrar/ocultar loading
     */
    setLoading(loading) {
        const registerBtn = document.getElementById('register-btn');
        const btnText = registerBtn.querySelector('.btn-text');
        const btnLoading = registerBtn.querySelector('.btn-loading');
        
        if (loading) {
            registerBtn.disabled = true;
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            registerBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    },
    
    /**
     * Mostrar alerta
     */
    showAlert(message, type) {
        const alertsContainer = document.getElementById('register-alerts');
        const alertClass = type === 'success' ? 'alert-nexo-success' : 'alert-nexo-error';
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        alertsContainer.innerHTML = `
            <div class="alert alert-nexo ${alertClass} fade-in">
                <i class="${icon} me-2"></i>
                ${message}
            </div>
        `;
        
        // Solo auto-hide errores, no éxitos
        if (type === 'error') {
            setTimeout(() => {
                alertsContainer.innerHTML = '';
            }, 5000);
        }
    },

    /**
     * Mostrar mensaje de éxito con opciones de acción
     */
    showSuccessWithActions(message) {
        const alertsContainer = document.getElementById('register-alerts');
        
        alertsContainer.innerHTML = `
            <div class="alert alert-nexo alert-nexo-success fade-in">
                <div class="d-flex align-items-start">
                    <i class="fas fa-check-circle me-3 mt-1"></i>
                    <div class="flex-grow-1">
                        <h5 class="alert-heading mb-2">¡Registro Exitoso!</h5>
                        <p class="mb-3">${message}</p>
                        <div class="d-flex flex-wrap gap-2">
                            <button type="button" class="btn btn-success btn-sm" id="go-to-login">
                                <i class="fas fa-sign-in-alt me-1"></i>
                                Iniciar Sesión
                            </button>
                            <button type="button" class="btn btn-outline-success btn-sm" id="register-another">
                                <i class="fas fa-user-plus me-1"></i>
                                Registrar Otro Usuario
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregar event listeners a los botones
        setTimeout(() => {
            const goToLoginBtn = document.getElementById('go-to-login');
            const registerAnotherBtn = document.getElementById('register-another');
            
            if (goToLoginBtn) {
                goToLoginBtn.addEventListener('click', () => {
                    Router.navigate('/login');
                });
            }
            
            if (registerAnotherBtn) {
                registerAnotherBtn.addEventListener('click', () => {
                    this.clearForm();
                    this.clearAlerts();
                    // Focus en el primer campo
                    const firstNameField = document.getElementById('first_name');
                    if (firstNameField) firstNameField.focus();
                });
            }
        }, 100);
    },

    /**
     * Limpiar formulario
     */
    clearForm() {
        const form = document.getElementById('register-form');
        if (form) {
            form.reset();
            // Limpiar errores de validación
            const invalidFields = form.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => field.classList.remove('is-invalid'));
            const feedbacks = form.querySelectorAll('.invalid-feedback');
            feedbacks.forEach(feedback => feedback.textContent = '');
        }
    },
    
    /**
     * Limpiar alertas
     */
    clearAlerts() {
        const alertsContainer = document.getElementById('register-alerts');
        alertsContainer.innerHTML = '';
    }
};

// Exportar para uso global
window.RegisterComponent = RegisterComponent;