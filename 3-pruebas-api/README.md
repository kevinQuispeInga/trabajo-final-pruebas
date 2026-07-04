# Pruebas de API REST con Supertest y Vitest 🔌

Este proyecto contiene la automatización de pruebas sobre la API REST pública de **Restful-Booker** ([https://restful-booker.herokuapp.com/](https://restful-booker.herokuapp.com/)) utilizando la biblioteca **Supertest** combinada con **Vitest**.

## Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior).

## Instalación
Instala las dependencias necesarias:
```bash
npm install
```

## Ejecución de Pruebas
Para ejecutar las pruebas de endpoints de API:
```bash
npm test
```

## Casos de Prueba Implementados
* **Caso Base 1 (Integrante 1):** Autenticación (`POST /auth`) con credenciales válidas y verificación de obtención de token.
* **Caso Base 2 (Integrante 2):** Creación de una reserva (`POST /booking`) validando la estructura del JSON retornado y aserción de campos.
* **Caso Base 3 (Integrante 3):** Obtención de detalles de una reserva por ID (`GET /booking/:id`).
* **Caso IA (Caso 4):** Flujo completo de ciclo de vida: Actualización de reserva (`PUT /booking/:id`) y posterior eliminación (`DELETE /booking/:id`), validando con un GET que el recurso retorne 404.
