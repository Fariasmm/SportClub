// src/layouts/CoachLayout.jsx
import { useState } from "react"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { Button, Container, Nav, Navbar, Stack } from "react-bootstrap"
import { logout, getUser } from "../services/authService"
import logoSportClub from '../assets/logo_empresa_letra_v1.png'
import ProfileModal from "../components/ProfileModal" // Importación del componente global

function CoachLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()

  // Estado para el perfil flotante
  const [openProfile, setOpenProfile] = useState(false)

  // Modificado para que marque activo tanto en la raíz del módulo como en la ruta explícita
  const isHorarioActive = () => {
    return location.pathname === "/coach" || 
           location.pathname === "/coach/" || 
           location.pathname === "/coach/dashboard" || 
           location.pathname === "/coach/horario"
  }

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#12071f' }}>
      <Navbar expand="lg" variant="dark" className="shadow-sm py-2" style={{ backgroundColor: '#2b124c', borderBottom: '2px solid #f3b600' }}>
        <Container>
          <Navbar.Brand className="d-flex align-items-center me-4" style={{ cursor: 'pointer' }} onClick={() => navigate("/coach")}>
            <img src={logoSportClub} alt="SportClub" height="38" />
            <span className="text-white fs-6 fw-light ms-2 opacity-50">| Coach</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="coach-nav" className="border-0" />
          
          <Navbar.Collapse id="coach-nav">
            <Nav className="me-auto gap-1 my-2 my-lg-0 align-items-center">
              
              {/* 📅 PESTAÑA ÚNICA DE CONTROL HORARIO DE CLASES */}
              <Link 
                className="nav-link px-3 py-2 rounded fw-bold text-uppercase" 
                style={{ 
                  fontSize: '0.75rem',
                  color: isHorarioActive() ? '#fff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isHorarioActive() ? '#1c0b33' : 'transparent',
                  borderBottom: isHorarioActive() ? '2px solid #f3b600' : '2px solid transparent'
                }}
                to="/coach/horario"
              >
                📅 Mi Horario Semanal
              </Link>

              {/* Acción del perfil flotante */}
              <Button 
                variant="link"
                className="nav-link px-3 py-2 rounded fw-bold text-uppercase text-decoration-none" 
                style={{ 
                  fontSize: '0.75rem',
                  color: openProfile ? '#fff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: openProfile ? '#1c0b33' : 'transparent',
                  borderBottom: openProfile ? '2px solid #f3b600' : '2px solid transparent',
                  lineHeight: 'inherit'
                }}
                onClick={() => setOpenProfile(true)}
              >
                👤 Mi Perfil
              </Button>
            </Nav>
            
            <Navbar.Text className="p-0">
              <Stack direction="horizontal" gap={3} className="justify-content-start justify-content-lg-end">
                <div className="d-flex flex-column text-start text-lg-end lh-1">
                  <span className="text-white fw-semibold small">{user?.full_name || "Entrenador"}</span>
                  <span className="extra-small text-uppercase fw-bold mt-1" style={{ fontSize: '0.7rem', color: '#f3b600' }}>Staff Técnico</span>
                </div>
                <div className="vr bg-light d-none d-lg-block" style={{ height: '28px', opacity: '0.2' }}></div>
                <Button variant="outline-danger" size="sm" className="px-3 fw-semibold text-uppercase" onClick={() => { logout(); navigate("/login"); }}>
                  Salir
                </Button>
              </Stack>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 my-5 text-white">
        <Outlet />
      </Container>

      {/* MODAL COMPONENTE REUTILIZABLE PERFIL */}
      <ProfileModal show={openProfile} onHide={() => setOpenProfile(false)} />

      <footer className="py-3 text-center text-white-50 opacity-50 small mt-auto border-top border-secondary border-opacity-10">
        &copy; {new Date().getFullYear()} SportClub Fitness.
      </footer>
    </div>
  )
}

export default CoachLayout