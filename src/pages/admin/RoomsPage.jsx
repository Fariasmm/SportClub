// src/pages/admin/RoomsPage.jsx
import { useEffect, useState } from "react"
import { Badge, Button, Card, Spinner, Row, Col } from "react-bootstrap"
import Swal from "sweetalert2"
import RoomFormModal from "../../components/rooms/RoomFormModal"
import SearchBar from "../../components/SearchBar" // 👈 Importamos el buscador
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../services/roomService"

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [searchTerm, setSearchTerm] = useState("") // 👈 Estado para el buscador

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  const handleCatchError = (error, defaultTitle = "Error") => {
    let errorMsg = "";
    if (error.details && Array.isArray(error.details)) {
      errorMsg = error.details.map(err => `• ${err.msg || err.message || err}`).join("<br/>");
    } else if (error.details && typeof error.details === 'object') {
      errorMsg = Object.entries(error.details).map(([key, val]) => `• <strong>${key}</strong>: ${val}`).join("<br/>");
    } else if (error.rawResponse && typeof error.rawResponse === 'object') {
      const extraKeys = Object.keys(error.rawResponse).filter(k => k !== 'message' && k !== 'error' && k !== 'ok');
      if (extraKeys.length > 0) {
        errorMsg = extraKeys.map(key => {
          const val = error.rawResponse[key];
          return `• <strong>${key}</strong>: ${typeof val === 'object' ? JSON.stringify(val) : val}`;
        }).join("<br/>");
      }
    }
    if (!errorMsg) {
      errorMsg = `• <strong>Datos inválidos:</strong> Por favor, verifica que todos los campos obligatorios estén llenos y que la capacidad sea mayor a 0.`;
    }
    Swal.fire({
      title: defaultTitle,
      html: `<div style="text-align: left; font-size: 0.95rem; line-height: 1.5;">${errorMsg}</div>`,
      icon: "error",
      background: colors.purple,
      color: "#fff",
      confirmButtonColor: colors.yellow
    });
  }

  const loadRooms = async () => {
    try {
      setLoading(true)
      const data = await getRooms()
      setRooms(data.data || [])
    } catch (error) {
      handleCatchError(error, "Error al Cargar Salas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  // ⚡ FILTRADO REACTIVO DE LAS SALAS
  const filteredRooms = rooms.filter(room => {
    const term = searchTerm.toLowerCase()
    return (
      room.name?.toLowerCase().includes(term) ||
      room.location?.toLowerCase().includes(term) ||
      room.description?.toLowerCase().includes(term)
    )
  })

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
        Swal.fire({ title: "Actualizada", text: "Sala actualizada correctamente", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      } else {
        await createRoom(formData)
        Swal.fire({ title: "Creada", text: "Sala deportiva registrada con éxito", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      }
      closeModal()
      loadRooms()
    } catch (error) {
      handleCatchError(error, "Error en Formulario de Sala")
    }
  }

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: "¿Eliminar sala?",
      text: `Se eliminará permanentemente la ${room.name}.`,
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
        await deleteRoom(room.id)
        Swal.fire({ title: "Eliminada", text: "Sala eliminada correctamente", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
        loadRooms()
      } catch (error) {
        handleCatchError(error, "Error al Eliminar Sala")
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

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar por sala, ubicación o descripción..." 
          />
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
          <Spinner animation="border" style={{ color: colors.yellow }} role="status" />
          <span className="text-white-50 small text-uppercase tracking-wider">Cargando salas...</span>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-5 opacity-50 text-white-50">
          {searchTerm ? "No se encontraron salas para esta búsqueda." : "No hay salas deportivas configuradas."}
        </div>
      ) : (
        <Row className="g-3">
          {filteredRooms.map((room) => ( // 👈 Mapeamos el arreglo filtrado
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
                      <Button size="sm" variant="outline-danger" className="fw-semibold text-uppercase px-3" onClick={() => handleDelete(room)} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
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

      <RoomFormModal show={showModal} handleClose={closeModal} handleSave={handleSave} selectedRoom={selectedRoom} />
    </div>
  )
}

export default RoomsPage