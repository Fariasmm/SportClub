// src/pages/user/UserDashboard.jsx
import { useEffect, useState } from "react"
import { Badge, Button, Card, Col, Row, Table } from "react-bootstrap"
import Swal from "sweetalert2"

import { getSchedules, bookClass } from "../../services/scheduleService"
import { getMyReservations, cancelReservation } from "../../services/memberService"
import { getSportRooms } from "../../services/sportRoomService" 
import LoaderSpinner from "../../components/LoaderSpinner"
import SearchBar from "../../components/SearchBar" // 👈 Importamos tu nuevo buscador

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function UserDashboard() {
  const [classes, setClasses] = useState([])
  const [reservations, setReservations] = useState([])
  const [sportRoomsCatalog, setSportRoomsCatalog] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("") // 👈 Estado para filtrar la cartelera

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#12071f',
    innerBg: '#1c0b33',
    inputBorder: '#442373'
  }

  const getDayName = (dayNum) => {
    const index = parseInt(dayNum, 10) - 1;
    return DAYS[index] || `Día ${dayNum}`;
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [classesRes, reservationsRes, catalogRes] = await Promise.all([
        getSchedules(),
        getMyReservations(),
        getSportRooms() 
      ])
      
      const fetchedClasses = classesRes.data || classesRes || []
      const rawReservations = reservationsRes.data || reservationsRes || []
      const fetchedCatalog = catalogRes.data || catalogRes || []

      setSportRoomsCatalog(fetchedCatalog)
      setClasses(fetchedClasses)
      
      const filteredReservations = rawReservations.filter(res => {
        if (!res || !res.status) return false
        const currentStatus = String(res.status).toLowerCase().trim()
        if (
          currentStatus.includes("cancel") || 
          currentStatus.includes("inact") || 
          currentStatus === "false"
        ) {
          return false
        }
        return true
      })

      setReservations(filteredReservations)
    } catch (error) {
      console.error("Error cargando el dashboard del socio:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // =========================================================================
  // ⚡ LÓGICA DE FILTRADO DINÁMICO PARA EL SOCIO
  // =========================================================================
  const filteredClasses = classes.filter((c) => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true

    // 1. Buscamos la relación de la clase para extraer nombres reales
    const matchedRoom = sportRoomsCatalog.find(sr => {
      const targetId = String(c.sport_room_id || "")
      return String(sr.id || "") === targetId || String(sr.sport_room_id || "") === targetId
    })

    const relation = matchedRoom?.SportRoom || matchedRoom?.sport_room || matchedRoom?.Sport_Room || matchedRoom || c
    
    const sportName = (relation?.Sport?.name || relation?.sport?.name || matchedRoom?.sport_name || c.sport_name || "Clase").toLowerCase()
    const roomName = (relation?.Room?.name || relation?.room?.name || matchedRoom?.room_name || c.room_name || "Sala Común").toLowerCase()
    
    const coachObj = relation?.Coach || relation?.coach || relation?.User || relation?.user || relation?.Instructor
    const coachName = (coachObj?.full_name || coachObj?.name || relation?.coach_name || matchedRoom?.coach_name || "Profesor Asignado").toLowerCase()
    
    const dayName = getDayName(c.day_of_week).toLowerCase()

    // 2. Filtramos por coincidencia en cualquiera de los campos
    return (
      sportName.includes(term) ||
      roomName.includes(term) ||
      coachName.includes(term) ||
      dayName.includes(term)
    )
  })

  const handleBookClass = async (scheduleId) => {
    try {
      await bookClass(scheduleId)
      Swal.fire({
        title: "¡Inscripción Exitosa!",
        text: "Tu cupo ha sido reservado en el servidor.",
        icon: "success",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      })
      loadDashboardData() 
    } catch (error) {
      let errorMsg = error.message || "Límite de cupos alcanzado o cruce de horario.";
      if (error.details && Array.isArray(error.details)) {
        errorMsg = error.details.map(err => `• ${err.msg || err.message || err}`).join("<br/>");
      }

      Swal.fire({
        title: "No se pudo agendar",
        html: `<div style="text-align: left;">${errorMsg}</div>`,
        icon: "error",
        background: colors.purple,
        color: "#fff",
        confirmButtonColor: colors.yellow
      })
    }
  }

  const handleCancelBooking = async (resId, index) => {
    const result = await Swal.fire({
      title: "¿Liberar tu cupo?",
      text: "Esta acción notificará al sistema y cancelará tu asistencia.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, liberar",
      cancelButtonText: "Mantener cupo",
      confirmButtonColor: "#d33",
      background: colors.purple,
      color: "#fff"
    })

    if (result.isConfirmed) {
      try {
        if (resId) {
          await cancelReservation(resId)
        }
        
        Swal.fire({
          title: "Reserva Cancelada",
          text: "Cupo liberado correctamente.",
          icon: "success",
          background: colors.purple,
          color: "#fff",
          confirmButtonColor: colors.yellow
        })

        setReservations(prev => prev.filter((_, i) => i !== index))
      } catch (error) {
        if (error.message?.includes("ya se encuentra cancelada") || error.message?.includes("cancel")) {
          setReservations(prev => prev.filter((_, i) => i !== index))
        } else {
          Swal.fire({ 
            title: "Error", 
            text: error.message || "No se pudo procesar la cancelación.", 
            icon: "error", 
            background: colors.purple, 
            color: "#fff" 
          })
        }
      }
    }
  }

  if (loading) {
    return <LoaderSpinner message="Sincronizando cartelera fitness con el servidor..." />
  }

  return (
    <div className="py-2">
      <Row className="gap-4 gap-xl-0">
        
        {/* CARTELERA PRINCIPAL */}
        <Col xl={8}>
          <div className="mb-4">
            <h3 className="fw-bold text-uppercase tracking-wide m-0">🏋️‍♂️ Clases Disponibles</h3>
            <p className="text-white-50 small m-0 mt-1">Consulta la oferta horaria oficial e inscríbete de manera directa.</p>
          </div>

          {/* 🔍 BARRA DE BÚSQUEDA DEL SOCIO */}
          <div className="mb-3" style={{ maxWidth: '400px' }}>
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="🔍 Buscar por disciplina, sala, día o profesor..." 
            />
          </div>

          <Card className="border-0 shadow-lg text-white" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table variant="dark" hover className="m-0 align-middle" style={{ backgroundColor: colors.purple }}>
                  <thead style={{ borderBottom: `2px solid ${colors.inputBorder}` }}>
                    <tr className="text-white-50 text-uppercase small tracking-wider">
                      <th className="py-3 px-4">Bloque</th>
                      <th className="py-3">Disciplina</th>
                      <th className="py-3">Ubicación</th>
                      <th className="py-3">Profesor</th>
                      <th className="py-3 text-end px-4">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClasses.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-white-50">
                          {searchTerm ? "No se encontraron clases que coincidan con la búsqueda." : "No hay bloques de entrenamiento disponibles."}
                        </td>
                      </tr>
                    ) : (
                      filteredClasses.map((c, idx) => { // 👈 Añadido index de contingencia
                        const matchedRoom = sportRoomsCatalog.find(sr => {
                          const targetId = String(c.sport_room_id || "")
                          return String(sr.id || "") === targetId || String(sr.sport_room_id || "") === targetId
                        })

                        const relation = matchedRoom?.SportRoom || matchedRoom?.sport_room || matchedRoom?.Sport_Room || matchedRoom || c
                        
                        const sportName = relation?.Sport?.name || relation?.sport?.name || matchedRoom?.sport_name || c.sport_name || "Clase"
                        const roomName = relation?.Room?.name || relation?.room?.name || matchedRoom?.room_name || c.room_name || "Sala Común"
                        const coachObj = relation?.Coach || relation?.coach || relation?.User || relation?.user || relation?.Instructor
                        const coachName = coachObj?.full_name || coachObj?.name || relation?.coach_name || matchedRoom?.coach_name || "Profesor Asignado"

                        return (
                          // ⚡ LLAVE CORREGIDA ÚNICA PARA LAS FILAS DE LA TABLA
                          <tr key={`available-class-${c.id || idx}-${idx}`} style={{ borderBottom: `1px solid ${colors.inputBorder}` }}>
                            <td className="py-3 px-4">
                              <span className="fw-bold d-block text-warning small">{getDayName(c.day_of_week)}</span>
                              <span className="font-monospace small opacity-75">{c.start_time?.substring(0, 5)} - {c.end_time?.substring(0, 5)}</span>
                            </td>
                            <td className="py-3 fw-bold text-white">{sportName}</td>
                            <td className="py-3 text-white-50 small">🏢 {roomName}</td>
                            <td className="py-3 text-white-50 small">👤 {coachName}</td>
                            <td className="py-3 text-end px-4">
                              <Button size="sm" onClick={() => handleBookClass(c.id)} className="fw-bold text-uppercase px-3 border-0" style={{ backgroundColor: colors.yellow, color: colors.purple, fontSize: '0.7rem', borderRadius: '4px' }}>
                                Reservar
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* PANEL LATERAL DE RESERVAS ACTIVAS */}
        <Col xl={4}>
          <div className="mb-4">
            <h3 className="fw-bold text-uppercase tracking-wide m-0" style={{ color: colors.yellow }}>📅 Mis Reservas</h3>
            <p className="text-white-50 small m-0 mt-1">Control de tus asistencias semanales agendadas.</p>
          </div>
          <Card className="border-0 shadow-lg text-white" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
            <Card.Body className="p-3 d-flex flex-column gap-3">
              {reservations.length === 0 ? (
                <div className="text-center py-4 text-white-50 opacity-50 small">
                  ❌ No registras reservas vigentes en tu cuenta.
                </div>
              ) : (
                reservations.map((res, index) => {
                  const matchingSchedule = classes.find(c => String(c.id) === String(res.class_schedule_id))
                  
                  const matchedRoom = sportRoomsCatalog.find(sr => {
                    const targetId = String(matchingSchedule?.sport_room_id || "")
                    return String(sr.id || "") === targetId || String(sr.sport_room_id || "") === targetId
                  })

                  const relation = matchedRoom?.SportRoom || matchedRoom?.sport_room || matchedRoom?.Sport_Room || matchedRoom || res

                  const sportName = relation?.Sport?.name || relation?.sport?.name || matchedRoom?.sport_name || matchingSchedule?.sport_name || "Entrenamiento"
                  const roomName = relation?.Room?.name || relation?.room?.name || matchedRoom?.room_name || matchingSchedule?.room_name || "Sala Común"
                  
                  const coachObj = relation?.Coach || relation?.coach || relation?.User || relation?.user || relation?.Instructor
                  const coachName = coachObj?.full_name || coachObj?.name || relation?.coach_name || matchedRoom?.coach_name || "Profesor"
                  
                  const dayName = matchingSchedule ? getDayName(matchingSchedule.day_of_week) : "Asignado"
                  const timeRange = matchingSchedule ? `${matchingSchedule.start_time?.substring(0, 5)} - ${matchingSchedule.end_time?.substring(0, 5)}` : ""

                  return (
                    // ⚡ LLAVE CORREGIDA ÚNICA PARA LAS TARJETAS LATERALES DE RESERVA
                    <Card key={`active-res-${res.id || res.class_schedule_id || index}-${index}`} style={{ backgroundColor: colors.darkBg, border: `1px solid ${colors.inputBorder}` }} className="p-3 border-0 shadow-sm animate__animated animate__fadeIn">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-bold text-white m-0 text-uppercase" style={{ fontSize: '0.85rem' }}>{sportName}</h6>
                          <span className="extra-small text-white-50 font-monospace d-block mt-1">
                            🗓️ Día: <strong className="text-warning">{dayName} {timeRange}</strong>
                          </span>
                          <span className="extra-small text-white-50 d-block mt-1">
                            📍 {roomName} | 👤 {coachName}
                          </span>
                        </div>
                        <Badge bg="success" className="text-uppercase small" style={{ fontSize: '0.6rem' }}>Cupo OK</Badge>
                      </div>
                      <hr className="my-2 opacity-10" />
                      <div className="d-flex justify-content-end">
                        <Button size="sm" variant="outline-danger" onClick={() => handleCancelBooking(res.id, index)} className="extra-small fw-bold text-uppercase py-1 px-3" style={{ fontSize: '0.65rem', borderRadius: '4px' }}>
                          Cancelar Asistencia
                        </Button>
                      </div>
                    </Card>
                  )
                })
              )}
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  )
}

export default UserDashboard