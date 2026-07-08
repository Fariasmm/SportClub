// src/services/sportRoomService.js
const API_URL = "http://localhost:3000/api/sport-rooms"; // <-- Limpio sin "/" al final

function getToken() {
    return localStorage.getItem("token");
}

function getHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

// GET /api/sport-rooms
export async function getSportRooms() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader(),
    });
    if (!response.ok) throw new Error("Error al obtener las asignaciones");
    return response.json();
}

// POST /api/sport-rooms
export async function createSportRoom(data) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify({
            sport_id: parseInt(data.sport_id, 10),
            room_id: parseInt(data.room_id, 10),
            coach_id: parseInt(data.coach_id, 10),
            observation: data.observation || "",
            status: data.status !== undefined ? Boolean(data.status) : true
        }),
    });
    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || "Error al crear");
    return resData;
}

// PUT /api/sport-rooms/:id
export async function updateSportRoom(id, data) {
    const response = await fetch(`${API_URL}/${id}`, { // <-- Concatenación REST limpia
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify({
            sport_id: parseInt(data.sport_id, 10),
            room_id: parseInt(data.room_id, 10),
            coach_id: parseInt(data.coach_id, 10),
            observation: data.observation || "",
            status: data.status !== undefined ? Boolean(data.status) : true
        }),
    });
    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || "Error al actualizar");
    return resData;
}

// DELETE /api/sport-rooms/:id
export async function deleteSportRoom(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeader(),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar");
    }
    return true;
}