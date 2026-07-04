import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';
import { marked } from 'marked';

async function generate() {
  const mdPath = path.resolve('../informe-final/Final_Report.md');
  const pdfPath = path.resolve('../informe-final/Final_Report.pdf');
  
  if (!fs.existsSync(mdPath)) {
    console.error("No se encontró el archivo Final_Report.md en la ruta especificada.");
    return;
  }
  
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  
  // Convertimos el contenido Markdown a HTML
  const htmlContent = marked(mdContent);
  
  // Expresión regular para detectar la sección "1. Carátula"
  const regex = /<h2[^>]*>1\.\s+Car[áa]tula<\/h2>/i;
  const match = htmlContent.match(regex);
  
  let finalHtmlBody = '';
  if (match) {
    const splitIndex = htmlContent.indexOf(match[0]);
    const before = htmlContent.substring(0, splitIndex);
    const after = htmlContent.substring(splitIndex);
    
    // El contenido antes de "1. Carátula" es el bloque de presentación/títulos.
    // Lo colocamos dentro de un div .cover-page especial.
    finalHtmlBody = `
      <div class="cover-page">
        <div class="cover-inner">
          ${before}
        </div>
      </div>
      <div class="report-content">
        ${after}
      </div>
    `;
  } else {
    // Fallback en caso de no encontrar la carátula
    finalHtmlBody = `<div class="report-content">${htmlContent}</div>`;
  }
  
  // Creamos una plantilla HTML elegante con estilos optimizados para impresión A4 sin solapamientos
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Informe Final - Prueba de Software</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
        
        body {
          font-family: 'Outfit', 'Inter', sans-serif;
          line-height: 1.6;
          color: #2d3748;
          margin: 0;
          padding: 0;
          font-size: 11pt;
        }
        
        /* Portada limpia para PDF sin 100vh (evita saltos y páginas en blanco) */
        .cover-page {
          padding: 40px;
          border-left: 12px solid #1a365d;
          background: #fafafa;
          page-break-after: always;
          box-sizing: border-box;
          /* Dejamos un margen inferior para asegurar el corte antes de la siguiente página */
          margin-bottom: 50px; 
        }
        
        .cover-page h1 {
          font-size: 24pt;
          color: #1a365d;
          margin: 0 0 10px 0;
          font-weight: 700;
          border: none;
          padding: 0;
          line-height: 1.2;
        }
        
        .cover-page h2 {
          font-size: 16pt;
          color: #4b5563;
          margin: 10px 0 20px 0;
          font-weight: 300;
          border: none;
          padding: 0;
        }
        
        .cover-page h3 {
          font-size: 13pt;
          color: #2563eb;
          margin: 20px 0 10px 0;
          font-weight: 600;
        }
        
        .cover-page ol, .cover-page ul {
          list-style-type: none;
          padding: 0;
          margin: 10px 0;
        }
        
        .cover-page li {
          font-size: 11pt;
          margin-bottom: 6px;
          color: #4b5563;
        }
        
        .cover-page hr {
          border: 0;
          height: 1px;
          background: #e5e7eb;
          margin: 30px 0;
        }
        
        /* Estilos generales del reporte */
        .report-content {
          padding: 20px 40px;
        }
        
        h1, h2, h3, h4 {
          color: #1a365d;
          font-family: 'Outfit', sans-serif;
        }
        
        h1 {
          font-size: 18pt;
          border-bottom: 2px solid #2b6cb0;
          padding-bottom: 8px;
          margin-top: 40px;
          page-break-before: always;
        }
        
        /* Evitamos salto de página antes del primer título del contenido */
        .report-content > h1:first-of-type,
        .report-content > h2:first-of-type {
          page-break-before: avoid;
          margin-top: 20px;
        }
        
        h2 {
          font-size: 14pt;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 4px;
          margin-top: 30px;
        }
        
        h3 {
          font-size: 12pt;
          margin-top: 20px;
        }
        
        p, li {
          text-align: justify;
        }
        
        code {
          background-color: #f7fafc;
          color: #e53e3e;
          padding: 2px 5px;
          border-radius: 4px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 9.5pt;
          border: 1px solid #edf2f7;
        }
        
        pre {
          background-color: #f7fafc;
          padding: 15px;
          border-radius: 6px;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          margin: 15px 0;
        }
        
        pre code {
          background-color: transparent;
          color: #2d3748;
          border: none;
          padding: 0;
          font-size: 9pt;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 10pt;
        }
        
        th, td {
          border: 1px solid #cbd5e0;
          padding: 8px 12px;
          text-align: left;
        }
        
        th {
          background-color: #f7fafc;
          color: #1a365d;
          font-weight: 600;
        }
        
        tr:nth-child(even) {
          background-color: #fafafa;
        }
        
        ul, ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        li {
          margin-bottom: 5px;
        }
        
        blockquote {
          margin: 15px 0;
          padding: 10px 15px;
          border-left: 4px solid #3182ce;
          background-color: #ebf8ff;
          color: #2b6cb0;
          border-radius: 0 4px 4px 0;
        }
      </style>
    </head>
    <body>
      ${finalHtmlBody}
    </body>
    </html>
  `;
  
  const tempHtmlPath = path.resolve('./temp_report.html');
  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf-8');
  
  console.log("Iniciando navegador Chromium en segundo plano...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Cargando reporte formateado...");
  await page.goto('file://' + tempHtmlPath);
  
  console.log("Generando PDF estructurado en formato A4...");
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '15mm',
      right: '15mm'
    },
    printBackground: true
  });
  
  await browser.close();
  fs.unlinkSync(tempHtmlPath);
  console.log(`¡Éxito! El archivo PDF ha sido generado y guardado en: ${pdfPath}`);
}

generate().catch(err => {
  console.error("Error al generar el PDF:", err);
});
