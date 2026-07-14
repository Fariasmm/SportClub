// src/services/coachService.js
const API_URL = "http://34.225.6.211:3000/api/coach";

function getToken() {
  return localStorage.getItem("token");
}

function getHeader() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  };
}

// Obtener las clases del coach logueado desde su endpoint nativo
export async function getCoachClasses() {
  const response = await fetch(`${API_URL}/my-classes`, {
    method: "GET",
    headers: getHeader(),
  });
  if (!response.ok) {
    throw new Error("Error al obtener tus clases como instructor");
  }
  return response.json();
}

// Obtener los bloques de horarios asignados al Coach (GET /api/coach/my-schedules)
export async function getCoachSchedules() {
  const response = await fetch(`${API_URL}/my-schedules`, {
    method: "GET",
    headers: getHeader(),
  });
  if (!response.ok) {
    throw new Error("Error al obtener tu horario como instructor");
  }
  return response.json();
}