// src/pages/admin/SchedulesPage.jsx
import { useEffect, useState } from "react"
import { Badge, Button, Card, Spinner, Table, Row, Col } from "react-bootstrap"
import Swal from "sweetalert2"
import ScheduleFormModal from "../../components/schedules/ScheduleFormModal"
import SearchBar from "../../components/SearchBar" // 👈 Importamos el buscador
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from "../../services/scheduleService"
import { getSportRooms } from "../../services/sportRoomService"

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function SchedulesPage() {
  const [schedules, setSchedules] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [searchTerm, setSearchTerm] = useState("") // 👈 Estado para el buscador

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  const getDayName = (dayNum) => {
    const index = parseInt(dayNum, 10) - 1;
    return DAYS[index] || `Día ${dayNum}`;
  }

  const handleCatchError = (error, defaultTitle = "Error") => {
    let errorMsg = error.message || "Ocurrió un inconveniente inesperado.";
    if (error.details && Array.isArray(error.details)) {
      errorMsg = error.details.map(err => `• ${err.msg || err.message || err}`).join("<br/>");
    } else if (error.details && typeof error.details === 'object') {
      errorMsg = Object.values(error.details).map(msg => `• ${msg}`).join("<br/>");
    }
    Swal.fire({
      title: defaultTitle,
      html: `<div style="text-align: left; font-size: 0.95rem;">${errorMsg}</div>`,
      icon: "error",
      background: colors.purple,
      color: "#fff",
      confirmButtonColor: colors.yellow
    });
  }

  const loadSchedulesAndRelations = async () => {
    try {
      setLoading(true)
      const [schedulesRes, assignmentsRes] = await Promise.all([
        getSchedules(),
        getSportRooms()
      ])
      setSchedules(schedulesRes.data || [])
      setAssignments(assignmentsRes.data || [])
    } catch (error) {
      handleCatchError(error, "Error de Sincronización")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSchedulesAndRelations()
  }, [])

  // =========================================================================
  // ⚡ LÓGICA DE CRUCE LOCAL (USADOS TAMBIÉN PARA EL FILTRO DEL BUSCADOR)
  // =========================================================================
  const findLinkedAssignment = (sc) => {
    if (!sc) return null
    const targetId = sc.sport_room_id || sc.SportRoomId
    return assignments.find(a => a.id === parseInt(targetId, 10))
  }

  const getSportName = (sc) => {
    const linked = findLinkedAssignment(sc)
    if (linked) {
      return linked.Sport?.name || linked.sport?.name || `Deporte #${linked.sport_id}`
    }
    const sr = sc?.SportRoom || sc?.sport_room
    return sr?.Sport?.name || sr?.sport?.name || "N/A"
  }

  const getRoomName = (sc) => {
    const linked = findLinkedAssignment(sc)
    if (linked) {
      return linked.Room?.name || linked.room?.name || `Sala #${linked.room_id}`
    }
    const sr = sc?.SportRoom || sc?.sport_room
    return sr?.Room?.name || sr?.room?.name || "N/A"
  }

  const getCoachName = (sc) => {
    const linked = findLinkedAssignment(sc)
    if (linked) {
      return linked.Coach?.full_name || linked.coach?.full_name || linked.User?.full_name || linked.user?.full_name || `Coach #${linked.coach_id}`
    }
    const sr = sc?.SportRoom || sc?.sport_room
    return sr?.Coach?.full_name || sr?.coach?.full_name || sr?.User?.full_name || sr?.user?.full_name || "N/A"
  }

  // ⚡ FILTRADO AVANZADO DE BLOQUES HORARIOS
  const filteredSchedules = schedules.filter(sc => {
    const term = searchTerm.toLowerCase()
    const sportName = getSportName(sc).toLowerCase()
    const roomName = getRoomName(sc).toLowerCase()
    const coachName = getCoachName(sc).toLowerCase()
    const dayName = getDayName(sc.day_of_week).toLowerCase()
    
    return (
      sportName.includes(term) ||
      roomName.includes(term) ||
      coachName.includes(term) ||
      dayName.includes(term)
    )
  })

  const handleSave = async (formData) => {
    try {
      if (selectedSchedule) {
        await updateSchedule(selectedSchedule.id, formData)
        Swal.fire({ title: "Actualizado", text: "Horario modificado correctamente", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      } else {
        await createSchedule(formData)
        Swal.fire({ title: "Planificado", text: "Nueva clase fijada en el calendario", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      }
      setShowModal(false)
      setSelectedSchedule(null)
      loadSchedulesAndRelations()
    } catch (error) {
      handleCatchError(error, "Error al Guardar")
    }
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "¿Suspender horario?",
      text: "Se eliminará esta clase del cronograma semanal.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, suspender",
      cancelButtonText: "Mantener",
      background: colors.purple,
      color: "#fff",
      confirmButtonColor: "#d33"
    })
    if (result.isConfirmed) {
      try {
        await deleteSchedule(item.id)
        Swal.fire({ title: "Eliminado", text: "Clase removida del itinerario", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
        loadSchedulesAndRelations()
      } catch (error) {
        handleCatchError(error, "Error al Suspender")
      }
    }
  }

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-uppercase tracking-wide m-0" style={{ color: '#fff' }}>
            📅 Itinerario de Clases
          </h2>
          <p className="text-white-50 small m-0 mt-1">Planifica los días, bloques de horas y disponibilidad de la oferta deportiva.</p>
        </div>
        <Button 
          onClick={() => { setSelectedSchedule(null); setShowModal(true); }}
          className="fw-bold text-uppercase d-flex align-items-center gap-2 border-0 shadow-sm"
          style={{ backgroundColor: colors.yellow, color: colors.purple, padding: '10px 20px', borderRadius: '8px' }}
        >
          <span>➕</span> Programar Clase
        </Button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar por día, disciplina, sala o instructor..." 
          />
        </Col>
      </Row>

      <Card className="border-0 shadow-lg text-white" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
              <Spinner animation="border" style={{ color: colors.yellow }} role="status" />
              <span className="text-white-50 small text-uppercase tracking-wider">Cargando cronograma semanal...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <Table variant="dark" hover className="m-0 align-middle" style={{ backgroundColor: colors.purple }}>
                <thead style={{ borderBottom: `2px solid ${colors.inputBorder}` }}>
                  <tr className="text-white-50 text-uppercase small tracking-wider">
                    <th className="py-3 px-4" style={{ width: '80px' }}>ID</th>
                    <th className="py-3" style={{ width: '140px' }}>Día</th>
                    <th className="py-3" style={{ width: '160px' }}>Bloque Horario</th>
                    <th className="py-3">Disciplina</th>
                    <th className="py-3">Sala</th>
                    <th className="py-3">Instructor</th>
                    <th className="py-3 text-end px-4" style={{ width: '180px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.length === 0 ? ( // 👈 Mapeamos el arreglo filtrado
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-white-50">
                        {searchTerm ? "No se encontraron clases para esta búsqueda." : "No hay bloques horarios establecidos."}
                      </td>
                    </tr>
                  ) : (
                    filteredSchedules.map((sc) => ( // 👈 Mapeamos el arreglo filtrado
                      <tr key={sc.id} style={{ borderBottom: `1px solid ${colors.inputBorder}` }}>
                        <td className="py-3 px-4 fw-bold text-white-50">#{sc.id}</td>
                        <td className="py-3 fw-bold text-light">{getDayName(sc.day_of_week)}</td>
                        <td className="py-3">
                          <Badge bg="dark" className="border border-secondary px-2 py-1.5 font-monospace" style={{ fontSize: '0.8rem', color: colors.yellow }}>
                            ⏰ {sc.start_time?.substring(0, 5)} - {sc.end_time?.substring(0, 5)}
                          </Badge>
                        </td>
                        <td className="py-3 fw-semibold text-white">{getSportName(sc)}</td>
                        <td className="py-3 text-white-50">{getRoomName(sc)}</td>
                        <td className="py-3 text-white-50 small">{getCoachName(sc)}</td>
                        <td className="py-3 text-end px-4">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button size="sm" variant="outline-light" className="fw-semibold text-uppercase px-3" onClick={() => { setSelectedSchedule(sc); setShowModal(true); }} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
                              Editar
                            </Button>
                            <Button size="sm" variant="outline-danger" className="fw-semibold text-uppercase px-3" onClick={() => handleDelete(sc)} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <ScheduleFormModal show={showModal} handleClose={() => { setShowModal(false); setSelectedSchedule(null); }} handleSave={handleSave} selectedSchedule={selectedSchedule} />
    </div>
  )
}

export default SchedulesPage