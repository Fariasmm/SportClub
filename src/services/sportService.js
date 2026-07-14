// src/services/sportService.js

const API_URL = "http://localhost:3000/api/sports/";

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
        const error = new Error(data.message || data.error || defaultMsg);
        error.rawResponse = data;
        error.details = data.errors || data.details || null;
        return error;
    } catch {
        return new Error(defaultMsg);
    }
}

// 1. Obtener todos los deportes (GET /api/sports)
export async function getSports() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeader(),
    });
    if (!response.ok) {
        throw new Error("Error al obtener el listado de deportes");
    }
    return response.json();
}

// 2. Crear un nuevo deporte (POST /api/sports)
export async function createSport(sportData) {
    const payload = {
        name: sportData.name,
        objective: sportData.objective,
        duration: parseInt(sportData.duration, 10), // En minutos (ej: 60)
        status: sportData.status !== undefined ? Boolean(sportData.status) : true
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al registrar el deporte");
        throw errorObj;
    }
    return response.json();
}

// 3. Actualizar un deporte (PUT /api/sports/:id)
export async function updateSport(sportId, sportData) {
    const payload = {
        name: sportData.name,
        objective: sportData.objective,
        duration: parseInt(sportData.duration, 10),
        status: sportData.status !== undefined ? Boolean(sportData.status) : true
    };

    const response = await fetch(`${API_URL}${sportId}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al actualizar el deporte");
        throw errorObj;
    }
    return response.json();
}

// 4. Eliminar un deporte (DELETE /api/sports/:id)
export async function deleteSport(sportId) {
    const response = await fetch(`${API_URL}${sportId}`, {
        method: "DELETE",
        headers: getHeader(),
    });

    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al eliminar el deporte");
        throw errorObj;
    }
    return true;
}