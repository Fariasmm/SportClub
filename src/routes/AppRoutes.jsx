// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";
import ProfilePage from "../pages/ProfilePage"; 

import UserDashboard from "../pages/user/UserDashboard";
import CoachDashboard from "../pages/coach/CoachDashboard";
import MySchedulesPage from "../pages/coach/MySchedulesPage"; 
import AdminDashboard from "../pages/admin/AdminDashboard";

// Páginas de gestión de administración
import RoomsPage from "../pages/admin/RoomsPage";
import UsersPage from "../pages/admin/UsersPage";
import SportsPage from "../pages/admin/SportsPage";
import SportRoomsPage from "../pages/admin/SportRoomsPage";
import SchedulesPage from "../pages/admin/SchedulesPage";

// Layouts estructurales
import UserLayout from "../layouts/UserLayout";
import CoachLayout from "../layouts/CoachLayout";
import AdminLayout from "../layouts/AdminLayout";

// Componentes de protección y guardas de rutas
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ================= RUTAS PÚBLICAS ================= */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* ================= RUTA PROTEGIDA COMÚN (PERFIL) ================= */}
                {/* Reemplazamos el h1 por el componente ProfilePage real que creamos */}
                <Route path="/perfil" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />

                {/* ================= RUTAS PROTEGIDAS: SOCIO (USER) ================= */}
                <Route path="/user" element={<RoleRoute allowedRoles={["user"]}><UserLayout /></RoleRoute>}>
                    <Route path="dashboard" element={<UserDashboard />} />
                </Route>

                {/* ================= RUTAS PROTEGIDAS: COACH ================= */}
                <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}>
                    <Route path="dashboard" element={<CoachDashboard />} />
                    {/* 🔥 Agregamos el flujo "Mi Horario" como sub-ruta indexada a /coach/horario */}
                    <Route path="horario" element={<MySchedulesPage />} />
                </Route>

                {/* ================= RUTAS PROTEGIDAS: ADMINISTRADOR ================= */}
                <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="rooms" element={<RoomsPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="sports" element={<SportsPage />} />
                    <Route path="sport-rooms" element={<SportRoomsPage />} />
                    <Route path="schedules" element={<SchedulesPage />} />
                </Route>
                
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;