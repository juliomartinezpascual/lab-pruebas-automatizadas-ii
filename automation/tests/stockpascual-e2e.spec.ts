import { test, expect } from '@playwright/test';

test.describe('StockPascual - Flujo E2E de inventario', () => {

  test('Admin puede crear un producto y registrar entradas y salidas', async ({ page }) => {

    // Datos dinámicos de la prueba
    const sku = `E2E-${Date.now()}`;
    const nombreProducto = `Producto automatizado ${sku}`;

    const stockInicial = 5;
    const cantidadEntrada = 10;
    const cantidadSalida = 4;
    const stockEsperado = stockInicial + cantidadEntrada - cantidadSalida; // 11
    const stockMinimo = 10;

    // 1. Abrir aplicación
    await page.goto('http://localhost:3080');

    // 2. Iniciar sesión
    await page.getByLabel(/usuario|correo/i).fill('admin');
    await page.getByLabel(/contraseña|password/i).fill('Admin123!');
    await page.getByRole('button', { name: /iniciar sesión|ingresar|login/i }).click();

    await expect(
      page.getByRole('button', { name: /cerrar sesión|salir|logout/i })
    ).toBeVisible();

    // 3. Acceder al módulo de productos
    await page.getByRole('button', { name: 'Productos', exact: true }).click();

    // 4. Crear producto
    await page.getByRole('button', { name: /\+ Producto/i }).click();

    await page.getByLabel(/sku/i).fill(sku);
    await page.getByLabel(/nombre/i).fill(nombreProducto);
    await page.getByLabel(/categoría/i).fill('Laboratorio'); 
    await page.getByLabel(/precio/i).fill('25000');
    await page.getByLabel('Stock inicial', { exact: true }).fill(String(stockInicial));
    await page.getByLabel('Stock mínimo', { exact: true }).fill(String(stockMinimo));
    await page.getByLabel(/ubicación/i).fill('Bodega E2E');

    await page.getByRole('button', { name: /guardar|crear/i }).click();

    // Verificar que el producto aparece en la tabla
    const filaCreada = page.getByRole('row').filter({ hasText: sku }).last();
    await expect(filaCreada).toBeVisible();

    // 5. Acceder al módulo de movimientos
    await page.getByRole('button', { name: 'Movimientos', exact: true }).click();

    // 6. Registrar entrada de 10 unidades
    await page.getByRole('button', { name: /\+ Movimiento/i }).click();

    // TRUCO FINAL: Esperamos el select, leemos sus opciones y elegimos la que tenga el SKU
    const selectIN = page.locator('#m-product');
    await selectIN.waitFor({ state: 'visible' });
    
    const opcionesIN = await selectIN.locator('option').all();
    let valorIN = '';
    for (const opt of opcionesIN) {
        const texto = await opt.innerText();
        if (texto.includes(sku)) {
            valorIN = await opt.getAttribute('value') || '';
            break;
        }
    }
    
    if (valorIN) {
        await selectIN.selectOption(valorIN);
    } else {
        throw new Error("¡No se encontró el producto en la lista!");
    }

    await page.getByLabel(/tipo/i).selectOption('IN');
    await page.getByLabel(/cantidad/i).fill(String(cantidadEntrada));
    await page.getByRole('button', { name: /guardar|registrar/i }).click();

    // Comprobar que el movimiento se registró (esperamos a que aparezca la fila)
    await expect(page.getByRole('row').filter({ hasText: sku }).last()).toBeVisible({ timeout: 10000 });

    // 7. Registrar salida de 4 unidades.
    await page.getByRole('button', { name: /\+ Movimiento/i }).click();

    const selectOUT = page.locator('#m-product');
    await selectOUT.waitFor({ state: 'visible' });
    
    const opcionesOUT = await selectOUT.locator('option').all();
    let valorOUT = '';
    for (const opt of opcionesOUT) {
        const texto = await opt.innerText();
        if (texto.includes(sku)) {
            valorOUT = await opt.getAttribute('value') || '';
            break;
        }
    }
    
    if (valorOUT) {
        await selectOUT.selectOption(valorOUT);
    }

    await page.getByLabel(/tipo/i).selectOption('OUT');
    await page.getByLabel(/cantidad/i).fill(String(cantidadSalida));
    await page.getByRole('button', { name: /guardar|registrar/i }).click();

    // 8. Volver a productos y consultar el stock.
    await page.getByRole('button', { name: 'Productos', exact: true }).click();

    const filaProducto = page.getByRole('row').filter({ hasText: sku }).last();
    await expect(filaProducto).toBeVisible();
    await expect(filaProducto).toContainText(String(stockEsperado));

    // 9. Validar alertas
    if (stockEsperado <= stockMinimo) {
      await page.getByRole('button', { name: 'Alertas stock', exact: true }).click();
      await expect(page.getByRole('row').filter({ hasText: sku }).last()).toBeVisible();
    }
  });
});