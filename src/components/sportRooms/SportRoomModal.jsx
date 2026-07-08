// src/components/sportRooms/SportRoomModal.jsx
import { useEffect, useState } from "react"
import { Button, Form, Modal, Spinner } from "react-bootstrap"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"
import { getUsers } from "../../services/userService"

const initialForm = {
  sport_id: "",
  room_id: "",
  coach_id: "",
  observation: "",
  status: true
}

function SportRoomModal({ show, handleClose, handleSave, selectedAssignment }) {
  const [formData, setFormData] = useState(initialForm)
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loadingSelects, setLoadingSelects] = useState(false)

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  // Cargar catálogos para los dropdowns
  useEffect(() => {
    if (!show) return

    const fetchDropdownData = async () => {
      try {
        setLoadingSelects(true)
        const [sportsRes, roomsRes, usersRes] = await Promise.all([
          getSports(),
          getRooms(),
          getUsers()
        ])
        
        setSports(sportsRes.data || [])
        setRooms(roomsRes.data || [])
        // Filtrar del listado general solo los que tengan rol 'coach'
        setCoaches((usersRes.data || []).filter(u => u.role === "coach"))
      } catch (err) {
        console.error("Error cargando catálogos de asignación", err)
      } finally {
        setLoadingSelects(false)
      }
    }

    fetchDropdownData()
  }, [show])

  useEffect(() => {
    if (selectedAssignment) {
      setFormData({
        sport_id: selectedAssignment.sport_id || "",
        room_id: selectedAssignment.room_id || "",
        coach_id: selectedAssignment.coach_id || "",
        observation: selectedAssignment.observation || "",
        status: selectedAssignment.status !== undefined ? selectedAssignment.status : true
      })
    } else {
      setFormData(initialForm)
    }
  }, [selectedAssignment, show])

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
          {selectedAssignment ? "✏️ Editar Asignación" : "🔗 Vincular Deporte + Sala"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body className="px-4 py-4 text-white-50" style={{ backgroundColor: colors.purple }}>
          {loadingSelects ? (
            <div className="text-center py-4">
              <Spinner animation="border" style={{ color: colors.yellow }} size="sm" />
              <p className="small mt-2 text-white-50">Sincronizando infraestructura...</p>
            </div>
          ) : (
            <>
              {/* Selector de Deporte */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-light opacity-75">Seleccionar Deporte</Form.Label>
                <Form.Select
                  name="sport_id"
                  value={formData.sport_id}
                  onChange={handleChange}
                  required
                  className="text-white border-0 py-2"
                  style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
                >
                  <option value="">-- Elija una disciplina --</option>
                  {sports.map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration} min)</option>)}
                </Form.Select>
              </Form.Group>

              {/* Selector de Sala */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-light opacity-75">Asignar Sala Deportiva</Form.Label>
                <Form.Select
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleChange}
                  required
                  className="text-white border-0 py-2"
                  style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
                >
                  <option value="">-- Elija un espacio físico --</option>
                  {rooms.map(r => <option key={r.id} value={r.id}>{r.name} - Capacidad: {r.capacity}</option>)}
                </Form.Select>
              </Form.Group>

              {/* Selector de Coach */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-light opacity-75">Profesor / Coach Encargado</Form.Label>
                <Form.Select
                  name="coach_id"
                  value={formData.coach_id}
                  onChange={handleChange}
                  required
                  className="text-white border-0 py-2"
                  style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
                >
                  <option value="">-- Asigne un profesor --</option>
                  {coaches.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </Form.Select>
              </Form.Group>

              {/* Observación Breve */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-light opacity-75">Observaciones adicionales</Form.Label>
                <Form.Control
                  type="text"
                  name="observation"
                  placeholder="Ej: Solo bloques matutinos, requiere llaves especiales"
                  value={formData.observation}
                  onChange={handleChange}
                  className="text-white border-0 py-2"
                  style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
                />
              </Form.Group>

              <Form.Check 
                type="switch"
                id="assignment-status-switch"
                name="status"
                label="Asignación Vigente"
                checked={formData.status}
                onChange={handleChange}
                className="fw-semibold text-light tracking-wide custom-switch"
              />
            </>
          )}
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: colors.purple, borderTop: `1px solid ${colors.inputBorder}` }} className="px-4 py-3">
          <Button variant="outline-light" onClick={handleClose} className="px-3 fw-semibold text-uppercase small opacity-75" style={{ borderRadius: '6px' }}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loadingSelects} className="px-4 fw-bold text-uppercase small border-0 shadow-sm" style={{ backgroundColor: colors.yellow, color: colors.purple, borderRadius: '6px' }}>
            Establecer Vínculo
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default SportRoomModal