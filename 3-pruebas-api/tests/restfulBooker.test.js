import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

const BASE_URL = 'https://restful-booker.herokuapp.com';

describe('Pruebas de API con Supertest y Vitest - Restful Booker', () => {
  let authToken = '';
  let createdBookingId = null;

  // ==========================================
  // CASOS BASE (1 por cada integrante)
  // ==========================================

  it('Caso Base 1 (Integrante 1 - Juan Pérez): Generar token de autenticación (POST /auth)', async () => {
    const response = await request(BASE_URL)
      .post('/auth')
      .send({
        username: 'admin',
        password: 'password123'
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
    
    // Guardamos el token para los siguientes casos que requieran autenticación
    authToken = response.body.token;
  });

  it('Caso Base 2 (Integrante 2 - María Gómez): Crear una nueva reserva (POST /booking)', async () => {
    const newBooking = {
      firstname: 'ESAN',
      lastname: 'Software Testing',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-12-01',
        checkout: '2026-12-10'
      },
      additionalneeds: 'Late checkout'
    };

    const response = await request(BASE_URL)
      .post('/booking')
      .send(newBooking)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('bookingid');
    expect(response.body.booking.firstname).toBe('ESAN');
    expect(response.body.booking.lastname).toBe('Software Testing');
    expect(response.body.booking.totalprice).toBe(150);

    // Guardamos el ID para el caso 3 y el caso IA
    createdBookingId = response.body.bookingid;
  });

  it('Caso Base 3 (Integrante 3 - Carlos Ruiz): Obtener detalles de una reserva por ID (GET /booking/:id)', async () => {
    // Si no se creó una reserva en el test anterior por algún error de red, usamos un ID estático común (como 1 o 2)
    const testId = createdBookingId || 2;

    const response = await request(BASE_URL)
      .get(`/booking/${testId}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('firstname');
    expect(response.body).toHaveProperty('lastname');
    expect(response.body).toHaveProperty('bookingdates');
  });

  // ==========================================
  // CASO ADICIONAL GENERADO POR IA
  // ==========================================

  it('Caso IA 1: Flujo completo - Actualizar reserva (PUT) y luego eliminar reserva (DELETE)', async () => {
    // 1. Verificar que tengamos un ID de reserva y token de autenticación
    if (!createdBookingId) {
      // Si por alguna razón falló el paso anterior, creamos una reserva rápida
      const quickBookingResponse = await request(BASE_URL)
        .post('/booking')
        .send({
          firstname: 'IA Temp',
          lastname: 'Booking',
          totalprice: 99,
          depositpaid: false,
          bookingdates: { checkin: '2026-09-01', checkout: '2026-09-05' },
          additionalneeds: 'None'
        });
      createdBookingId = quickBookingResponse.body.bookingid;
    }

    if (!authToken) {
      // Si falló el token, obtenemos uno nuevo
      const authResponse = await request(BASE_URL)
        .post('/auth')
        .send({ username: 'admin', password: 'password123' });
      authToken = authResponse.body.token;
    }

    // 2. Ejecutar PUT para actualizar la reserva
    const updatedBooking = {
      firstname: 'ESAN IA Editado',
      lastname: 'Software Testing',
      totalprice: 200,
      depositpaid: false,
      bookingdates: {
        checkin: '2026-12-01',
        checkout: '2026-12-10'
      },
      additionalneeds: 'Breakfast and Dinner'
    };

    const putResponse = await request(BASE_URL)
      .put(`/booking/${createdBookingId}`)
      .set('Cookie', `token=${authToken}`)
      .set('Accept', 'application/json')
      .send(updatedBooking);

    expect(putResponse.status).toBe(200);
    expect(putResponse.body.firstname).toBe('ESAN IA Editado');
    expect(putResponse.body.totalprice).toBe(200);

    // 3. Ejecutar DELETE para eliminar la reserva
    const deleteResponse = await request(BASE_URL)
      .delete(`/booking/${createdBookingId}`)
      .set('Cookie', `token=${authToken}`)
      .set('Accept', 'application/json');

    // Restful-Booker responde con 201 Created para eliminaciones exitosas
    expect(deleteResponse.status).toBe(201);

    // 4. Verificar que la reserva ya no existe (GET debe retornar 404)
    const getResponse = await request(BASE_URL)
      .get(`/booking/${createdBookingId}`)
      .set('Accept', 'application/json');

    expect(getResponse.status).toBe(404);
  });
});
