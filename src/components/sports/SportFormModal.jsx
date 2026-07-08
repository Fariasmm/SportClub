// src/components/sports/SportFormModal.jsx
import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const initialForm = {
  name: "",
  objective: "",
  duration: "",
  status: true
}

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState(initialForm)

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  useEffect(() => {
    if (selectedSport) {
      setFormData({
        name: selectedSport.name || "",
        objective: selectedSport.objective || "",
        duration: selectedSport.duration || "",
        status: selectedSport.status !== undefined ? selectedSport.status : true
      })
    } else {
      setFormData(initialForm)
    }
  }, [selectedSport, show])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: name === "status" ? event.target.checked : value,
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    handleSave(formData)
  }

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="border-0 shadow-lg">
      <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: colors.purple, color: '#fff', borderBottom: `1px solid ${colors.inputBorder}` }} className="px-4 py-3">
        <Modal.Title className="fw-bold fs-5 text-uppercase tracking-wide">
          {selectedSport ? "✏️ Editar Disciplina" : "🏋️‍♂️ Nuevo Deporte"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body className="px-4 py-4 text-white-50" style={{ backgroundColor: colors.purple }}>
          
          {/* Nombre de la Disciplina */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-light opacity-75">Nombre del Deporte</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Ej: Crossfit, Zumba, Powerlifting"
              value={formData.name}
              onChange={handleChange}
              required
              className="text-white border-0 py-2"
              style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
            />
          </Form.Group>

          {/* Duración Estimada y Estado */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label className="small fw-semibold text-light opacity-75">Duración Clases (Minutos)</Form.Label>
                <Form.Control
                  type="number"
                  name="duration"
                  placeholder="60"
                  min="15"
                  max="180"
                  value={formData.duration}
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
                id="sport-status-switch"
                name="status"
                label="Clase Activa"
                checked={formData.status}
                onChange={handleChange}
                className="fw-semibold text-light tracking-wide custom-switch"
              />
            </div>
          </div>

          {/* Objetivo Principal */}
          <Form.Group className="mb-2">
            <Form.Label className="small fw-semibold text-light opacity-75">Objetivo del Deporte</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="objective"
              placeholder="Ej: Desarrollo de resistencia cardiovascular y fuerza general..."
              value={formData.objective}
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
            Guardar Deporte
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default SportFormModal