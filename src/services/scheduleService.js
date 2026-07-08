// src/services/scheduleService.js
const API_URL = "http://localhost:3000/api/class-schedules"; // <-- Sin "/" al final

function getToken() {
    return localStorage.getItem("token");
}

function getHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

// GET /api/class-schedules
export async function getSchedules() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader(),
    });
    if (!response.ok) throw new Error("Error al obtener los horarios de clases");
    return response.json();
}

// POST /api/class-schedules
export async function createSchedule(scheduleData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify({
            sport_room_id: parseInt(scheduleData.sport_room_id, 10),
            day_of_week: scheduleData.day_of_week,
            start_time: scheduleData.start_time,
            end_time: scheduleData.end_time,
            status: scheduleData.status !== undefined ? Boolean(scheduleData.status) : true
        }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al registrar el horario");
    return data;
}

// PUT /api/class-schedules/:id
export async function updateSchedule(id, scheduleData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify({
            sport_room_id: parseInt(scheduleData.sport_room_id, 10),
            day_of_week: scheduleData.day_of_week,
            start_time: scheduleData.start_time,
            end_time: scheduleData.end_time,
            status: scheduleData.status !== undefined ? Boolean(scheduleData.status) : true
        }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al actualizar el horario");
    return data;
}

// DELETE /api/class-schedules/:id
export async function deleteSchedule(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeader(),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar el horario");
    }
    return true;
}

// 🔥 NUEVA FUNCIÓN COMPATIBLE: Para que el Socio pueda reservar usando tu formato fetch
// Apunta al endpoint estándar de reservas usando la sesión activa
export async function bookClass(scheduleId) {
    const response = await fetch("http://localhost:3000/api/reservations", {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify({
            class_schedule_id: parseInt(scheduleId, 10)
        }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "No se pudo agendar la clase");
    return data;
}