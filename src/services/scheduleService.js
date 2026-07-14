// src/services/scheduleService.js
const API_URL = "http://34.225.6.211:3000/api/class-schedules";

function getToken() {
    return localStorage.getItem("token");
}

function getHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

// Helper para procesar respuestas de error del backend de forma detallada
async function handleResponseError(response, defaultMsg) {
    try {
        const data = await response.json();
        // Si el backend devuelve un mensaje de error o una lista de validaciones (Sequelize)
        const errorMessage = data.message || data.error || defaultMsg;
        const error = new Error(errorMessage);
        error.details = data.errors || null; // Guardamos detalles de validación adicionales si existen
        return error;
    } catch {
        return new Error(defaultMsg);
    }
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
    
    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al registrar el horario");
        throw errorObj;
    }
    return response.json();
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
    
    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al actualizar el horario");
        throw errorObj;
    }
    return response.json();
}

// DELETE /api/class-schedules/:id
export async function deleteSchedule(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeader(),
    });
    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al eliminar el horario");
        throw errorObj;
    }
    return true;
}

// POST /api/reservations
export async function bookClass(scheduleId) {
    const response = await fetch("http://34.225.6.211:3000/api/reservations", {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify({
            class_schedule_id: parseInt(scheduleId, 10)
        }),
    });
    if (!response.ok) {
        const errorObj = await handleResponseError(response, "No se pudo agendar la clase");
        throw errorObj;
    }
    return response.json();
}