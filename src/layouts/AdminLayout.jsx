// src/layouts/AdminLayout.jsx
import { useState } from "react"
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
import { Button, Container, Nav, Navbar, Stack } from "react-bootstrap"
import { logout, getUser } from "../services/authService"
import logoSportClub from '../assets/logo_empresa_letra_v1.png'
import ProfileModal from "../components/ProfileModal" // 🔥 Importamos el componente reutilizable

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()

  // 🔥 Estado local único para manejar la apertura del modal global
  const [openProfile, setOpenProfile] = useState(false)

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#12071f'
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: colors.darkBg }}>
      {/* Navbar Oficial Morado con Borde Amarillo */}
      <Navbar expand="lg" variant="dark" className="shadow-sm py-3" style={{ backgroundColor: colors.purple, borderBottom: `2px solid ${colors.yellow}` }}>
        <Container>
          
          {/* SECCIÓN IZQUIERDA: Brand aislado */}
          <Navbar.Brand className="d-flex align-items-center m-0 p-0 me-4">
            <img src={logoSportClub} alt="SportClub" height="38" />
            <span className="text-white fs-6 fw-light ms-2 opacity-50 d-none d-sm-inline">| Panel Admin</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="admin-nav" className="border-0" />
          
          {/* SECCIÓN COLAPSABLE */}
          <Navbar.Collapse id="admin-nav">
            
            {/* SECCIÓN CENTRAL: Menú equilibrado */}
            <Nav className="mx-auto gap-1 my-3 my-lg-0 align-items-center">
              <Link 
                className="nav-link px-2.5 py-2 rounded fw-bold tracking-wider text-uppercase" 
                style={{ 
                  fontSize: '0.7rem',
                  color: isActive('/admin/dashboard') ? '#fff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isActive('/admin/dashboard') ? '#1c0b33' : 'transparent',
                  borderBottom: isActive('/admin/dashboard') ? `2px solid ${colors.yellow}` : '2px solid transparent',
                  borderRadius: '4px'
                }}
                to="/admin/dashboard"
              >
                📊 Dashboard
              </Link>
              
              {/* 🔥 MODIFICADO: Ahora es un Button nativo que levanta el Modal sin cambiar de página */}
              <Button 
                variant="link"
                className="nav-link px-2.5 py-2 rounded fw-bold tracking-wider text-uppercase text-decoration-none" 
                style={{ 
                  fontSize: '0.7rem',
                  color: openProfile ? '#fff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: openProfile ? '#1c0b33' : 'transparent',
                  borderBottom: openProfile ? `2px solid ${colors.yellow}` : '2px solid transparent',
                  borderRadius: '4px',
                  lineHeight: 'inherit'
                }}
                onClick={() => setOpenProfile(true)}
              >
                👤 Mi Perfil
              </Button>

              <Link 
                className="nav-link px-2.5 py-2 rounded fw-bold tracking-wider text-uppercase" 
                style={{ 
                  fontSize: '0.7rem',
                  color: isActive('/admin/users') ? '#fff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isActive('/admin/users') ? '#1c0b33' : 'transparent',
                  borderBottom: isActive('/admin/users') ? `2px solid ${colors.yellow}` : '2px solid transparent',
                  borderRadius: '4px'
                }}
                to="/admin/users"
              >
                👥 Usuarios
              </Link>

              <Link 
                className="nav-link px-2.5 py-2 rounded fw-bold tracking-wider text-uppercase" 
                style={{ 
                  fontSize: '0.7rem',
                  color: isActive('/admin/rooms') ? '#fff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isActive('/admin/rooms') ? '#1c0b33' : 'transparent',
                  borderBottom: isActive('/admin/rooms') ? `2px solid ${colors.yellow}` : '2px solid transparent',
                  borderRadius: '4px'
                }}
                to="/admin/rooms"
              >
                🏢 Salas
              </Link>

              <Link 
                className="nav-link px-2.5 py-2 rounded fw-bold tracking-wider text-uppercase" 
                style={{ 
                  fontSize: '0.7rem',
                  color: isActive('/admin/sports') ? '#fff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isActive('/admin/sports') ? '#1c0b33' : 'transparent',
                  borderBottom: isActive('/admin/sports') ? `2px solid ${colors.yellow}` : '2px solid transparent',
                  borderRadius: '4px'
                }}
                to="/admin/sports"
              >
                🏋️‍♂️ Deportes
              </Link>

              <Link 
                className="nav-link px-2.5 py-2 rounded fw-bold tracking-wider text-uppercase" 
                style={{ 
                  fontSize: '0.7rem',
                  color: isActive('/admin/sport-rooms') ? '#fff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isActive('/admin/sport-rooms') ? '#1c0b33' : 'transparent',
                  borderBottom: isActive('/admin/sport-rooms') ? `2px solid ${colors.yellow}` : '2px solid transparent',
                  borderRadius: '4px'
                }}
                to="/admin/sport-rooms"
              >
                🔗 Asignaciones
              </Link>

              <Link 
                className="nav-link px-2.5 py-2 rounded fw-bold tracking-wider text-uppercase" 
                style={{ 
                  fontSize: '0.7rem',
                  color: isActive('/admin/schedules') ? '#fff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isActive('/admin/schedules') ? '#1c0b33' : 'transparent',
                  borderBottom: isActive('/admin/schedules') ? `2px solid ${colors.yellow}` : '2px solid transparent',
                  borderRadius: '4px'
                }}
                to="/admin/schedules"
              >
                📅 Horarios
              </Link>
            </Nav>
            
            {/* SECCIÓN DERECHA: Identificación del Admin */}
            <Navbar.Text className="p-0 m-0 mt-2 mt-lg-0">
              <Stack direction="horizontal" gap={3} className="justify-content-start justify-content-lg-end">
                <div className="d-flex flex-column text-start text-lg-end lh-1">
                  <span className="text-white fw-semibold small">{user?.full_name || "Administrador"}</span>
                  <span className="extra-small text-uppercase fw-bold mt-1" style={{ fontSize: '0.65rem', color: colors.yellow }}>Gestión Global</span>
                </div>
                <div className="vr bg-light d-none d-lg-block" style={{ height: '28px', opacity: '0.2' }}></div>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="px-3 fw-bold text-uppercase" 
                  style={{ borderRadius: '4px', fontSize: '0.75rem' }}
                  onClick={() => { logout(); navigate("/login"); }}
                >
                  Salir
                </Button>
              </Stack>
            </Navbar.Text>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido Dinámico Protegido */}
      <Container className="flex-grow-1 my-5 text-white">
        <Nav className="mb-4 small align-items-center opacity-75">
          <Link to="/admin/dashboard" className="text-white-50 text-decoration-none">Admin</Link>
          <span className="text-white-50 mx-2">&gt;</span>
          <span className="text-white fw-semibold text-uppercase tracking-wider" style={{ color: colors.yellow }}>
            {isActive('/admin/users') ? 'Gestión de Usuarios' : 
             isActive('/admin/rooms') ? 'Gestión de Salas' : 
             isActive('/admin/sports') ? 'Gestión de Deportes' : 
             isActive('/admin/sport-rooms') ? 'Gestión de Asignaciones' : 
             isActive('/admin/schedules') ? 'Itinerario de Horarios' : 
             openProfile ? 'Mi Cuenta' : 'Dashboard'}
          </span>
        </Nav>
        <Outlet />
      </Container>

      {/* 🔥 RENDERIZADO DEL MODAL COMPONENTE REUTILIZABLE */}
      <ProfileModal show={openProfile} onHide={() => setOpenProfile(false)} />

      {/* Footer corporativo */}
      <footer className="py-3 text-center text-white-50 opacity-50 small mt-auto border-top border-secondary border-opacity-10">
        &copy; {new Date().getFullYear()} SportClub Control Panel.
      </footer>
    </div>
  )
}

export default AdminLayout