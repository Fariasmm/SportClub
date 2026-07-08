// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { loginUser, saveSession } from '../services/authService';
import logoSportClub from '../assets/logo_empresa_letra_v1.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mismos colores oficiales corporativos
  const colors = {
    purple: '#2b124c', // Morado principal del logo
    yellow: '#f3b600', // Amarillo deportivo destacado
    darkBg: '#12071f'  // Fondo profundo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      if (response.ok && response.data) {
        const { token, user } = response.data;
        saveSession(token, user);

        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'coach') navigate('/coach/dashboard');
        else navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 min-vh-100 d-flex flex-column align-items-center justify-content-center py-5" style={{ backgroundColor: colors.darkBg }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={6} lg={4} xl={3}>
            {/* Tarjeta con el morado oficial del logo */}
            <Card className="shadow-lg border-0 text-white mb-3" style={{ backgroundColor: colors.purple, borderRadius: '14px' }}>
              <Card.Body className="p-4 p-md-5">
                
                {/* Logo institucional arriba */}
                <div className="text-center mb-4">
                  <img 
                    src={logoSportClub} 
                    alt="SportClub Logo" 
                    className="img-fluid px-2" 
                    style={{ maxHeight: '60px' }}
                  />
                  <p className="text-white-50 small mb-0 mt-3 text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
                    Control de Acceso
                  </p>
                </div>

                {error && <Alert variant="danger" className="py-2 small text-center fw-medium">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {/* Input Email */}
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="small text-white-50 fw-semibold">Correo Electrónico</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="nombre@correo.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      disabled={loading}
                      className="text-white border-0 py-2"
                      style={{ backgroundColor: '#1c0b33', borderRadius: '6px' }}
                    />
                  </Form.Group>

                  {/* Input Password */}
                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label className="small text-white-50 fw-semibold">Contraseña</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      disabled={loading}
                      className="text-white border-0 py-2"
                      style={{ backgroundColor: '#1c0b33', borderRadius: '6px' }}
                    />
                  </Form.Group>

                  {/* Botón de envío pintado de Amarillo/Oro oficial */}
                  <Button 
                    type="submit" 
                    className="w-100 py-2.5 fw-bold text-uppercase shadow border-0 mb-3"
                    disabled={loading}
                    style={{ 
                      borderRadius: '6px', 
                      backgroundColor: colors.yellow, 
                      color: colors.purple,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Validando...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>

                  {/* NUEVO: Enlace para ir al registro si no tiene cuenta */}
                  <div className="text-center small mt-3">
                    <span className="text-white-50">¿No tienes cuenta? </span>
                    <Link to="/register" style={{ color: colors.yellow, textDecoration: 'none' }} className="fw-semibold">
                      Regístrate aquí
                    </Link>
                  </div>
                </Form>

              </Card.Body>
            </Card>

            {/* NUEVO: Botón minimalista exterior para volver a la Landing Pública */}
            <div className="text-center">
              <Link to="/">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-white-50 text-decoration-none fw-medium tracking-wide text-uppercase"
                  style={{ fontSize: '0.75rem' }}
                >
                  🏠 Volver al Inicio
                </Button>
              </Link>
            </div>

          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;