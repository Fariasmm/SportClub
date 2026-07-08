// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Navbar, Nav } from 'react-bootstrap';
// Importamos el logo real de la empresa
import logoSportClub from '../assets/logo_empresa_letra_v1.png';

function Home() {
  // Definimos los colores del logo para usarlos de forma consistente
  const colors = {
    purple: '#2b124c', // Morado oscuro de fondo/acentos principales
    yellow: '#f3b600', // Amarillo/dorado deportivo del borde del logo
    darkBg: '#12071f'  // Un fondo morado casi negro ultra premium
  };

  return (
    <div className="text-white min-vh-100 d-flex flex-column" style={{ backgroundColor: colors.darkBg }}>
      
      {/* Navbar Público */}
      <Navbar variant="dark" className="py-3" style={{ backgroundColor: colors.purple, borderBottom: `2px solid ${colors.yellow}` }}>
        <Container>
          <Navbar.Brand className="d-flex align-items-center">
            <img
              src={logoSportClub}
              alt="SportClub Logo"
              height="45"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Nav className="ms-auto d-flex gap-2 align-items-center">
            {/* NUEVO: Enlace directo al Registro en el Navbar */}
            <Link to="/register">
              <Button 
                variant="outline-light" 
                size="sm" 
                className="fw-bold text-uppercase px-3"
              >
                Registrarse
              </Button>
            </Link>

            {/* Enlace al Login con hover interactivo */}
            <Link to="/login">
              <Button 
                size="sm" 
                className="fw-bold text-uppercase px-3 border-0"
                style={{ backgroundColor: colors.yellow, color: colors.purple }}
              >
                Área Miembros
              </Button>
            </Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Sección Hero */}
      <Container className="my-auto py-5">
        <Row className="align-items-center justify-content-center text-center text-md-start">
          <Col md={7} lg={6} className="mb-5 mb-md-0">
            <span className="badge text-uppercase px-3 py-2 rounded-pill fw-bold mb-3 tracking-wide" style={{ backgroundColor: colors.yellow, color: colors.purple }}>
              Alto Rendimiento
            </span>
            <h1 className="display-4 fw-black text-uppercase lh-1 mb-3" style={{ fontFamily: 'sans-serif', letterSpacing: '-1px' }}>
              Lleva tu entrenamiento al <span style={{ color: colors.yellow }}>siguiente nivel</span>
            </h1>
            <p className="lead mb-4 text-white-50">
              Gestiona tus rutinas, conecta con entrenadores profesionales y sigue tu progreso en tiempo real dentro de SportClub.
            </p>
            
            {/* Botonera Principal Ajustada */}
            <div className="d-flex gap-3 justify-content-center justify-content-md-start align-items-center flex-wrap">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="fw-bold text-uppercase px-4 py-3 shadow border-0"
                  style={{ backgroundColor: colors.yellow, color: colors.purple }}
                >
                  Ingresar a mi Panel
                </Button>
              </Link>

              {/* NUEVO: Botón llamativo para registrar una cuenta nueva */}
              <Link to="/register">
                <Button 
                  variant="outline-light"
                  size="lg" 
                  className="fw-bold text-uppercase px-4 py-3 shadow-sm"
                  style={{ border: '2px solid #fff' }}
                >
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </Col>

          {/* Tarjetas laterales con contraste corregido */}
          <Col md={5} lg={5} className="offset-lg-1">
            <Row className="g-3">
              <Col xs={12}>
                <Card className="border-0 shadow-sm" style={{ backgroundColor: colors.purple }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold" style={{ color: colors.yellow }}>🏃‍♂️ Para Socios</h5>
                    <p className="text-light opacity-75 small m-0">
                      Accede a tus planes de entrenamiento asignados por tu coach y lleva el registro de tus marcas.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12}>
                <Card className="border-0 shadow-sm" style={{ backgroundColor: colors.purple }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold" style={{ color: colors.yellow }}>📋 Para Entrenadores</h5>
                    <p className="text-light opacity-75 small m-0">
                      Monitorea los avances de tus alumnos, planifica las semanas y actualiza sus rutinas diario.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="py-3 text-center opacity-50 small mt-auto border-top border-secondary border-opacity-10">
        &copy; {new Date().getFullYear()} SportClub Fitness. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default Home;