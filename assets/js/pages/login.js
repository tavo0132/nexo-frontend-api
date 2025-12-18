// ===================================
// NEXO FRONTEND - LOGIN PAGE COMPONENT
// ===================================

const LoginComponent = {
    /**
     * Renderizar página de login
     */
    async render() {
        return `
            <div class="container-fluid">
                <div class="row min-vh-100">
                    <!-- Panel izquierdo - Información -->
                    <div class="col-lg-6 bg-nexo-gradient d-flex align-items-center">
                        <div class="container text-white text-center">
                            <div class="fade-in">
                                <i class="fas fa-network-wired display-1 mb-4 opacity-75"></i>
                                <h1 class="display-4 fw-bold mb-4">
                                    Bienvenido a Nexo
                                </h1>
                                <p class="lead mb-4">
                                    Conecta con personas increíbles, comparte momentos únicos 
                                    y construye relaciones que durarán toda la vida.
                                </p>
                                <div class="d-flex justify-content-center">
                                    <div class="text-start">
                                        <div class="d-flex align-items-center mb-2">
                                            <i class="fas fa-check-circle me-3"></i>
                                            <span>Conexiones auténticas</span>
                                        </div>
                                        <div class="d-flex align-items-center mb-2">
                                            <i class="fas fa-check-circle me-3"></i>
                                            <span>Privacidad y seguridad</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-check-circle me-3"></i>
                                            <span>Comunidad global</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Panel derecho - Formulario -->
                    <div class="col-lg-6 d-flex align-items-center">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-8 col-lg-6">
                                    <div class="slide-in-right">
                                        <!-- Header -->
                                        <div class="text-center mb-5">
                                            <h2 class="fw-bold text-nexo-blue">Iniciar Sesión</h2>
                                            <p class="text-muted">
                                                Ingresa a tu cuenta para continuar
                                            </p>
                                        </div>
                                        
                                        <!-- Alertas -->
                                        <div id="login-alerts"></div>
                                        
                                        <!-- Formulario -->
                                        <form id="login-form" novalidate>
                                            <!-- Email -->
                                            <div class="mb-3">
                                                <label for="email" class="form-label form-label-nexo">
                                                    <i class="fas fa-envelope me-1"></i>
                                                    Correo Electrónico
                                                </label>
                                                <input type="email" 
                                                       class="form-control form-control-nexo" 
                                                       id="email" 
                                                       name="email"
                                                       placeholder="tu@email.com"
                                                       required>
                                                <div class="invalid-feedback"></div>
                                            </div>
                                            
                                            <!-- Password -->
                                            <div class="mb-3">
                                                <label for="password" class="form-label form-label-nexo">
                                                    <i class="fas fa-lock me-1"></i>
                                                    Contraseña
                                                </label>
                                                <div class="position-relative">
                                                    <input type="password" 
                                                           class="form-control form-control-nexo" 
                                                           id="password" 
                                                           name="password"
                                                           placeholder="Tu contraseña"
                                                           required>
                                                    <button type="button" 
                                                            class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3" 
                                                            id="toggle-password"
                                                            tabindex="-1">
                                                        <i class="fas fa-eye text-muted"></i>
                                                    </button>
                                                </div>
                                                <div class="invalid-feedback"></div>
                                            </div>
                                            
                                            <!-- Remember me -->
                                            <div class="mb-4 form-check">
                                                <input type="checkbox" 
                                                       class="form-check-input" 
                                                       id="remember-me">
                                                <label class="form-check-label text-muted" for="remember-me">
                                                    Mantener sesión iniciada
                                                </label>
                                            </div>
                                            
                                            <!-- Submit button -->
                                            <button type="submit" 
                                                    class="btn btn-nexo w-100 mb-3" 
                                                    id="login-btn">
                                                <span class="btn-text">
                                                    <i class="fas fa-sign-in-alt me-2"></i>
                                                    Iniciar Sesión
                                                </span>
                                                <span class="btn-loading d-none">
                                                    <span class="loading-spinner me-2"></span>
                                                    Ingresando...
                                                </span>
                                            </button>
                                            
                                            <!-- Forgot password -->
                                            <div class="text-center mb-3">
                                                <a href="#" class="text-nexo-light-blue text-decoration-none">
                                                    ¿Olvidaste tu contraseña?
                                                </a>
                                            </div>
                                        </form>
                                        
                                        <!-- Divider -->
                                        <div class="text-center">
                                            <hr class="my-4">
                                            <p class="text-muted">
                                                ¿No tienes una cuenta?
                                                <a href="/register" class="text-nexo-blue fw-bold text-decoration-none">
                                                    Regístrate aquí
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
     * Inicializar página de login
     */
    async init() {
        this.attachEventListeners();
        this.setupValidation();
        
        // Focus en el primer campo
        setTimeout(() => {
            const emailField = document.getElementById('email');
            if (emailField) emailField.focus();
        }, 100);
    },
    
    /**
     * Adjuntar event listeners
     */
    attachEventListeners() {
        // Formulario de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        
        // Toggle password visibility
        const togglePassword = document.getElementById('toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
        }
        
        // Limpiar errores al escribir
        const inputs = document.querySelectorAll('#login-form input');
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
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (emailField) {
            emailField.addEventListener('blur', () => {
                this.validateEmail(emailField.value, emailField);
            });
        }
        
        if (passwordField) {
            passwordField.addEventListener('blur', () => {
                this.validatePassword(passwordField.value, passwordField);
            });
        }
    },
    
    /**
     * Manejar envío del formulario
     */
    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email').trim();
        const password = formData.get('password');
        
        // Validar formulario
        if (!this.validateForm(email, password)) {
            return;
        }
        
        // Mostrar loading
        this.setLoading(true);
        this.clearAlerts();
        
        try {
            // Intentar login
            const result = await Auth.login(email, password);
            
            if (result.success) {
                // Mostrar éxito
                this.showAlert(result.message, 'success');
                
                // Redirigir al feed después de un momento
                setTimeout(() => {
                    Router.navigate('/feed');
                }, 1000);
            } else {
                // Mostrar error
                this.showAlert(result.message, 'error');
            }
        } catch (error) {
            CONFIG.log('Login error: ' + error.message, 'error');
            this.showAlert(CONFIG.MESSAGES.LOGIN_ERROR, 'error');
        } finally {
            this.setLoading(false);
        }
    },
    
    /**
     * Validar formulario completo
     */
    validateForm(email, password) {
        let isValid = true;
        
        // Validar email
        if (!this.validateEmail(email)) {
            isValid = false;
        }
        
        // Validar password
        if (!this.validatePassword(password)) {
            isValid = false;
        }
        
        return isValid;
    },
    
    /**
     * Validar email
     */
    validateEmail(email, field = null) {
        const emailField = field || document.getElementById('email');
        
        if (!email) {
            this.setFieldError(emailField, CONFIG.MESSAGES.REQUIRED_FIELD);
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setFieldError(emailField, CONFIG.MESSAGES.INVALID_EMAIL);
            return false;
        }
        
        this.clearFieldError(emailField);
        return true;
    },
    
    /**
     * Validar password
     */
    validatePassword(password, field = null) {
        const passwordField = field || document.getElementById('password');
        
        if (!password) {
            this.setFieldError(passwordField, CONFIG.MESSAGES.REQUIRED_FIELD);
            return false;
        }
        
        if (password.length < 6) {
            this.setFieldError(passwordField, CONFIG.MESSAGES.PASSWORD_MIN_LENGTH);
            return false;
        }
        
        this.clearFieldError(passwordField);
        return true;
    },
    
    /**
     * Mostrar error en campo
     */
    setFieldError(field, message) {
        field.classList.add('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    },
    
    /**
     * Limpiar error de campo
     */
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = '';
        }
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
     * Mostrar/ocultar loading
     */
    setLoading(loading) {
        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        
        if (loading) {
            loginBtn.disabled = true;
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            loginBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    },
    
    /**
     * Mostrar alerta
     */
    showAlert(message, type) {
        const alertsContainer = document.getElementById('login-alerts');
        const alertClass = type === 'success' ? 'alert-nexo-success' : 'alert-nexo-error';
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        alertsContainer.innerHTML = `
            <div class="alert alert-nexo ${alertClass} fade-in">
                <i class="${icon} me-2"></i>
                ${message}
            </div>
        `;
        
        // Auto-hide después de unos segundos
        if (type === 'success') {
            setTimeout(() => {
                alertsContainer.innerHTML = '';
            }, 3000);
        }
    },
    
    /**
     * Limpiar alertas
     */
    clearAlerts() {
        const alertsContainer = document.getElementById('login-alerts');
        alertsContainer.innerHTML = '';
    }
};

// Exportar para uso global
window.LoginComponent = LoginComponent;