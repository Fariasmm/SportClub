// src/services/roomService.js

const API_URL = "http://localhost:3000/api/rooms/";

function getToken() {
    return localStorage.getItem("token");
}

function getHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

// 1. Obtener todas las salas (GET /api/rooms)
export async function getRooms() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader(),
    });
    if (!response.ok) {
        throw new Error("Error al obtener las salas deportivas");
    }
    return response.json();
}

// 2. Crear una nueva sala (POST /api/rooms)
export async function createRoom(roomData) {
    // Estructura según el Modelo de Datos: name, description, capacity, location, status
    const payload = {
        name: roomData.name,
        description: roomData.description,
        capacity: parseInt(roomData.capacity, 10),
        location: roomData.location,
        observation: roomData.observation || "",
        image_url: roomData.image_url || "",
        status: roomData.status !== undefined ? Boolean(roomData.status) : true
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al registrar la sala");
    }
    return data;
}

// 3. Actualizar una sala existente (PUT /api/rooms/:id)
export async function updateRoom(roomId, roomData) {
    const payload = {
        name: roomData.name,
        description: roomData.description,
        capacity: parseInt(roomData.capacity, 10),
        location: roomData.location,
        observation: roomData.observation || "",
        image_url: roomData.image_url || "",
        status: roomData.status !== undefined ? Boolean(roomData.status) : true
    };

    const response = await fetch(`${API_URL}${roomId}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la sala");
    }
    return data;
}

// 4. Eliminar una sala (DELETE /api/rooms/:id)
export async function deleteRoom(roomId) {
    const response = await fetch(`${API_URL}${roomId}`, {
        method: "DELETE",
        headers: getHeader(),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar la sala");
    }
    return true;
}