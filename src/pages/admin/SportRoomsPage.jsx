// src/pages/admin/SportRoomsPage.jsx
import { useEffect, useState } from "react"
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import SportRoomModal from "../../components/sportRooms/SportRoomModal"
import { getSportRooms, createSportRoom, updateSportRoom, deleteSportRoom } from "../../services/sportRoomService"

function SportRoomsPage() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  const loadAssignments = async () => {
    try {
      setLoading(true)
      const data = await getSportRooms()
      setAssignments(data.data || [])
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  const handleSave = async (formData) => {
    try {
      if (selectedAssignment) {
        await updateSportRoom(selectedAssignment.id, formData)
        Swal.fire({ title: "Actualizado", text: "Asignación modificada con éxito", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      } else {
        await createSportRoom(formData)
        Swal.fire({ title: "Creado", text: "Nueva combinación fijada", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      }
      setShowModal(false)
      setSelectedAssignment(null)
      loadAssignments()
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
    }
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "¿Romper vínculo?",
      text: "Se cancelará esta configuración entre el deporte y la sala.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desvincular",
      cancelButtonText: "Conservar",
      background: colors.purple,
      color: "#fff",
      confirmButtonColor: "#d33"
    })

    if (result.isConfirmed) {
      try {
        await deleteSportRoom(item.id)
        Swal.fire({ title: "Removido", text: "Vínculo eliminado correctamente", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
        loadAssignments()
      } catch (error) {
        Swal.fire({ title: "Error", text: error.message, icon: "error", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      }
    }
  }

  // FUNCIONES DE AYUDA BLINDADAS: Prueban mayúsculas y minúsculas de la API para evitar la pantalla en blanco
  const getSportName = (item) => {
    if (!item) return "N/A"
    if (item.Sport && item.Sport.name) return item.Sport.name
    if (item.sport && item.sport.name) return item.sport.name
    return `Deporte #${item.sport_id}`
  }

  const getRoomName = (item) => {
    if (!item) return "N/A"
    if (item.Room && item.Room.name) return item.Room.name
    if (item.room && item.room.name) return item.room.name
    return `Sala #${item.room_id}`
  }

  const getCoachName = (item) => {
    if (!item) return "N/A"
    if (item.Coach && item.Coach.full_name) return item.Coach.full_name
    if (item.coach && item.coach.full_name) return item.coach.full_name
    return `Coach #${item.coach_id}`
  }

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-uppercase tracking-wide m-0" style={{ color: '#fff' }}>
            🔗 Gestión de Asignaciones
          </h2>
          <p className="text-white-50 small m-0 mt-1">Conecta disciplinas deportivas con sus salas físicas e instructores responsables.</p>
        </div>
        <Button 
          onClick={() => { setSelectedAssignment(null); setShowModal(true); }}
          className="fw-bold text-uppercase d-flex align-items-center gap-2 border-0 shadow-sm"
          style={{ backgroundColor: colors.yellow, color: colors.purple, padding: '10px 20px', borderRadius: '8px' }}
        >
          <span>➕</span> Nueva Asignación
        </Button>
      </div>

      <Card className="border-0 shadow-lg text-white" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
              <Spinner animation="border" style={{ color: colors.yellow }} role="status" />
              <span className="text-white-50 small text-uppercase tracking-wider">Mapeando infraestructura...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <Table variant="dark" hover className="m-0 align-middle" style={{ backgroundColor: colors.purple }}>
                <thead style={{ borderBottom: `2px solid ${colors.inputBorder}` }}>
                  <tr className="text-white-50 text-uppercase small tracking-wider">
                    <th className="py-3 px-4" style={{ width: '80px' }}>ID</th>
                    <th className="py-3">Deporte / Disciplina</th>
                    <th className="py-3">Sala Deportiva</th>
                    <th className="py-3">Coach a Cargo</th>
                    <th className="py-3">Observaciones</th>
                    <th className="py-3 text-end px-4" style={{ width: '180px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">No hay combinaciones registradas en el sistema.</td>
                    </tr>
                  ) : (
                    assignments.map((item) => (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${colors.inputBorder}` }}>
                        <td className="py-3 px-4 fw-bold text-white-50">#{item.id}</td>
                        <td className="py-3 fw-semibold text-white">{getSportName(item)}</td>
                        <td className="py-3 text-white">{getRoomName(item)}</td>
                        <td className="py-3 text-white-50">{getCoachName(item)}</td>
                        <td className="py-3 text-white-50 small">{item.observation || "Sin comentarios"}</td>
                        <td className="py-3 text-end px-4">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button size="sm" variant="outline-light" className="fw-semibold text-uppercase px-3" onClick={() => { setSelectedAssignment(item); setShowModal(true); }} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
                              Editar
                            </Button>
                            <Button size="sm" variant="outline-danger" className="fw-semibold text-uppercase px-3" onClick={() => handleDelete(item)} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
                              Remover
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

      <SportRoomModal show={showModal} handleClose={() => { setShowModal(false); setSelectedAssignment(null); }} handleSave={handleSave} selectedAssignment={selectedAssignment} />
    </div>
  )
}

export default SportRoomsPage