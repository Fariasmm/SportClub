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

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al registrar el deporte");
    }
    return data;
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

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el deporte");
    }
    return data;
}

// 4. Eliminar un deporte (DELETE /api/sports/:id)
export async function deleteSport(sportId) {
    const response = await fetch(`${API_URL}${sportId}`, {
        method: "DELETE",
        headers: getHeader(),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar el deporte");
    }
    return true;
}