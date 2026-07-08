// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react"
import { Card, Button, Modal, Form, Spinner, Row, Col, Badge, Container } from "react-bootstrap"
import Swal from "sweetalert2"
import { getCurrentUser, updateProfile } from "../services/authService"

function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    birth_date: ""
  })

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const data = await getCurrentUser()
      
      // Captura ultra-segura de la respuesta del backend del profesor (Javier Ahumada)
      // Evaluamos todas las formas posibles en que Node/Express empaqueta el JSON
      let userData = null
      if (data && data.user) userData = data.user
      else if (data && data.payload) userData = data.payload
      else if (data && data.data) userData = data.data
      else userData = data

      // Si el GET de la API viene recortado, respaldamos los datos clave usando el localStorage del Login
      if (!userData || !userData.email) {
        const localUserRaw = localStorage.getItem("user")
        if (localUserRaw) {
          const localUser = JSON.parse(localUserRaw)
          userData = { ...localUser, ...userData } // Fusionamos la data
        }
      }

      setUser(userData)
      
      if (userData) {
        setFormData({
          full_name: userData.full_name || "",
          email: userData.email || "",
          birth_date: userData.birth_date ? userData.birth_date.substring(0, 10) : ""
        })
      }
    } catch (error) {
      console.error("Error leyendo datos del perfil:", error)
      // Fallback de emergencia: si la API se cae o no responde, mostramos el usuario local de sesión
      const localUserRaw = localStorage.getItem("user")
      if (localUserRaw) {
        const localUser = JSON.parse(localUserRaw)
        setUser(localUser)
        setFormData({
          full_name: localUser.full_name || "",
          email: localUser.email || "",
          birth_date: localUser.birth_date ? localUser.birth_date.substring(0, 10) : ""
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.full_name.trim() || !formData.email.trim()) {
      Swal.fire({
        title: "Campos obligatorios",
        text: "Por favor, completa el nombre y el correo electrónico.",
        icon: "warning",
        background: colors.purple,
        color: "#fff"
      })
      return
    }

    try {
      const targetId = user?.id || JSON.parse(localStorage.getItem("user"))?.id
      
      if (!targetId) {
        throw new Error("No se pudo identificar el ID del usuario actual.")
      }

      // CONTRATO BLINDADO PARA SEQUELIZE:
      // Replicamos la estructura del modelo original (Página 3 y 4 del informe)
      // Manteniendo los campos obligatorios del registro base para evitar rechazos del ORM
      const payloadData = {
        full_name: formData.full_name,
        email: formData.email,
        role: user?.role || "user",
        birth_date: formData.birth_date || null
      }

      await updateProfile(targetId, payloadData)
      
      // Actualizamos el almacenamiento local para que los cambios se mantengan en caliente tras el F5
      const currentLocalUser = JSON.parse(localStorage.getItem("user") || "{}")
      const updatedLocalUser = { ...currentLocalUser, ...payloadData, id: targetId }
      localStorage.setItem("user", JSON.stringify(updatedLocalUser))

      await Swal.fire({
        title: "¡Perfil Actualizado!",
        text: "Los cambios se guardaron correctamente en la base de datos.",
        icon: "success",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      })
      
      setShowModal(false)
      loadUserProfile() // Recarga inmediata de la interfaz sin refrescar la página
    } catch (error) {
      Swal.fire({
        title: "Error al guardar",
        text: error.message || "No se pudo actualizar el perfil.",
        icon: "error",
        background: colors.purple,
        color: "#fff"
      })
    }
  }

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 min-vh-100 gap-3" style={{ backgroundColor: colors.darkBg }}>
        <Spinner animation="border" style={{ color: colors.yellow }} />
        <span className="text-white-50 small text-uppercase">Sincronizando perfil con el club...</span>
      </div>
    )
  }

  return (
    <div className="w-100 m-0 p-0 d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: colors.darkBg }}>
      <Container className="d-flex justify-content-center py-5">
        <Card className="border-0 shadow-lg text-white p-4" style={{ backgroundColor: colors.purple, borderRadius: '12px', maxWidth: '600px', width: '100%' }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold text-uppercase tracking-wide m-0">👤 Mi Perfil</h3>
                <p className="text-white-50 small m-0 mt-1">Información de tu cuenta en SportClub</p>
              </div>
              <Badge style={{ backgroundColor: colors.yellow, color: colors.purple }} className="text-uppercase px-3 py-2 fw-bold">
                {user?.role || "Socio"}
              </Badge>
            </div>

            <hr className="opacity-20 mb-4" style={{ borderColor: colors.inputBorder }} />

            <Row className="gy-4">
              <Col xs={12}>
                <span className="text-white-50 small text-uppercase d-block mb-1">Nombre Completo</span>
                <span className="fw-bold fs-5 text-white">
                  {user?.full_name || <span className="text-danger small italic">Sin nombre registrado</span>}
                </span>
              </Col>
              
              <Col xs={12}>
                <span className="text-white-50 small text-uppercase d-block mb-1">Correo Electrónico</span>
                <span className="font-monospace text-white">
                  {user?.email || <span className="text-danger small italic">Sin correo registrado</span>}
                </span>
              </Col>
              
              <Col xs={12} className="mb-2">
                <span className="text-white-50 small text-uppercase d-block mb-1">Fecha de Nacimiento</span>
                <span className="text-white">
                  {user?.birth_date ? new Date(user.birth_date).toLocaleDateString('es-CL') : "No registrada"}
                </span>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                onClick={() => setShowModal(true)} 
                className="fw-bold text-uppercase border-0 px-4 py-2" 
                style={{ backgroundColor: colors.yellow, color: colors.purple, borderRadius: '6px' }}
              >
                Editar Perfil
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* MODAL DE EDICIÓN EXIGIDO POR LA RÚBRICA */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="text-white" style={{ backdropFilter: 'blur(4px)' }}>
        <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: colors.purple, borderBottom: `1px solid ${colors.inputBorder}` }}>
          <Modal.Title className="fw-bold text-uppercase fs-5">Modificar Mis Datos</Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ backgroundColor: colors.darkBg }}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 small text-uppercase">Nombre Completo</Form.Label>
              <Form.Control 
                type="text" 
                name="full_name" 
                value={formData.full_name} 
                onChange={handleInputChange}
                style={{ backgroundColor: colors.purple, borderColor: colors.inputBorder, color: '#fff' }} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 small text-uppercase">Correo Electrónico</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange}
                style={{ backgroundColor: colors.purple, borderColor: colors.inputBorder, color: '#fff' }} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 small text-uppercase">Fecha de Nacimiento</Form.Label>
              <Form.Control 
                type="date" 
                name="birth_date" 
                value={formData.birth_date} 
                onChange={handleInputChange}
                style={{ backgroundColor: colors.purple, borderColor: colors.inputBorder, color: '#fff' }} 
              />
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer style={{ backgroundColor: colors.darkBg, borderTop: `1px solid ${colors.inputBorder}` }}>
            <Button variant="outline-light" className="text-uppercase small fw-bold" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="text-uppercase small fw-bold border-0" style={{ backgroundColor: colors.yellow, color: colors.purple }}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default ProfilePage