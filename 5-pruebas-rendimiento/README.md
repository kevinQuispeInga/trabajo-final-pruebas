# Pruebas de Rendimiento con Artillery ⚡

Este proyecto contiene la configuración para realizar pruebas de carga y estrés sobre los endpoints de **Restful-Booker** ([https://restful-booker.herokuapp.com/](https://restful-booker.herokuapp.com/)).

## Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior).

## Instalación
Instala Artillery de manera local en el directorio del proyecto:
```bash
npm install
```

## Ejecución de Pruebas

### 1. Ejecutar prueba de carga básica
Para ejecutar la prueba de carga y ver los percentiles de rendimiento en tiempo real en la terminal:
```bash
npx artillery run load-test.yml
```

### 2. Generar Reporte Visual (HTML)
Para guardar las métricas de la ejecución en un archivo JSON y luego generar un reporte interactivo en HTML que puedas abrir en tu navegador:
```bash
# Ejecutar y guardar resultados
npx artillery run load-test.yml --output report.json

# Convertir JSON a reporte HTML
npx artillery report report.json
```
Esto creará un archivo `.html` (ej. `report.json.html`) con gráficos interactivos de tasa de peticiones, latencias (median, p95, p99) y códigos de estado.

## Escenario de Carga Definido
El archivo `load-test.yml` establece tres fases consecutivas de estrés:
1. **Calentamiento (Warm-up):** 2 usuarios virtuales/seg por 20 segundos.
2. **Crecimiento (Ramp-up):** Incremento de 2 a 10 usuarios virtuales/seg por 30 segundos.
3. **Carga Sostenida (Cruise):** 10 usuarios virtuales/seg sostenidos por 30 segundos.

Cada usuario ejecuta dos peticiones secuenciales:
1. Consulta la lista de reservas existentes (`GET /booking`).
2. Crea una reserva ficticia (`POST /booking`).
