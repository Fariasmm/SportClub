// src/services/memberService.js
const MEMBER_URL = "http://34.225.6.211:3000/api/member";
const RESERVATIONS_URL = "http://34.225.6.211:3000/api/reservations";

function getToken() {
  return localStorage.getItem("token");
}

function getHeader() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  };
}

// 1. Catálogo de clases (GET /api/member/classes)
export async function getAvailableClasses() {
  const response = await fetch(`${MEMBER_URL}/classes`, {
    method: "GET",
    headers: getHeader()
  });
  if (!response.ok) throw new Error("Error al cargar las clases disponibles");
  return response.json();
}

// 2. Mis reservas (GET /api/reservations/my-reservations)
export async function getMyReservations() {
  const response = await fetch(`${RESERVATIONS_URL}/my-reservations`, {
    method: "GET",
    headers: getHeader()
  });
  if (!response.ok) throw new Error("Error al obtener tus reservas");
  return response.json();
}

// 3. Crear reserva (POST /api/reservations)
export async function createReservation(classScheduleId) {
  const response = await fetch(RESERVATIONS_URL, {
    method: "POST",
    headers: getHeader(),
    body: JSON.stringify({ class_schedule_id: parseInt(classScheduleId, 10) })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "No se pudo agendar la clase");
  }
  return data;
}

// 4. Cancelar reserva (PATCH /api/reservations/:id/cancel)
export async function cancelReservation(reservationId) {
  const response = await fetch(`${RESERVATIONS_URL}/${reservationId}/cancel`, {
    method: "PATCH",
    headers: getHeader()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "No se pudo cancelar la reserva");
  }
  return data;
}