// src/pages/admin/SportRoomsPage.jsx
import { useEffect, useState } from "react"
import { Badge, Button, Card, Spinner, Table, Row, Col } from "react-bootstrap"
import Swal from "sweetalert2"
import SportRoomModal from "../../components/sportRooms/SportRoomModal"
import SearchBar from "../../components/SearchBar" // 👈 Importamos el buscador
import { getSportRooms, createSportRoom, updateSportRoom, deleteSportRoom } from "../../services/sportRoomService"

function SportRoomsPage() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [searchTerm, setSearchTerm] = useState("") // 👈 Estado para la búsqueda

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
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

  const loadAssignments = async () => {
    try {
      setLoading(true)
      const data = await getSportRooms()
      setAssignments(data.data || data || [])
    } catch (error) {
      handleCatchError(error, "Error de Carga")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  // Helpers internos para obtener los textos limpios en cada fila
  const getSportLabel = (item) => item.Sport?.name || item.sport?.name || `Deporte #${item.sport_id}`
  const getRoomLabel = (item) => item.Room?.name || item.room?.name || `Sala #${item.room_id}`
  const getCoachLabel = (item) => item.Coach?.full_name || item.coach?.full_name || "Sin Coach"

  // ⚡ FILTRADO REACTIVO DE ASIGNACIONES (CRUZA DEPORTE, SALA Y PROFESOR)
  const filteredAssignments = assignments.filter(item => {
    const term = searchTerm.toLowerCase()
    const sportName = getSportLabel(item).toLowerCase()
    const roomName = getRoomLabel(item).toLowerCase()
    const coachName = getCoachLabel(item).toLowerCase()

    return (
      sportName.includes(term) ||
      roomName.includes(term) ||
      coachName.includes(term)
    )
  })

  const openCreateModal = () => {
    setSelectedAssignment(null)
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setSelectedAssignment(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAssignment(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedAssignment) {
        await updateSportRoom(selectedAssignment.id, formData)
        Swal.fire({ title: "Actualizado", text: "Asignación modificada con éxito", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      } else {
        await createSportRoom(formData)
        Swal.fire({ title: "Asignado", text: "Nueva configuración guardada", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      }
      closeModal()
      loadAssignments()
    } catch (error) {
      handleCatchError(error, "Error en Asignación")
    }
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "¿Eliminar asignación?",
      text: "Esto desconectará el deporte de la sala y afectará a los horarios programados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      background: colors.purple,
      color: "#fff"
    })

    if (result.isConfirmed) {
      try {
        await deleteSportRoom(item.id)
        Swal.fire({ title: "Eliminado", text: "Vínculo removido con éxito", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
        loadAssignments()
      } catch (error) {
        handleCatchError(error, "Error al Eliminar")
      }
    }
  }

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-uppercase tracking-wide m-0" style={{ color: '#fff' }}>
            🔗 Configuración del Club
          </h2>
          <p className="text-white-50 small m-0 mt-1">Vincula disciplinas deportivas con zonas de entrenamiento y profesores designados.</p>
        </div>
        <Button 
          onClick={openCreateModal}
          className="fw-bold text-uppercase d-flex align-items-center gap-2 border-0 shadow-sm"
          style={{ backgroundColor: colors.yellow, color: colors.purple, padding: '10px 20px', borderRadius: '8px' }}
        >
          <span>➕</span> Nueva Asignación
        </Button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar por disciplina, sala o profesor..." 
          />
        </Col>
      </Row>

      <Card className="border-0 shadow-lg text-white" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
              <Spinner animation="border" style={{ color: colors.yellow }} role="status" />
              <span className="text-white-50 small text-uppercase tracking-wider">Cargando asignaciones...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <Table variant="dark" hover className="m-0 align-middle" style={{ backgroundColor: colors.purple }}>
                <thead style={{ borderBottom: `2px solid ${colors.inputBorder}` }}>
                  <tr className="text-white-50 text-uppercase small tracking-wider">
                    <th className="py-3 px-4" style={{ width: '80px' }}>ID</th>
                    <th className="py-3">Disciplina</th>
                    <th className="py-3">Sala / Ubicación</th>
                    <th className="py-3">Profesor / Instructor</th>
                    <th className="py-3" style={{ width: '120px' }}>Estado</th>
                    <th className="py-3 text-end px-4" style={{ width: '180px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.length === 0 ? ( // 👈 Mapeamos el arreglo filtrado
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">
                        {searchTerm ? "No se encontraron asignaciones para esta búsqueda." : "No hay vinculaciones configuradas."}
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((item) => ( // 👈 Mapeamos el arreglo filtrado
                      <tr key={item.id} style={{ borderBottom: `1px solid ${colors.inputBorder}` }}>
                        <td className="py-3 px-4 fw-bold text-white-50">#{item.id}</td>
                        <td className="py-3 fw-semibold text-white">{getSportLabel(item)}</td>
                        <td className="py-3 text-white-50">{getRoomLabel(item)}</td>
                        <td className="py-3 text-white-50 small">{getCoachLabel(item)}</td>
                        <td className="py-3">
                          <Badge bg={item.status ? "success" : "secondary"} className="text-uppercase px-2 py-1">
                            {item.status ? "Activa" : "Inactiva"}
                          </Badge>
                        </td>
                        <td className="py-3 text-end px-4">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button size="sm" variant="outline-light" className="fw-semibold text-uppercase px-3" onClick={() => openEditModal(item)} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
                              Editar
                            </Button>
                            <Button size="sm" variant="outline-danger" className="fw-semibold text-uppercase px-3" onClick={() => handleDelete(item)} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
                              Borrar
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

      <SportRoomModal show={showModal} handleClose={closeModal} handleSave={handleSave} selectedAssignment={selectedAssignment} />
    </div>
  )
}

export default SportRoomsPage