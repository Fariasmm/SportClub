// src/components/users/UserFormModal.jsx
import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

// Agregamos birth_date y metadata para que el backend no tire "Payload inválido"
const initialForm = {
  full_name: "",
  email: "",
  role: "user",
  password: "",
  birth_date: "",
  metadata: { sports: [] }
}

function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
  const [formData, setFormData] = useState(initialForm)

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        full_name: selectedUser.full_name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "user",
        password: "", // Siempre vacío al editar
        birth_date: selectedUser.birth_date || "",
        metadata: selectedUser.metadata || { sports: [] }
      })
    } else {
      setFormData(initialForm)
    }
  }, [selectedUser, show])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    
    // Clonamos para limpiar datos antes de enviar
    const dataToSend = { ...formData }
    
    // Si la fecha está vacía, la mandamos como null para que lo acepte el backend
    if (!dataToSend.birth_date) {
      dataToSend.birth_date = null
    }

    handleSave(dataToSend)
  }

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="border-0 shadow-lg">
      <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: colors.purple, color: '#fff', borderBottom: `1px solid ${colors.inputBorder}` }} className="px-4 py-3">
        <Modal.Title className="fw-bold fs-5 text-uppercase tracking-wide">
          {selectedUser ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body className="px-4 py-4 text-white-50" style={{ backgroundColor: colors.purple }}>
          
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-light opacity-75">Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="text-white border-0 py-2"
              style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-light opacity-75">Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="text-white border-0 py-2"
              style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
            />
          </Form.Group>

          {!selectedUser && (
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-light opacity-75">Contraseña (Mínimo 8 caracteres)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="text-white border-0 py-2"
                style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-2">
            <Form.Label className="small fw-semibold text-light opacity-75">Rol en la Plataforma</Form.Label>
            <Form.Select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="text-white border-0 py-2"
              style={{ backgroundColor: colors.darkBg, borderRadius: '6px', cursor: 'pointer' }}
            >
              <option value="user">💪 Usuario (Socio)</option>
              <option value="coach">🏃‍♂️ Coach (Entrenador)</option>
              <option value="admin">📊 Administrador</option>
            </Form.Select>
          </Form.Group>
          
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: colors.purple, borderTop: `1px solid ${colors.inputBorder}` }} className="px-4 py-3">
          <Button variant="outline-light" onClick={handleClose} className="px-3 fw-semibold text-uppercase small opacity-75" style={{ borderRadius: '6px' }}>
            Cancelar
          </Button>
          <Button type="submit" className="px-4 fw-bold text-uppercase small border-0 shadow-sm" style={{ backgroundColor: colors.yellow, color: colors.purple, borderRadius: '6px' }}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default UserFormModal