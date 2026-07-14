// src/components/rooms/RoomFormModal.jsx
import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2" // Importamos Swal para las alertas preventivas

const initialForm = {
  name: "",
  description: "",
  capacity: "",
  location: "",
  observation: "",
  image_url: "",
  status: true
}

function RoomFormModal({ show, handleClose, handleSave, selectedRoom }) {
  const [formData, setFormData] = useState(initialForm)

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        name: selectedRoom.name || "",
        description: selectedRoom.description || "",
        capacity: selectedRoom.capacity || "",
        location: selectedRoom.location || "",
        observation: selectedRoom.observation || "",
        image_url: selectedRoom.image_url || "",
        status: selectedRoom.status !== undefined ? selectedRoom.status : true
      })
    } else {
      setFormData(initialForm)
    }
  }, [selectedRoom, show])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: name === "status" ? event.target.checked : value,
    })
  }

  // ⚡ SISTEMA DE VALIDACIÓN PREVENTIVA ANTES DE ENVIAR AL BACKEND
  const onSubmit = (event) => {
    event.preventDefault()

    // 1. Sanitizar strings quitando espacios en blanco en los extremos
    const cleanName = formData.name.trim()
    const cleanLocation = formData.location.trim()
    const cleanDescription = formData.description.trim()
    const parsedCapacity = parseInt(formData.capacity, 10)

    // 2. Comprobar que no hayan quedado vacíos tras el trim
    if (cleanName.length < 3) {
      Swal.fire({
        title: "Nombre muy corto",
        text: "El nombre de la sala debe tener al menos 3 caracteres reales.",
        icon: "warning",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      })
      return
    }

    if (cleanLocation.length < 3) {
      Swal.fire({
        title: "Ubicación requerida",
        text: "Por favor, especifica una ubicación válida dentro del club.",
        icon: "warning",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      })
      return
    }

    // 3. Validar capacidad numérica coherente
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      Swal.fire({
        title: "Capacidad inválida",
        text: "La capacidad de alumnos debe ser un número entero mayor a cero.",
        icon: "warning",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      })
      return
    }

    if (cleanDescription.length < 5) {
      Swal.fire({
        title: "Descripción insuficiente",
        text: "Escribe una breve descripción del equipamiento de la sala (mínimo 5 caracteres).",
        icon: "warning",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      })
      return
    }

    // Si pasa todas las validaciones locales, mandamos el payload sanitizado
    handleSave({
      ...formData,
      name: cleanName,
      location: cleanLocation,
      description: cleanDescription,
      capacity: parsedCapacity,
      observation: formData.observation.trim(),
      image_url: formData.image_url.trim()
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="border-0 shadow-lg">
      <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: colors.purple, color: '#fff', borderBottom: `1px solid ${colors.inputBorder}` }} className="px-4 py-3">
        <Modal.Title className="fw-bold fs-5 text-uppercase tracking-wide">
          {selectedRoom ? "✏️ Editar Sala" : "🏢 Nueva Sala Deportiva"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body className="px-4 py-4 text-white-50" style={{ backgroundColor: colors.purple }}>
          
          {/* Nombre de la Sala */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-light opacity-75">Nombre de la Sala</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Ej: Sala de Spinning, Zona de Musculación"
              value={formData.name}
              onChange={handleChange}
              required
              className="text-white border-0 py-2"
              style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
            />
          </Form.Group>

          {/* Ubicación Interna */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-light opacity-75">Ubicación / Piso</Form.Label>
            <Form.Control
              type="text"
              name="location"
              placeholder="Ej: Piso 2, Sector Terraza"
              value={formData.location}
              onChange={handleChange}
              required
              className="text-white border-0 py-2"
              style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
            />
          </Form.Group>

          {/* Capacidad Máxima y Estado */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label className="small fw-semibold text-light opacity-75">Capacidad Alumnos</Form.Label>
                <Form.Control
                  type="number"
                  name="capacity"
                  placeholder="30"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  className="text-white border-0 py-2"
                  style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
                />
              </Form.Group>
            </div>
            <div className="col-md-6 mb-3 d-flex align-items-center pt-4">
              <Form.Check 
                type="switch"
                id="room-status-switch"
                name="status"
                label="Sala Disponible"
                checked={formData.status}
                onChange={handleChange}
                className="fw-semibold text-light tracking-wide custom-switch"
              />
            </div>
          </div>

          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-light opacity-75">Descripción del Espacio</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              placeholder="Detalla el equipamiento disponible..."
              value={formData.description}
              onChange={handleChange}
              required
              className="text-white border-0 py-2"
              style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
            />
          </Form.Group>
          
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: colors.purple, borderTop: `1px solid ${colors.inputBorder}` }} className="px-4 py-3">
          <Button variant="outline-light" onClick={handleClose} className="px-3 fw-semibold text-uppercase small opacity-75" style={{ borderRadius: '6px' }}>
            Cancelar
          </Button>
          <Button type="submit" className="px-4 fw-bold text-uppercase small border-0 shadow-sm" style={{ backgroundColor: colors.yellow, color: colors.purple, borderRadius: '6px' }}>
            Guardar Sala
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RoomFormModal