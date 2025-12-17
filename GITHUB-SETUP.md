# 📋 INSTRUCCIONES PARA CREAR REPOSITORIO EN GITHUB

## 🎯 REPOSITORIO: nexo-frontend

### Paso 1: Crear el repositorio en GitHub.com

1. **Ir a GitHub**: Visita https://github.com y haz login
2. **Nuevo repositorio**: Clic en el botón verde "New" o el ícono "+"
3. **Configuración del repositorio**:
   - **Nombre**: `nexo-frontend`
   - **Descripción**: `Frontend SPA moderno para Nexo - Red social con Bootstrap, JavaScript y autenticación JWT`
   - **Visibilidad**: Público ✅ (o Privado según prefieras)
   - **NO marcar**: "Add a README file" (ya tienes uno)
   - **NO marcar**: "Add .gitignore" (ya tienes uno)
   - **NO marcar**: "Choose a license" (puedes añadirlo después)

4. **Crear**: Clic en "Create repository"

### Paso 2: Conectar tu repositorio local con GitHub

Una vez creado el repositorio, GitHub te mostrará las instrucciones. 
**Usa la segunda opción** "…or push an existing repository from the command line":

```bash
git remote add origin https://github.com/TU_USUARIO/nexo-frontend.git
git branch -M main
git push -u origin main
```

### Paso 3: Ejecutar los comandos desde VS Code

**Copia y ejecuta estos comandos uno por uno en la terminal de VS Code:**

```powershell
# 1. Añadir el repositorio remoto (reemplaza TU_USUARIO con tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/nexo-frontend.git

# 2. Cambiar el branch principal a 'main'
git branch -M main

# 3. Subir el código al repositorio
git push -u origin main
```

### 🔍 Verificar que todo esté correcto

Después de hacer el push, deberías poder ver:
- ✅ Todos los archivos del frontend en GitHub
- ✅ El README.md con la documentación completa
- ✅ El historial de commits con el mensaje inicial
- ✅ 21 archivos con ~6000 líneas de código

### 📂 Estructura que se subirá:

```
nexo-frontend/
├── 📄 index.html              # Página principal SPA
├── 📄 package.json            # Configuración del proyecto
├── 📄 README.md              # Documentación completa
├── 📄 .gitignore             # Archivos ignorados
├── 📄 start-server.ps1       # Script de servidor
├── 📁 assets/
│   ├── 📁 css/
│   │   └── styles.css        # Estilos personalizados
│   ├── 📁 img/
│   │   └── default-avatar.png
│   └── 📁 js/
│       ├── 📄 config.js      # Configuración global
│       ├── 📄 router.js      # Sistema de routing SPA
│       ├── 📄 auth.js        # Autenticación JWT
│       ├── 📄 api.js         # Cliente HTTP
│       ├── 📄 app.js         # Inicialización
│       ├── 📄 utils.js       # Utilidades
│       ├── 📁 components/
│       │   ├── navbar.js     # Navegación
│       │   └── footer.js     # Pie de página
│       └── 📁 pages/
│           ├── home.js       # Página de inicio
│           ├── login.js      # Login
│           ├── register.js   # Registro
│           ├── profile.js    # Perfil
│           ├── friends.js    # Amigos
│           └── users.js      # Usuarios
```

### 🎉 ¡LISTO!

Una vez completado, tendrás:
- ✅ Repositorio público/privado en GitHub
- ✅ Código fuente completo del frontend
- ✅ Documentación profesional
- ✅ Historial de cambios
- ✅ Listo para colaboración y despliegue

### 📞 ¿Necesitas ayuda?

Si encuentras algún problema:
1. Verifica que tu usuario de GitHub esté bien escrito en la URL
2. Asegúrate de tener permisos para crear repositorios
3. Si te pide autenticación, usa tu token de acceso personal de GitHub

---
**Creado con 💚 para el proyecto Nexo**