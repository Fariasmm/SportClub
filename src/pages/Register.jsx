// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { registerUser } from '../services/authService';
import logoSportClub from '../assets/logo_empresa_letra_v1.png';

function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birth_date: ''
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#12071f'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar que las contraseñas coincidan en el Frontend
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
      
      // SweetAlert2 Tematizado Exitoso
      Swal.fire({
        title: "¡Registro Exitoso!",
        text: "Tu cuenta de Socio ha sido creada. Ahora puedes iniciar sesión.",
        icon: "success",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      });

      navigate('/login');
    } catch (err) {
      setError(err.message || 'Ocurrió un error durante el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: colors.darkBg }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} sm={9} md={7} lg={5} xl={4}>
            <Card className="shadow-lg border-0 text-white" style={{ backgroundColor: colors.purple, borderRadius: '14px' }}>
              <Card.Body className="p-4 p-md-5">
                
                <div className="text-center mb-4">
                  <img src={logoSportClub} alt="SportClub Logo" className="img-fluid px-2" style={{ maxHeight: '55px' }} />
                  <p className="text-white-50 small mb-0 mt-3 text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
                    Crear Nueva Cuenta de Socio
                  </p>
                </div>

                {error && <Alert variant="danger" className="py-2 small text-center fw-medium">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {/* Nombre Completo */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-white-50 fw-semibold">Nombre Completo</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="full_name"
                      placeholder="Juan Pérez" 
                      value={formData.full_name}
                      onChange={handleChange}
                      required 
                      minLength={3}
                      disabled={loading}
                      className="text-white border-0 py-2"
                      style={{ backgroundColor: '#1c0b33', borderRadius: '6px' }}
                    />
                  </Form.Group>

                  {/* Correo */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-white-50 fw-semibold">Correo Electrónico</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      placeholder="nombre@correo.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      disabled={loading}
                      className="text-white border-0 py-2"
                      style={{ backgroundColor: '#1c0b33', borderRadius: '6px' }}
                    />
                  </Form.Group>

                  {/* Fecha de Nacimiento */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-white-50 fw-semibold">Fecha de Nacimiento</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      required 
                      disabled={loading}
                      className="text-white border-0 py-2"
                      style={{ backgroundColor: '#1c0b33', borderRadius: '6px', colorScheme: 'dark' }}
                    />
                  </Form.Group>

                  {/* Contraseña */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-white-50 fw-semibold">Contraseña (Mínimo 8 caracteres)</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="password"
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={handleChange}
                      required 
                      minLength={8}
                      disabled={loading}
                      className="text-white border-0 py-2"
                      style={{ backgroundColor: '#1c0b33', borderRadius: '6px' }}
                    />
                  </Form.Group>

                  {/* Confirmar Contraseña */}
                  <Form.Group className="mb-4">
                    <Form.Label className="small text-white-50 fw-semibold">Confirmar Contraseña</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="confirmPassword"
                      placeholder="••••••••" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required 
                      disabled={loading}
                      className="text-white border-0 py-2"
                      style={{ backgroundColor: '#1c0b33', borderRadius: '6px' }}
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="w-100 py-2.5 fw-bold text-uppercase shadow border-0 mb-3"
                    disabled={loading}
                    style={{ backgroundColor: colors.yellow, color: colors.purple, borderRadius: '6px' }}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Registrando...
                      </>
                    ) : (
                      'Registrarse'
                    )}
                  </Button>

                  <div className="text-center small">
                    <span className="text-white-50">¿Ya tienes cuenta? </span>
                    <Link to="/login" style={{ color: colors.yellow, textDecoration: 'none' }} className="fw-semibold">
                      Inicia Sesión aquí
                    </Link>
                  </div>
                </Form>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;