# ===================================
# SCRIPT DE INICIO - NEXO FRONTEND
# ===================================

Write-Host "🚀 NEXO FRONTEND - SERVIDOR DE DESARROLLO" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# Verificar si Python está instalado
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
    } else {
        throw "Python no encontrado"
    }
} catch {
    Write-Host "❌ Python no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "💡 Instala Python desde: https://python.org" -ForegroundColor Yellow
    exit 1
}

# Obtener la ruta actual del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$frontendPath = $scriptPath

Write-Host "📁 Directorio del frontend: $frontendPath" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (!(Test-Path "$frontendPath\index.html")) {
    Write-Host "❌ No se encontró index.html en el directorio actual" -ForegroundColor Red
    Write-Host "💡 Asegúrate de ejecutar este script desde la carpeta nexo-frontend" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Estructura del proyecto verificada" -ForegroundColor Green

# Puerto para el servidor
$port = 3000

# Verificar si el puerto está ocupado
try {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($connection) {
        Write-Host "⚠️ El puerto $port ya está en uso" -ForegroundColor Yellow
        
        # Preguntar si quiere usar otro puerto
        $newPort = Read-Host "Ingresa otro puerto (presiona Enter para usar 3001)"
        if ([string]::IsNullOrWhiteSpace($newPort)) {
            $port = 3001
        } else {
            $port = [int]$newPort
        }
    }
} catch {
    # El puerto está disponible
}

Write-Host "🌐 Iniciando servidor en puerto $port..." -ForegroundColor Green

# Cambiar al directorio del frontend
Set-Location $frontendPath

# Mostrar información útil
Write-Host ""
Write-Host "📋 INFORMACIÓN DEL SERVIDOR:" -ForegroundColor Yellow
Write-Host "   URL Frontend: http://localhost:$port" -ForegroundColor White
Write-Host "   URL Backend:  http://localhost:5000 (debe estar ejecutándose)" -ForegroundColor White
Write-Host "   Archivos:     $frontendPath" -ForegroundColor White
Write-Host ""
Write-Host "🔧 COMANDOS ÚTILES:" -ForegroundColor Yellow
Write-Host "   Ctrl+C        - Detener servidor" -ForegroundColor White
Write-Host "   F12           - Abrir DevTools en el navegador" -ForegroundColor White
Write-Host "   Ctrl+Shift+R  - Recarga forzada del navegador" -ForegroundColor White
Write-Host ""

# Intentar abrir el navegador automáticamente
Write-Host "🌐 Abriendo navegador automáticamente..." -ForegroundColor Green
Start-Process "http://localhost:$port"

Write-Host "🚀 Servidor iniciado. Presiona Ctrl+C para detener." -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Gray

try {
    # Iniciar servidor HTTP con Python
    python -m http.server $port
} catch {
    Write-Host "❌ Error al iniciar el servidor: $_" -ForegroundColor Red
    Write-Host "💡 Verifica que Python esté instalado correctamente" -ForegroundColor Yellow
} finally {
    Write-Host ""
    Write-Host "🛑 Servidor detenido" -ForegroundColor Yellow
    Write-Host "👋 ¡Gracias por usar Nexo!" -ForegroundColor Cyan
}