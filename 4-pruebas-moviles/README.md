# Pruebas Móviles con Maestro Framework 📱

Este directorio contiene los scripts declarativos en formato `.yaml` para automatizar pruebas sobre el aplicativo móvil **Fliptronics APK** en un entorno emulado (Android).

## Requisitos Previos
1. Tener un emulador de Android activo (por ejemplo, mediante Android Studio AVD o Genymotion).
2. Tener instalado el **Maestro CLI** en el sistema.
   * *Instalación en Windows (mediante PowerShell o WSL):* 
     ```bash
     curl -FsSL https://get.maestro.mobile.dev | bash
     ```
3. Instalar la APK de **Fliptronics** en tu emulador de Android (puedes descargarla de [https://github.com/vansh-121/Fliptronics](https://github.com/vansh-121/Fliptronics)).

## Ejecución de Pruebas
Asegúrate de que tu emulador de Android esté encendido e identificado por `adb devices`. Luego, ejecuta cualquiera de los flujos YAML usando el comando `maestro test`:

### 1. Flujo de Navegación por Categorías (Integrante 1)
```bash
maestro test base_categories.yaml
```

### 2. Flujo de Búsqueda de Productos (Integrante 2)
```bash
maestro test base_search.yaml
```

### 3. Flujo de Carrito de Compras (Integrante 3)
```bash
maestro test base_cart.yaml
```

### 4. Flujo Completo de Checkout (IA Caso)
```bash
maestro test ai_checkout.yaml
```

## Estructura de los Scripts
Los scripts utilizan comandos declarativos de Maestro como `tapOn`, `inputText`, `assertVisible` y `waitForAnimationToEnd` para interactuar de forma nativa con los elementos de la interfaz en Flutter.
