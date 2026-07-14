// src/services/authService.js

const API_URL = "http://34.225.6.211:3000/api/auth";

// Login contra el backend
export async function loginUser(credentials) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
    }

    return data;
}

// Guardar sesión en el navegador
export function saveSession(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}

// Obtener token
export function getToken() {
    return localStorage.getItem("token");
}

// Obtener usuario
export function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

// Verificar si existe sesión
export function isAuthenticated() {
    return Boolean(getToken());
}

// Cerrar sesión
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export async function registerUser(userData) {
    const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // Al registrarse públicamente, el rol por defecto siempre es "user" (Socio)
        body: JSON.stringify({
            full_name: userData.full_name,
            email: userData.email,
            password: userData.password,
            role: "user",
            birth_date: userData.birth_date || null,
            metadata: { sports: [] }
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al registrar la cuenta");
    }
    return data;
}

// Obtener los datos reales del usuario autenticado en caliente (GET /api/auth/me)
export async function getCurrentUser() {
    const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
    if (!response.ok) throw new Error("No se pudieron obtener los datos del perfil");
    return response.json();
}

// Guardar los cambios editados (PUT /api/users/:id)
export async function updateProfile(userId, profileData) {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(profileData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al actualizar el perfil");
    return data;
}