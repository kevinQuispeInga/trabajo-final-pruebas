/**
 * Lógica de negocio para validación de fechas de reservas de habitaciones.
 */

/**
 * Valida si un rango de fechas es lógico y correcto (no en el pasado y fin >= inicio).
 * @param {string} startDateStr - Fecha de inicio (YYYY-MM-DD).
 * @param {string} endDateStr - Fecha de fin (YYYY-MM-DD).
 * @returns {boolean} Retorna true si es válido, lanza error si no.
 */
export function isValidDateRange(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Formato de fecha inválido. Debe ser YYYY-MM-DD.');
  }

  // Establecer horas a 0 para comparar solo fechas
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    throw new Error('La fecha de inicio no puede estar en el pasado.');
  }

  if (start > end) {
    throw new Error('La fecha de inicio debe ser anterior o igual a la fecha de fin.');
  }

  return true;
}

/**
 * Comprueba si una nueva reserva se superpone con reservas existentes.
 * @param {{startDate: string, endDate: string}} newBooking - Nueva reserva.
 * @param {Array<{startDate: string, endDate: string}>} existingBookings - Reservas ya registradas.
 * @returns {boolean} Retorna true si hay superposición, false si no.
 */
export function isOverlapping(newBooking, existingBookings) {
  if (!Array.isArray(existingBookings)) {
    throw new Error('Las reservas existentes deben ser un arreglo.');
  }

  const newStart = new Date(newBooking.startDate);
  const newEnd = new Date(newBooking.endDate);
  newStart.setHours(0, 0, 0, 0);
  newEnd.setHours(0, 0, 0, 0);

  for (const existing of existingBookings) {
    const extStart = new Date(existing.startDate);
    const extEnd = new Date(existing.endDate);
    extStart.setHours(0, 0, 0, 0);
    extEnd.setHours(0, 0, 0, 0);

    // Hay superposición si el rango nuevo coincide total o parcialmente con el existente
    if (newStart <= extEnd && newEnd >= extStart) {
      return true;
    }
  }

  return false;
}

/**
 * Calcula la cantidad de noches entre dos fechas.
 * @param {string} startDateStr - Fecha de inicio (YYYY-MM-DD).
 * @param {string} endDateStr - Fecha de fin (YYYY-MM-DD).
 * @returns {number} Número de noches.
 */
export function calculateBookingNights(startDateStr, endDateStr) {
  isValidDateRange(startDateStr, endDateStr);

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
