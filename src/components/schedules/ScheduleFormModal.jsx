// src/components/schedules/ScheduleFormModal.jsx
import { useEffect, useState } from "react"
import { Button, Form, Modal, Spinner } from "react-bootstrap"
import { getSportRooms } from "../../services/sportRoomService"

const initialForm = {
  sport_room_id: "",
  day_of_week: "",
  start_time: "",
  end_time: "",
  status: true
}

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function ScheduleFormModal({ show, handleClose, handleSave, selectedSchedule }) {
  const [formData, setFormData] = useState(initialForm)
  const [assignments, setAssignments] = useState([])
  const [loadingSelect, setLoadingSelect] = useState(false)
  
  // Estado para la barra de búsqueda en el modal
  const [searchTerm, setSearchTerm] = useState("")

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  useEffect(() => {
    if (!show) return
    const fetchAssignments = async () => {
      try {
        setLoadingSelect(true)
        const res = await getSportRooms()
        setAssignments(res.data || [])
      } catch (err) {
        console.error("Error cargando asignaciones para horarios", err)
      } finally {
        setLoadingSelect(false)
      }
    }
    fetchAssignments()
    setSearchTerm("") // Resetear la barra de búsqueda al abrir el modal
  }, [show])

  useEffect(() => {
    if (selectedSchedule) {
      setFormData({
        sport_room_id: selectedSchedule.sport_room_id || "",
        day_of_week: selectedSchedule.day_of_week !== undefined ? selectedSchedule.day_of_week : "",
        start_time: selectedSchedule.start_time?.substring(0, 5) || "",
        end_time: selectedSchedule.end_time?.substring(0, 5) || "",
        status: selectedSchedule.status !== undefined ? selectedSchedule.status : true
      })
    } else {
      setFormData(initialForm)
    }
  }, [selectedSchedule, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    let finalValue = value;
    if (name === "day_of_week") {
      finalValue = value !== "" ? parseInt(value, 10) : "";
    } else if (name === "status") {
      finalValue = e.target.checked;
    }

    setFormData({
      ...formData,
      [name]: finalValue
    })
  }

  const formatAssignmentLabel = (item) => {
    const sportName = item.Sport?.name || item.sport?.name || `Deporte #${item.sport_id}`
    const roomName = item.Room?.name || item.room?.name || `Sala #${item.room_id}`
    const coachName = item.Coach?.full_name || item.coach?.full_name || "Sin Coach"
    return `${sportName} ➔ ${roomName} (${coachName})`
  }

  // Filtrado reactivo según el término buscado
  const filteredAssignments = assignments.filter(item => {
    const label = formatAssignmentLabel(item).toLowerCase();
    return label.includes(searchTerm.toLowerCase());
  })

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="border-0 shadow-lg">
      <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: colors.purple, color: '#fff', borderBottom: `1px solid ${colors.inputBorder}` }} className="px-4 py-3">
        <Modal.Title className="fw-bold fs-5 text-uppercase tracking-wide">
          {selectedSchedule ? "✏️ Editar Bloque Horario" : "📅 Planificar Nueva Clase"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
        <Modal.Body className="px-4 py-4 text-white-50" style={{ backgroundColor: colors.purple }}>
          {loadingSelect ? (
            <div className="text-center py-4">
              <Spinner animation="border" style={{ color: colors.yellow }} size="sm" />
              <p className="small mt-2 text-white-50">Sincronizando asignaciones activas...</p>
            </div>
          ) : (
            <>
              {/* Buscador de Asignaciones */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-light opacity-75">🔍 Buscar Configuración (Deporte, Sala o Instructor)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escribe para filtrar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-white border-0 py-2"
                  style={{ backgroundColor: colors.darkBg, borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </Form.Group>

              {/* Selector de Asignación */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-light opacity-75">Seleccionar Configuración del Club</Form.Label>
                <Form.Select
                  name="sport_room_id"
                  value={formData.sport_room_id}
                  onChange={handleChange}
                  required
                  className="text-white border-0 py-2"
                  style={{ backgroundColor: colors.darkBg, borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  <option value="">-- Elija un vínculo (Deporte + Sala) --</option>
                  {filteredAssignments.map(item => (
                    <option key={item.id} value={item.id}>{formatAssignmentLabel(item)}</option>
                  ))}
                </Form.Select>
                {searchTerm && filteredAssignments.length === 0 && (
                  <Form.Text className="text-danger small mt-1 d-block">No se encontraron combinaciones que coincidan.</Form.Text>
                )}
              </Form.Group>

              {/* Día de la semana */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-light opacity-75">Día de la Semana</Form.Label>
                <Form.Select
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleChange}
                  required
                  className="text-white border-0 py-2"
                  style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
                >
                  <option value="">-- Seleccione un día --</option>
                  {DAYS.map((d, index) => (
                    <option key={d} value={index + 1}>{d}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Horas (Inicio y Fin) */}
              <div className="row mb-3">
                <div className="col-6">
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-light opacity-75">Hora de Inicio</Form.Label>
                    <Form.Control
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      required
                      className="text-white border-0 py-2"
                      style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-light opacity-75">Hora de Término</Form.Label>
                    <Form.Control
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      required
                      className="text-white border-0 py-2"
                      style={{ backgroundColor: colors.darkBg, borderRadius: '6px' }}
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Check 
                type="switch"
                id="schedule-status-switch"
                name="status"
                label="Bloque Horario Vigente"
                checked={formData.status}
                onChange={handleChange}
                className="fw-semibold text-light tracking-wide custom-switch mt-3"
              />
            </>
          )}
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: colors.purple, borderTop: `1px solid ${colors.inputBorder}` }} className="px-4 py-3">
          <Button variant="outline-light" onClick={handleClose} className="px-3 fw-semibold text-uppercase small opacity-75" style={{ borderRadius: '6px' }}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loadingSelect} className="px-4 fw-bold text-uppercase small border-0 shadow-sm" style={{ backgroundColor: colors.yellow, color: colors.purple, borderRadius: '6px' }}>
            Fijar Horario
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ScheduleFormModal