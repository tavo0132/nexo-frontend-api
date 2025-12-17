# 🤝 Contribuir a Nexo Frontend

¡Gracias por tu interés en contribuir al proyecto Nexo Frontend! Este documento te guiará a través del proceso de contribución.

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [Proceso de Desarrollo](#proceso-de-desarrollo)
5. [Guías de Estilo](#guías-de-estilo)
6. [Reportar Bugs](#reportar-bugs)
7. [Sugerir Mejoras](#sugerir-mejoras)

## 🤖 Código de Conducta

Este proyecto adhiere al [Contributor Covenant](https://www.contributor-covenant.org/). Al participar, se espera que mantengas este código.

## 🚀 ¿Cómo puedo contribuir?

### Tipos de Contribuciones Bienvenidas:

- 🐛 **Reportar Bugs**
- 💡 **Sugerir nuevas características**
- 📝 **Mejorar documentación**
- 🔧 **Corregir bugs**
- ✨ **Implementar nuevas características**
- 🎨 **Mejorar UI/UX**
- ⚡ **Optimizar rendimiento**

## ⚙️ Configuración del Entorno

### Pre-requisitos:
- Git instalado
- Python 3.8+ (para servidor de desarrollo)
- Editor de código (VS Code recomendado)
- Navegador web moderno

### Configuración inicial:

```bash
# 1. Fork el repositorio en GitHub
# 2. Clona tu fork
git clone https://github.com/tu-usuario/nexo-frontend-api.git
cd nexo-frontend-api

# 3. Configura el repositorio upstream
git remote add upstream https://github.com/tavo0132/nexo-frontend-api.git

# 4. Instala dependencias (si las hay)
# En este proyecto no hay dependencias npm, pero mantén actualizado Python

# 5. Inicia el servidor de desarrollo
python -m http.server 8000
```

## 🛠️ Proceso de Desarrollo

### 1. Crear una nueva rama:
```bash
git checkout -b feature/nombre-de-la-caracteristica
# o
git checkout -b bugfix/descripcion-del-bug
```

### 2. Hacer cambios:
- Escribe código limpio y bien comentado
- Sigue las guías de estilo del proyecto
- Prueba tus cambios localmente

### 3. Commit de cambios:
```bash
git add .
git commit -m "tipo: descripción breve del cambio

Descripción más detallada si es necesario.

Fixes #123" # si resuelve un issue
```

### Tipos de commit:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan funcionalidad)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

### 4. Push y Pull Request:
```bash
git push origin feature/nombre-de-la-caracteristica
```
Luego crea un Pull Request en GitHub.

## 🎨 Guías de Estilo

### JavaScript:
- Usa ES6+ features
- Nombres de variables en camelCase
- Nombres de constantes en UPPER_CASE
- Funciones arrow cuando sea apropiado
- Comentarios JSDoc para funciones públicas

```javascript
/**
 * Autentica un usuario con credenciales
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const authenticateUser = async (email, password) => {
    // Implementación
};
```

### CSS:
- Usa CSS custom properties (variables)
- Nomenclatura BEM para clases
- Mobile-first approach
- Comentarios para secciones importantes

```css
/* === COMPONENTE NAVBAR === */
.navbar {
    --navbar-bg: var(--primary-color);
    background-color: var(--navbar-bg);
}

.navbar__brand {
    font-weight: bold;
}

.navbar__item--active {
    color: var(--accent-color);
}
```

### HTML:
- HTML5 semántico
- Atributos alt en imágenes
- Estructura accesible (ARIA labels cuando sea necesario)

## 🐛 Reportar Bugs

### Antes de reportar:
1. Verifica que no sea un bug ya reportado
2. Asegúrate de que no es un problema de configuración local
3. Prueba con la última versión

### Al reportar:
- Usa el template de issue para bugs
- Incluye pasos para reproducir
- Adjunta capturas de pantalla si es visual
- Especifica navegador y versión
- Incluye logs de consola si hay errores

## 💡 Sugerir Mejoras

### Para nuevas características:
- Usa el template de feature request
- Explica el problema que resuelve
- Describe la solución propuesta
- Considera alternativas
- Añade mockups o wireframes si es UI

### Criterios de aceptación:
- ✅ Mejora la experiencia del usuario
- ✅ Es técnicamente viable
- ✅ Se alinea con los objetivos del proyecto
- ✅ No introduce complejidad innecesaria

## 📝 Pull Request Process

### Lista de verificación:
- [ ] El código compila sin errores
- [ ] Se han probado los cambios localmente
- [ ] La documentación está actualizada si es necesario
- [ ] El commit sigue las convenciones
- [ ] Se resolvieron conflictos de merge si los hay

### Revisión:
1. Al menos 1 reviewer debe aprobar
2. Todos los checks automáticos deben pasar
3. El código debe seguir las guías de estilo
4. Los cambios deben estar bien documentados

## 🏷️ Labels de Issues

- `bug`: Errores de funcionamiento
- `enhancement`: Nuevas características
- `documentation`: Mejoras en docs
- `good first issue`: Perfecto para nuevos colaboradores
- `help wanted`: Se busca ayuda de la comunidad
- `priority-high`: Alta prioridad
- `ui/ux`: Relacionado con interfaz de usuario

## 🎉 Reconocimiento

Los contribuidores serán reconocidos en:
- README.md (sección Contributors)
- CHANGELOG.md (por versión)
- Releases de GitHub

## 📞 ¿Preguntas?

- 💬 Abre un issue con la etiqueta `question`
- 📧 Contacta a [tavo0132@gmail.com](mailto:tavo0132@gmail.com)
- 🐦 Sígueme en GitHub [@tavo0132](https://github.com/tavo0132)

---

**¡Gracias por hacer Nexo Frontend mejor para todos! 🚀**