// src/services/userService.js

const API_URL = "http://localhost:3000/api/users/";

function getToken() {
    return localStorage.getItem("token");
}

// CORREGIDO: Nombre de propiedad estándar "Content-Type"
function GetHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

// 1. Obtener todos los usuarios
export async function getUsers() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: GetHeader(),
    });
    
    if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
    }
    return response.json();
}

// 2. Crear un usuario nuevo
export async function createUser(userData) {
    // Estructuramos el payload exacto que exige el nuevo validador
    const payload = {
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        birth_date: userData.birth_date || null,
        metadata: userData.metadata || { sports: [] }
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: GetHeader(),
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al crear el usuario");
    }
    return data;
}

// 3. Actualizar un usuario existente
export async function updateUser(userId, userData) {
    // CRÍTICO: No enviamos 'password' si viene vacío para que el validador parcial del backend no falle
    const payload = {
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role,
        birth_date: userData.birth_date || null,
        metadata: userData.metadata || { sports: [] }
    };

    const response = await fetch(`${API_URL}${userId}`, {
        method: "PUT",
        headers: GetHeader(),
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el usuario");
    }
    return data;
}

// 4. Eliminar un usuario
export async function deleteUser(userId) {
    const response = await fetch(`${API_URL}${userId}`, {
        method: "DELETE",
        headers: GetHeader(),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar el usuario");
    }

    return true;
}