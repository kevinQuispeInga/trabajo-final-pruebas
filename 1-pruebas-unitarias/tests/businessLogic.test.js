import { describe, it, expect } from 'vitest';
import { calculateIGV, applyDiscount, calculateCartTotal } from '../src/utils/calculator.js';
import { isValidDateRange, isOverlapping, calculateBookingNights } from '../src/utils/dateValidator.js';

describe('Pruebas Unitarias de Lógica de Negocio', () => {

  // ==========================================
  // CASOS BASE (1 por cada integrante)
  // ==========================================

  it('Caso Base 1 (Integrante 1 - Santiago Escalante): Cálculo de IGV de un carrito básico', () => {
    // Escenario: Un carrito con total de S/ 100.00 debe calcular exactamente 18% de IGV (S/ 18.00).
    const amount = 100;
    const igv = calculateIGV(amount);
    expect(igv).toBe(18.00);
  });

  it('Caso Base 2 (Integrante 2 - Anthony Llerena): Validación de rango de fechas de reserva correctas', () => {
    // Escenario: Reservas en el futuro (hoy es julio 2026).
    // Usamos fechas del 2026 y 2027 para garantizar que no estén en el pasado.
    const start = '2026-10-10';
    const end = '2026-10-15';
    const isValid = isValidDateRange(start, end);
    expect(isValid).toBe(true);
  });

  it('Caso Base 3 (Integrante 3 - Kevin Quispe): Cálculo correcto de noches de reserva', () => {
    // Escenario: Reserva de 5 noches
    const start = '2026-11-01';
    const end = '2026-11-06';
    const nights = calculateBookingNights(start, end);
    expect(nights).toBe(5);
  });

  // ==========================================
  // CASOS ADICIONALES GENERADOS POR IA
  // ==========================================

  it('Caso IA 1: IGV con precios negativos o entradas inválidas debe lanzar error', () => {
    // Verifica que se rechacen valores negativos e inputs que no sean números
    expect(() => calculateIGV(-50)).toThrow('El monto no puede ser negativo.');
    expect(() => calculateIGV('cien')).toThrow('El monto debe ser un número válido.');
  });

  it('Caso IA 2: Validación de reserva cuando la fecha de inicio es posterior a la de fin', () => {
    // Escenario: Entrada errónea donde inicio > fin
    const start = '2026-12-15';
    const end = '2026-12-10';
    expect(() => isValidDateRange(start, end)).toThrow('La fecha de inicio debe ser anterior o igual a la fecha de fin.');
  });

  it('Caso IA 3: Validación de reserva en el pasado (debe lanzar error)', () => {
    // Escenario: Fecha en el pasado (2020)
    const start = '2020-01-01';
    const end = '2020-01-05';
    expect(() => isValidDateRange(start, end)).toThrow('La fecha de inicio no puede estar en el pasado.');
  });

  it('Caso IA 4: Superposición de reservas (reserva que colisiona con una existente)', () => {
    // Reservas existentes
    const existing = [
      { startDate: '2026-08-10', endDate: '2026-08-15' },
      { startDate: '2026-08-20', endDate: '2026-08-25' }
    ];

    // Nueva reserva que se cruza parcialmente con la primera (12 al 18 de agosto)
    const newBookingOverlapping = { startDate: '2026-08-12', endDate: '2026-08-18' };
    const hasOverlap = isOverlapping(newBookingOverlapping, existing);
    expect(hasOverlap).toBe(true);

    // Nueva reserva sin colisión (16 al 19 de agosto)
    const newBookingFree = { startDate: '2026-08-16', endDate: '2026-08-19' };
    const noOverlap = isOverlapping(newBookingFree, existing);
    expect(noOverlap).toBe(false);
  });

  it('Caso IA 5: Descuento acumulativo y cálculos finales del carrito de compras', () => {
    // Lista de artículos: 2 laptops de S/ 1500 cada una
    const items = [
      { price: 1500, quantity: 2 }
    ];
    // Subtotal: 3000. Cupón DESCUENTO20 (20% de descuento) -> totalNeto: 2400.
    // IGV: 2400 * 18% = 432. Total final: 2832.
    const cartBreakdown = calculateCartTotal(items, 'DESCUENTO20');

    expect(cartBreakdown.subtotal).toBe(3000);
    expect(cartBreakdown.discount).toBe(600);
    expect(cartBreakdown.totalNeto).toBe(2400);
    expect(cartBreakdown.igv).toBe(432);
    expect(cartBreakdown.totalFinal).toBe(2832);
  });
});
