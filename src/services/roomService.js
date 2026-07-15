// src/services/roomService.js

const API_URL = "http://34.225.6.211:3000/api/rooms/";

function getToken() {
    return localStorage.getItem("token");
}

function getHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

// Helper avanzado para capturar la respuesta JSON de error completa del backend
async function handleResponseError(response, defaultMsg) {
    try {
        const data = await response.json();
        
        // Creamos un error con el mensaje principal (ej: "Datos inválidos")
        const error = new Error(data.message || data.error || defaultMsg);
        
        // Adjuntamos TODAS las propiedades que devolvió el JSON del backend para que la vista las analice
        error.rawResponse = data;
        error.details = data.errors || data.details || null;
        
        return error;
    } catch {
        return new Error(defaultMsg);
    }
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

    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al registrar la sala");
        throw errorObj;
    }
    return response.json();
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

    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al actualizar la sala");
        throw errorObj;
    }
    return response.json();
}

// 4. Eliminar una sala (DELETE /api/rooms/:id)
export async function deleteRoom(roomId) {
    const response = await fetch(`${API_URL}${roomId}`, {
        method: "DELETE",
        headers: getHeader(),
    });

    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al eliminar la sala");
        throw errorObj;
    }
    return true;
}