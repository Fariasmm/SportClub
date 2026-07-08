// src/components/ProfileModal.jsx
import { useEffect, useState } from "react"
import { Modal, Button, Form, Row, Col, Badge, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { getCurrentUser, updateProfile, getUser } from "../services/authService"

function ProfileModal({ show, onHide }) {
  const userLocal = getUser()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    birth_date: ""
  })

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#12071f',
    innerBg: '#1c0b33',
    inputBorder: '#442373'
  }

  // Carga los datos en caliente solo cuando el modal se abre
  useEffect(() => {
    if (show) {
      const fetchProfile = async () => {
        try {
          setLoading(true)
          const data = await getCurrentUser()
          const fetchedUser = data.user || data.payload || data.data || data

          if (!fetchedUser || !fetchedUser.email) {
            const fallback = JSON.parse(localStorage.getItem("user") || "{}")
            setUserData({ ...fallback, ...fetchedUser })
          } else {
            setUserData(fetchedUser)
          }
        } catch (error) {
          console.error(error)
          const fallback = JSON.parse(localStorage.getItem("user") || "{}")
          setUserData(fallback)
        } finally {
          setLoading(false)
        }
      }
      fetchProfile()
    } else {
      // Resetea estados al cerrar
      setShowEdit(false)
    }
  }, [show])

  // Sincroniza el formulario interno para editar
  useEffect(() => {
    if (userData) {
      setFormData({
        full_name: userData.full_name || "",
        email: userData.email || "",
        birth_date: userData.birth_date ? userData.birth_date.substring(0, 10) : ""
      })
    }
  }, [userData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!formData.full_name.trim() || !formData.email.trim()) {
      Swal.fire({ title: "Campos obligatorios", text: "Completa el nombre y correo.", icon: "warning", background: colors.purple, color: "#fff" })
      return
    }

    try {
      const targetId = userData?.id || userLocal?.id
      const payloadData = {
        full_name: formData.full_name,
        email: formData.email,
        role: userData?.role || userLocal?.role || "user",
        birth_date: formData.birth_date || null
      }

      await updateProfile(targetId, payloadData)

      const updatedSession = { ...userLocal, ...payloadData, id: targetId }
      localStorage.setItem("user", JSON.stringify(updatedSession))
      setUserData(updatedSession)

      Swal.fire({ title: "¡Perfil Actualizado!", text: "Cambios guardados de forma correcta.", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      setShowEdit(false)
    } catch (error) {
      Swal.fire({ title: "Error al guardar", text: error.message || "No se pudo actualizar.", icon: "error", background: colors.purple, color: "#fff" })
    }
  }

  return (
    <>
      {/* ================= MODAL DE VISTA ================= */}
      <Modal show={show && !showEdit} onHide={onHide} centered contentClassName="text-white" style={{ backdropFilter: 'blur(4px)' }}>
        <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: colors.purple, borderBottom: `1px solid ${colors.inputBorder}` }}>
          <Modal.Title className="fw-bold text-uppercase fs-5">👤 Mi Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: colors.innerBg }} className="p-4">
          {loading ? (
            <div className="text-center py-4"><Spinner animation="border" style={{ color: colors.yellow }} /></div>
          ) : (
            <Row className="gy-3">
              <Col xs={12} className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-white-50 small text-uppercase">Rango de Usuario</span>
                <Badge style={{ backgroundColor: colors.yellow, color: colors.purple }} className="text-uppercase fw-bold px-3 py-1.5">{userData?.role || "Socio"}</Badge>
              </Col>
              <Col xs={12}>
                <span className="text-white-50 small text-uppercase d-block mb-1">Nombre Completo</span>
                <span className="fw-bold fs-5 text-white">{userData?.full_name || "No registrado"}</span>
              </Col>
              <Col xs={12}>
                <span className="text-white-50 small text-uppercase d-block mb-1">Correo Electrónico</span>
                <span className="font-monospace text-white">{userData?.email || "No registrado"}</span>
              </Col>
              <Col xs={12}>
                <span className="text-white-50 small text-uppercase d-block mb-1">Fecha de Nacimiento</span>
                <span className="text-white">{userData?.birth_date ? new Date(userData.birth_date).toLocaleDateString('es-CL') : "No registrada"}</span>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: colors.innerBg, borderTop: `1px solid ${colors.inputBorder}` }}>
          <Button variant="outline-light" className="text-uppercase small fw-bold" onClick={onHide}>Cerrar</Button>
          <Button className="text-uppercase small fw-bold border-0" style={{ backgroundColor: colors.yellow, color: colors.purple }} onClick={() => setShowEdit(true)}>Editar Datos</Button>
        </Modal.Footer>
      </Modal>

      {/* ================= MODAL DE EDICIÓN ================= */}
      <Modal show={show && showEdit} onHide={onHide} centered contentClassName="text-white" style={{ backdropFilter: 'blur(4px)' }}>
        <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: colors.purple, borderBottom: `1px solid ${colors.inputBorder}` }}>
          <Modal.Title className="fw-bold text-uppercase fs-5">Modificar Mis Datos</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body style={{ backgroundColor: colors.innerBg }}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 small text-uppercase">Nombre Completo</Form.Label>
              <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} style={{ backgroundColor: colors.purple, borderColor: colors.inputBorder, color: '#fff' }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 small text-uppercase">Correo Electrónico</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ backgroundColor: colors.purple, borderColor: colors.inputBorder, color: '#fff' }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 small text-uppercase">Fecha de Nacimiento</Form.Label>
              <Form.Control type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} style={{ backgroundColor: colors.purple, borderColor: colors.inputBorder, color: '#fff' }} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: colors.innerBg, borderTop: `1px solid ${colors.inputBorder}` }}>
            <Button variant="outline-light" className="text-uppercase small fw-bold" onClick={() => setShowEdit(false)}>Atrás</Button>
            <Button type="submit" className="text-uppercase small fw-bold border-0" style={{ backgroundColor: colors.yellow, color: colors.purple }}>Guardar Cambios</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default ProfileModal