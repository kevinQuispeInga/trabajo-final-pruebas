# Pruebas Web UI con Playwright 💻

Este proyecto contiene la automatización de flujos de interfaz de usuario sobre el sitio web **DemoBlaze** ([https://www.demoblaze.com/](https://www.demoblaze.com/)).

## Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior).

## Instalación
1. Instala las dependencias de Node:
   ```bash
   npm install
   ```
2. Instala el navegador Chromium que usará Playwright:
   ```bash
   npx playwright install chromium
   ```

## Ejecución de Pruebas
Para ejecutar las pruebas en segundo plano (modo Headless):
```bash
npx playwright test
```

### Ejecución en Modo Interactivo (UI Mode)
Para ver la ejecución paso a paso en tiempo real y depurar visualmente los selectores:
```bash
npx playwright test --ui
```

## Casos de Prueba Implementados
* **Caso Base 1 (Integrante 1):** Navegación a la sección de Laptops, selección de una laptop y verificación de la carga en la página de detalles.
* **Caso Base 2 (Integrante 2):** Selección de una laptop, agregar al carrito de compras y aceptación de la alerta emergente de confirmación de Playwright.
* **Caso Base 3 (Integrante 3):** Registro de un nuevo usuario con credenciales autogeneradas aleatoriamente.
* **Caso IA (Caso 4):** Inicio de sesión (Log In) exitoso con validación del mensaje de bienvenida "Welcome [usuario]".
