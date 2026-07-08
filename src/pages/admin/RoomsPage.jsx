// src/pages/admin/RoomsPage.jsx
import { useEffect, useState } from "react"
import { Badge, Button, Card, Spinner, Row, Col } from "react-bootstrap"
import Swal from "sweetalert2"
import RoomFormModal from "../../components/rooms/RoomFormModal"
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../services/roomService"

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  const loadRooms = async () => {
    try {
      setLoading(true)
      const data = await getRooms()
      setRooms(data.data || [])
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
    loadRooms()
  }, [])

  const openCreateModal = () => {
    setSelectedRoom(null)
    setShowModal(true)
  }

  const openEditModal = (room) => {
    setSelectedRoom(room)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRoom(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, formData)
        Swal.fire({
          title: "Actualizada",
          text: "Sala actualizada correctamente",
          icon: "success",
          background: colors.purple,
          color: "#fff",
          confirmButtonColor: colors.yellow
        })
      } else {
        await createRoom(formData)
        Swal.fire({
          title: "Creada",
          text: "Sala deportiva registrada con éxito",
          icon: "success",
          background: colors.purple,
          color: "#fff",
          confirmButtonColor: colors.yellow
        })
      }
      closeModal()
      loadRooms()
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      })
    }
  }

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: "¿Eliminar sala?",
      text: `Se eliminará permanentemente la ${room.name}. Esta acción podría afectar horarios asignados.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      background: colors.purple,
      color: "#fff"
    })

    if (result.isConfirmed) {
      try {
        await deleteRoom(room.id)
        Swal.fire({
          title: "Eliminada",
          text: "Sala eliminada correctamente",
          icon: "success",
          background: colors.purple,
          color: "#fff",
          confirmButtonColor: colors.yellow
        })
        loadRooms()
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          background: colors.purple,
          color: "#fff",
          confirmButtonColor: colors.yellow
        })
      }
    }
  }

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-uppercase tracking-wide m-0" style={{ color: '#fff' }}>
            🏢 Gestión de Salas
          </h2>
          <p className="text-white-50 small m-0 mt-1">Administra la infraestructura, capacidades y zonas de entrenamiento.</p>
        </div>
        <Button 
          onClick={openCreateModal}
          className="fw-bold text-uppercase d-flex align-items-center gap-2 border-0 shadow-sm"
          style={{ backgroundColor: colors.yellow, color: colors.purple, padding: '10px 20px', borderRadius: '8px' }}
        >
          <span>➕</span> Nueva Sala
        </Button>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
          <Spinner animation="border" style={{ color: colors.yellow }} role="status" />
          <span className="text-white-50 small text-uppercase tracking-wider">Cargando salas...</span>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-5 opacity-50">No hay salas deportivas configuradas en el sistema.</div>
      ) : (
        <Row className="g-3">
          {rooms.map((room) => (
            <Col key={room.id} xs={12} md={6} xl={4}>
              <Card className="border-0 shadow-lg text-white h-100" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
                <Card.Body className="p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="fw-bold m-0 text-uppercase tracking-wide" style={{ fontSize: '1.1rem' }}>{room.name}</h4>
                      <Badge bg={room.status ? "success" : "secondary"} className="text-uppercase px-2 py-1">
                        {room.status ? "Activa" : "Mantenimiento"}
                      </Badge>
                    </div>
                    <p className="small text-white-50 mb-3">📍 {room.location}</p>
                    <p className="small opacity-75 mb-4" style={{ minHeight: '40px' }}>{room.description}</p>
                  </div>

                  <div className="pt-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: colors.inputBorder }}>
                    <span className="small text-white-50">Capacidad: <strong className="text-white">{room.capacity} alumnos</strong></span>
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline-light" className="fw-semibold text-uppercase px-3" onClick={() => openEditModal(room)} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline-danger" className="fw-semibold text-uppercase px-3" onClick={() => handleDelete(room)} style={{ fontSize: '0.7_rem', borderRadius: '4px' }}>
                        Borrar
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <RoomFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedRoom={selectedRoom}
      />
    </div>
  )
}

export default RoomsPage