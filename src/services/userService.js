// src/services/userService.js

const API_URL = "http://34.225.6.211:3000/api/users/";

function getToken() {
    return localStorage.getItem("token");
}

function GetHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

// Función helper para procesar errores de validación de manera detallada
async function handleResponseError(response, defaultMsg) {
    try {
        const data = await response.json();
        // El backend suele devolver el mensaje en data.message o data.error
        const errorMessage = data.message || data.error || defaultMsg;
        const error = new Error(errorMessage);
        
        // Guardamos los errores específicos (ej. validations, arrays de Sequelize, express-validator)
        error.details = data.errors || data.details || null;
        return error;
    } catch {
        return new Error(defaultMsg);
    }
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

    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al crear el usuario");
        throw errorObj;
    }
    return response.json();
}

// 3. Actualizar un usuario existente
export async function updateUser(userId, userData) {
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

    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al actualizar el usuario");
        throw errorObj;
    }
    return response.json();
}

// 4. Eliminar un usuario
export async function deleteUser(userId) {
    const response = await fetch(`${API_URL}${userId}`, {
        method: "DELETE",
        headers: GetHeader(),
    });

    if (!response.ok) {
        const errorObj = await handleResponseError(response, "Error al eliminar el usuario");
        throw errorObj;
    }

    return true;
}