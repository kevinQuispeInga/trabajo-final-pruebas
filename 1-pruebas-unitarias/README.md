# Pruebas Unitarias con Vitest 🧪

Este subproyecto contiene las pruebas unitarias para la lógica interna de negocio de nuestra aplicación (cálculos de impuestos/IGV y validaciones de rango de fechas para reservas de habitaciones).

## Requisitos Previos
* tener instalado **Node.js** (versión 18 o superior).

## Instalación de Dependencias
Antes de ejecutar las pruebas por primera vez, debes instalar las dependencias del proyecto:
```bash
npm install
```

## Ejecución de Pruebas
Para ejecutar todas las pruebas unitarias y ver los resultados en la consola:
```bash
npm test
```

Si deseas ejecutar las pruebas en modo interactivo (watch mode), puedes usar:
```bash
npx vitest
```

## Estructura del Proyecto
* **`src/utils/calculator.js`**: Contiene la lógica para calcular el IGV (18%) y la aplicación de cupones de descuento.
* **`src/utils/dateValidator.js`**: Contiene la lógica para validar rangos de fechas (verificar que no estén en el pasado, orden cronológico y colisión/superposición de fechas).
* **`tests/businessLogic.test.js`**: Archivo de pruebas que incluye los 3 casos base de los integrantes del grupo y los 5 casos de cobertura extendida sugeridos por IA.
