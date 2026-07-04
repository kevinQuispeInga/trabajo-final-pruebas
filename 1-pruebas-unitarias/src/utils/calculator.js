/**
 * Lógica de negocio para cálculos de carrito de compras e impuestos (IGV).
 */

/**
 * Calcula el IGV (18%) de un monto total.
 * @param {number} amount - El monto base.
 * @returns {number} El IGV calculado.
 */
export function calculateIGV(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('El monto debe ser un número válido.');
  }
  if (amount < 0) {
    throw new Error('El monto no puede ser negativo.');
  }
  return parseFloat((amount * 0.18).toFixed(2));
}

/**
 * Aplica un cupón de descuento sobre un monto total.
 * @param {number} cartTotal - El total del carrito.
 * @param {string} couponCode - El código del cupón.
 * @returns {number} El total con descuento aplicado.
 */
export function applyDiscount(cartTotal, couponCode) {
  if (typeof cartTotal !== 'number' || isNaN(cartTotal)) {
    throw new Error('El total del carrito debe ser un número válido.');
  }
  if (cartTotal < 0) {
    throw new Error('El total del carrito no puede ser negativo.');
  }

  let discount = 0;
  if (couponCode === 'DESCUENTO10') {
    discount = 0.10;
  } else if (couponCode === 'DESCUENTO20') {
    discount = 0.20;
  } else if (couponCode && couponCode !== '') {
    // Cupón inválido
    return cartTotal;
  }

  const finalTotal = cartTotal * (1 - discount);
  return parseFloat(finalTotal.toFixed(2));
}

/**
 * Calcula el desglose final del carrito de compras.
 * @param {Array<{price: number, quantity: number}>} items - Lista de artículos.
 * @param {string} [couponCode] - Cupón de descuento opcional.
 * @returns {{subtotal: number, discount: number, totalNeto: number, igv: number, totalFinal: number}}
 */
export function calculateCartTotal(items, couponCode = '') {
  if (!Array.isArray(items)) {
    throw new Error('Los artículos deben ser un arreglo.');
  }

  let subtotal = 0;
  for (const item of items) {
    if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      throw new Error('Precio y cantidad deben ser números.');
    }
    if (item.price < 0 || item.quantity < 0) {
      throw new Error('Precio y cantidad no pueden ser negativos.');
    }
    subtotal += item.price * item.quantity;
  }

  const subtotalRounded = parseFloat(subtotal.toFixed(2));
  const totalConDescuento = applyDiscount(subtotalRounded, couponCode);
  const discountAmount = parseFloat((subtotalRounded - totalConDescuento).toFixed(2));
  const igv = calculateIGV(totalConDescuento);
  const totalFinal = parseFloat((totalConDescuento + igv).toFixed(2));

  return {
    subtotal: subtotalRounded,
    discount: discountAmount,
    totalNeto: totalConDescuento,
    igv,
    totalFinal
  };
}
