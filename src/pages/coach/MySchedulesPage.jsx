// src/pages/coach/MySchedulesPage.jsx
import { useEffect, useState } from "react"
import { Card, Table, Badge } from "react-bootstrap"
import Swal from "sweetalert2"

// IMPORTACIÓN DE NUESTROS COMPONENTES REUTILIZABLES
import PageHeader from "../../components/PageHeader"
import LoaderSpinner from "../../components/LoaderSpinner"
import { getSchedules } from "../../services/scheduleService"
import { getSportRooms } from "../../services/sportRoomService"
import { getUser } from "../../services/authService"

function MySchedulesPage() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUser = getUser()

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  useEffect(() => {
    const loadCoachSchedules = async () => {
      try {
        setLoading(true)
        
        // Traemos en paralelo los horarios y las asignaciones
        const [schedulesRes, sportRoomsRes] = await Promise.all([
          getSchedules(),
          getSportRooms()
        ])

        const allSchedules = schedulesRes.data || schedulesRes || []
        const allSportRooms = sportRoomsRes.data || sportRoomsRes || []

        // Filtramos las asignaciones que pertenecen a este profesor
        const myAssignedRoomIds = allSportRooms
          .filter(sr => String(sr.coach_id) === String(currentUser?.id))
          .map(sr => String(sr.id))

        // Dejamos solo los bloques de tiempo que le corresponden
        const directCoachClasses = allSchedules.filter(sched => {
          return myAssignedRoomIds.includes(String(sched.sport_room_id))
        })

        setSchedules(directCoachClasses)
      } catch (error) {
        console.error(error)
        Swal.fire({
          title: "Error",
          text: error.message || "No se pudo cargar la planificación horaria.",
          icon: "error",
          background: colors.purple,
          color: "#fff"
        })
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.id) {
      loadCoachSchedules()
    }
  }, [currentUser?.id])

  if (loading) {
    return <LoaderSpinner message="Sincronizando tu agenda horaria..." />
  }

  return (
    <div className="py-2">
      <PageHeader 
        title="📅 Mi Horario Semanal" 
        description="Planificación y bloques de tiempo asignados para tus clases en el club." 
      />

      <Card className="border-0 shadow-lg text-white" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table variant="dark" hover className="m-0 align-middle" style={{ backgroundColor: colors.purple }}>
              <thead style={{ borderBottom: `2px solid ${colors.inputBorder}` }}>
                <tr className="text-white-50 text-uppercase small tracking-wider">
                  <th className="py-3 px-4">Día</th>
                  <th className="py-3">Bloque de Tiempo</th>
                  <th className="py-3">Disciplina / Clase</th>
                  <th className="py-3">Sala / Ubicación</th>
                  <th className="py-3 text-end px-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-white-50">
                      📭 No registras bloques horarios asignados para esta semana.
                    </td>
                  </tr>
                ) : (
                  schedules.map((item) => (
                    <ScheduleRow 
                      key={item.id} 
                      clase={item} 
                      colors={colors} 
                    />
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

// 🎯 MINI COMPONENTE PARA RESOLVER EL CRUCE EN ESTA VISTA
function ScheduleRow({ clase, colors }) {
  const [sportName, setSportName] = useState("Cargando...")
  const [roomName, setRoomName] = useState("Cargando...")

  useEffect(() => {
    const fetchRowData = async () => {
      try {
        const response = await getSportRooms()
        const catalog = response.data || response || []
        const match = catalog.find(sr => String(sr.id) === String(clase.sport_room_id))
        
        const relation = match?.SportRoom || match?.sport_room || match?.Sport_Room || match
        setSportName(relation?.Sport?.name || relation?.sport?.name || match?.sport_name || "CrossFit")
        setRoomName(relation?.Room?.name || relation?.room?.name || match?.room_name || "Cancha Fútbol 2")
      } catch (e) {
        console.error(e)
      }
    }
    fetchRowData()
  }, [clase.sport_room_id])

  return (
    <tr style={{ borderBottom: `1px solid #442373` }}>
      <td className="py-3 px-4 fw-bold text-warning">
        🗓️ {clase.day_of_week}
      </td>
      <td className="py-3 font-monospace text-white">
        {clase.start_time?.substring(0, 5)} - {clase.end_time?.substring(0, 5)}
      </td>
      <td className="py-3 fw-bold text-white">{sportName}</td>
      <td className="py-3 text-white-50 small">🏢 {roomName}</td>
      <td className="py-3 text-end px-4">
        <Badge bg="success" className="text-uppercase small px-3 py-1">
          Vigente
        </Badge>
      </td>
    </tr>
  )
}

export default MySchedulesPage