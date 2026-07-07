import { test, expect } from '@playwright/test';

// Generar credenciales aleatorias para evitar colisiones en la base de datos pública
const uniqueId = Math.floor(Math.random() * 1000000);
const randomUsername = `user_esan_${uniqueId}`;
const randomPassword = 'password123';

test.describe('Pruebas Web con Playwright - DemoBlaze', () => {

  test('Caso Base 1 (Integrante 1 - Santiago Escalante): Navegar a Laptops, seleccionar una y verificar detalles', async ({ page }) => {
    // 1. Ir a la página de inicio
    await page.goto('/');
    
    // 2. Hacer clic en la categoría "Laptops"
    await page.click('a:has-text("Laptops")');
    
    // 3. Esperar que carguen las laptops y hacer clic en el primer elemento
    // En DemoBlaze, los productos se cargan dinámicamente. Esperamos un producto visible.
    const laptopLink = page.locator('.card-title a').first();
    await expect(laptopLink).toBeVisible({ timeout: 10000 });
    
    const laptopName = await laptopLink.innerText();
    await laptopLink.click();
    
    // 4. Verificar que estemos en la página de detalles y coincida el nombre
    await expect(page.locator('.name')).toContainText(laptopName, { timeout: 10000 });
    // Verificar que el precio esté visible
    await expect(page.locator('.price-container')).toBeVisible();
  });

  test('Caso Base 2 (Integrante 2 - Anthony Llerena): Agregar Laptop al carrito y aceptar alerta de confirmación', async ({ page }) => {
    // 1. Ir directamente a una laptop específica (ej. Sony vaio i5)
    await page.goto('/prod.html?idp_=8');

    // 2. Escuchar la alerta del navegador (Dialog) y aceptarla automáticamente
    let dialogMessage = '';
    page.on('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.accept();
    });

    // 3. Hacer clic en "Add to cart"
    await page.click('a:has-text("Add to cart")');

    // 4. Verificar que se disparó la alerta con el texto esperado
    // Se da una pequeña espera para que se procese la alerta
    await page.waitForTimeout(2000);
    expect(dialogMessage).toContain('Product added');
  });

  test('Caso Base 3 (Integrante 3 - Kevin Quispe): Registro de nuevo usuario (Sign Up)', async ({ page }) => {
    await page.goto('/');
    
    // 1. Abrir modal de Registro
    await page.click('#signin2');
    await page.waitForSelector('#signInModal', { state: 'visible' });
    
    // 2. Llenar formulario con credenciales aleatorias
    await page.fill('#sign-username', randomUsername);
    await page.fill('#sign-password', randomPassword);
    
    // 3. Configurar captura de la alerta de confirmación de registro
    let registerDialogMessage = '';
    page.on('dialog', async dialog => {
      registerDialogMessage = dialog.message();
      await dialog.accept();
    });
    
    // 4. Enviar registro
    await page.click('button[onclick="register()"]');
    await page.waitForTimeout(3000); // Esperar respuesta del backend de DemoBlaze
    
    // 5. Verificar que se completó con éxito
    expect(registerDialogMessage).toMatch(/Sign up successful|This user already exists/);
  });

  test('Caso IA 1: Flujo completo de Log In y mensaje de bienvenida con usuario registrado', async ({ page }) => {
    // Primero, nos aseguramos de registrar un usuario único para esta prueba
    const localUser = `ia_user_${Math.floor(Math.random() * 1000000)}`;
    
    // 1. Registro rápido del usuario local
    await page.goto('/');
    await page.click('#signin2');
    await page.waitForSelector('#signInModal', { state: 'visible' });
    await page.fill('#sign-username', localUser);
    await page.fill('#sign-password', randomPassword);
    
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    await page.click('button[onclick="register()"]');
    await page.waitForTimeout(2000);
    
    // Cerrar modal de registro si sigue abierto
    const closeBtn = page.locator('#signInModal .btn-secondary');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
    
    // 2. Abrir modal de Log In
    await page.click('#login2');
    await page.waitForSelector('#logInModal', { state: 'visible' });
    
    // 3. Ingresar las credenciales registradas
    await page.fill('#loginusername', localUser);
    await page.fill('#loginpassword', randomPassword);
    
    // 4. Enviar Log In
    await page.click('button[onclick="logIn()"]');
    
    // 5. Verificar el mensaje de bienvenida en la barra de navegación superior
    const welcomeText = page.locator('#nameofuser');
    await expect(welcomeText).toContainText(`Welcome ${localUser}`, { timeout: 15000 });
  });

});
