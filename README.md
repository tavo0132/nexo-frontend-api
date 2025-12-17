# Nexo Frontend

Frontend de la red social Nexo desarrollado con HTML5, CSS3, Bootstrap 5 y JavaScript vanilla ES6+.

## 🚀 Características

- **SPA (Single Page Application)** con routing personalizado
- **Diseño responsive** con Bootstrap 5
- **Autenticación JWT** integrada con el backend
- **Componentes modulares** y reutilizables
- **Gestión de estado** en el lado cliente
- **Manejo de errores** robusto
- **Temas personalizados** con variables CSS

## 📁 Estructura del Proyecto

```
nexo-frontend/
├── index.html              # Página principal
├── README.md              # Este archivo
├── assets/
│   ├── css/
│   │   └── styles.css     # Estilos personalizados
│   └── js/
│       ├── config.js      # Configuración global
│       ├── router.js      # Sistema de routing SPA
│       ├── auth.js        # Autenticación
│       ├── api.js         # Cliente API
│       ├── app.js         # Aplicación principal
│       ├── components/    # Componentes reutilizables
│       │   ├── navbar.js
│       │   └── footer.js
│       └── pages/         # Páginas de la aplicación
│           ├── home.js
│           ├── login.js
│           ├── register.js
│           ├── profile.js
│           └── friends.js
```

## 🛠 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **JavaScript ES6+** - Lógica de la aplicación
- **Bootstrap 5.3** - Framework CSS
- **Font Awesome 6.4** - Iconos
- **Fetch API** - Comunicación con el backend

## 🔧 Configuración

### Configuración de la API

Edita el archivo `assets/js/config.js` para configurar la URL del backend:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:5000', // Cambia por tu URL del backend
    // ... resto de configuración
};
```

### Variables de Entorno

El frontend se conecta por defecto a:
- **Backend API**: `http://localhost:5000`
- **Puerto recomendado**: `3000` (para servidor de desarrollo)

## 🚀 Instalación y Uso

### Opción 1: Servidor Web Simple

1. **Clona o descarga** el proyecto en tu carpeta de frontend
2. **Instala un servidor web simple** (recomendado):
   ```bash
   # Con Python 3
   python -m http.server 3000
   
   # Con Node.js (http-server)
   npx http-server -p 3000
   
   # Con PHP
   php -S localhost:3000
   ```
3. **Abre tu navegador** en `http://localhost:3000`

### Opción 2: Live Server (VS Code)

1. **Instala** la extensión "Live Server" en VS Code
2. **Clic derecho** en `index.html`
3. **Selecciona** "Open with Live Server"

### Opción 3: Servidor Web Tradicional

1. **Copia** todos los archivos a tu servidor web (Apache, Nginx, etc.)
2. **Configura** el servidor para servir archivos estáticos
3. **Accede** a la URL de tu servidor

## 📱 Páginas Implementadas

### ✅ Páginas Completadas

- **🏠 Inicio** (`/`) - Landing page con información de la app
- **🔐 Login** (`/login`) - Iniciar sesión
- **📝 Registro** (`/register`) - Crear nueva cuenta
- **👤 Perfil** (`/profile`) - Ver y editar perfil personal
- **👥 Amigos** (`/friends`) - Gestionar amistades y solicitudes

### 🔄 En Desarrollo

- **🔍 Buscar Usuarios** (`/users`) - Buscar y conectar con personas
- **ℹ️ Acerca de** (`/about`) - Información de la aplicación
- **📞 Contacto** (`/contact`) - Información de contacto

## 🔌 Integración con Backend

El frontend se integra con el backend de Nexo a través de los siguientes endpoints:

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/refresh` - Refrescar token

### Usuarios
- `GET /users/profile` - Obtener perfil del usuario
- `PUT /users/profile` - Actualizar perfil
- `POST /users/upload-avatar` - Subir avatar

### Amistades
- `GET /friends` - Obtener lista de amigos
- `GET /friends/requests` - Obtener solicitudes de amistad
- `POST /friends/send-request` - Enviar solicitud
- `POST /friends/accept-request` - Aceptar solicitud
- `POST /friends/reject-request` - Rechazar solicitud
- `DELETE /friends/remove-friend/:id` - Eliminar amigo

## 🎨 Personalización

### Colores y Temas

Los colores principales se definen en `assets/css/styles.css`:

```css
:root {
  --nexo-blue: #2c3e50;
  --nexo-light-blue: #3498db;
  --nexo-orange: #e67e22;
  --nexo-green: #27ae60;
  --nexo-red: #e74c3c;
}
```

### Componentes

Cada componente es un objeto JavaScript con métodos:
- `render()` - Retorna HTML del componente
- `init()` - Inicializa eventos y funcionalidad
- Métodos específicos del componente

## 📱 Responsive Design

El frontend está optimizado para:
- 📱 **Móviles** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥 **Large screens** (1200px+)

## 🔒 Seguridad

- **Validación** de formularios en cliente y servidor
- **Sanitización** de inputs del usuario
- **Tokens JWT** para autenticación
- **HTTPS** recomendado en producción
- **CSP Headers** recomendados

## 🐛 Debugging

### Consola del Navegador

El frontend incluye logs de debug:
```javascript
// Activar/desactivar debug en config.js
DEBUG: true
```

### Comandos de Consola

- `getAppInfo()` - Información de la aplicación
- `reinitializeApp()` - Reinicializar aplicación
- `nexo` - Información del desarrollador

## 📚 Documentación Adicional

### Estructura de Componentes

```javascript
const MyComponent = {
    async render() {
        return `<div>HTML content</div>`;
    },
    
    async init() {
        this.attachEventListeners();
    },
    
    attachEventListeners() {
        // Event listeners aquí
    }
};
```

### Sistema de Routing

```javascript
// Navegar programáticamente
Router.navigate('/profile');

// Obtener ruta actual
const currentRoute = Router.getCurrentRoute();
```

### Manejo de API

```javascript
// Llamada a la API
try {
    const data = await API.get('/users');
    console.log(data);
} catch (error) {
    console.error('API Error:', error);
}
```

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea** un Pull Request

## 📄 Licencia

Este proyecto es parte del curso de Desarrollo Web y está disponible para fines educativos.

## 👨‍💻 Autor

Desarrollado como parte del proyecto Nexo - Red Social.

---

### 📋 Notas de Desarrollo

**Etapa Actual**: Setup base y Layout con Bootstrap ✅  
**Próxima Etapa**: Funcionalidades avanzadas y optimización  
**Estado**: Funcional para demo y desarrollo  

Para más información sobre el backend, consulta el repositorio `nexo-backend`.