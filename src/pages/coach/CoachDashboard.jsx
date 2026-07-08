// src/pages/coach/CoachDashboard.jsx
import { useEffect, useState } from "react"
import { Badge, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"

// 🔥 IMPORTACIONES DE TUS SERVICIOS NATIVOS
import { getSchedules } from "../../services/scheduleService"
import { getSportRooms } from "../../services/sportRoomService"
import { getUser } from "../../services/authService"

function CoachDashboard() {
  const [myClasses, setMyClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUser = getUser()

  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  useEffect(() => {
    const loadMyAgenda = async () => {
      try {
        setLoading(true)
        
        // Traemos la grilla de horarios y las asignaciones en paralelo
        const [schedulesRes, sportRoomsRes] = await Promise.all([
          getSchedules(),
          getSportRooms()
        ])

        const allSchedules = schedulesRes.data || schedulesRes || []
        const allSportRooms = sportRoomsRes.data || sportRoomsRes || []

        // FILTRO EN CALIENTE: Rescatamos las asignaciones vinculadas a este Coach
        const myAssignedRoomIds = allSportRooms
          .filter(sr => String(sr.coach_id) === String(currentUser?.id))
          .map(sr => String(sr.id))

        // CRUCE FINAL: Dejamos solo los horarios que pertenezcan al coach
        const directCoachClasses = allSchedules.filter(sched => {
          return myAssignedRoomIds.includes(String(sched.sport_room_id))
        })

        setMyClasses(directCoachClasses)
      } catch (error) {
        Swal.fire({
          title: "Error de Sincronización",
          text: error.message || "No se pudo recuperar tu agenda desde el servidor.",
          icon: "error",
          background: colors.purple,
          color: "#fff",
          confirmButtonColor: colors.yellow
        })
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.id) {
      loadMyAgenda()
    }
  }, [currentUser?.id])

  return (
    <div className="py-2">
      <div className="mb-4">
        <h2 className="fw-bold text-uppercase tracking-wide m-0" style={{ color: '#fff' }}>
          💪 Mi Panel de Clases (Instructor)
        </h2>
        <p className="text-white-50 small m-0 mt-1">
          Bienvenido, <strong className="text-white">{currentUser?.full_name || "Profesor"}</strong>. Abajo se listan los bloques horarios que tienes asignados de forma exclusiva.
        </p>
      </div>

      <Card className="border-0 shadow-lg text-white" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
              <Spinner animation="border" style={{ color: colors.yellow }} role="status" />
              <span className="text-white-50 small text-uppercase tracking-wider">Sincronizando agenda del staff...</span>
            </div>
          ) : myClasses.length === 0 ? (
            <div className="text-center py-5 text-white-50 px-4">
              <p className="m-0 fs-5">📅 No registras bloques de entrenamiento programados a tu nombre para esta semana.</p>
              <p className="small opacity-50 mt-1">Cualquier cambio de última hora debe coordinarse con el Administrador.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table variant="dark" hover className="m-0 align-middle" style={{ backgroundColor: colors.purple }}>
                <thead style={{ borderBottom: `2px solid ${colors.inputBorder}` }}>
                  <tr className="text-white-50 text-uppercase small tracking-wider">
                    <th className="py-3 px-4" style={{ width: '80px' }}>ID</th>
                    <th className="py-3" style={{ width: '150px' }}>Día</th>
                    <th className="py-3" style={{ width: '180px' }}>Horario</th>
                    <th className="py-3">Disciplina / Deporte</th>
                    <th className="py-3">Sala Asignada</th>
                    <th className="py-3 text-end px-4" style={{ width: '150px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 🔥 CORREGIDO: Invocación limpia delegando la responsabilidad a ClassRow */}
                  {myClasses.map((clase) => (
                    <ClassRow 
                      key={clase.id} 
                      clase={clase} 
                      colors={colors} 
                      inputBorder={colors.inputBorder}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

// 🎯 MINI COMPONENTE PARA RESOLVER EL RENDERING DE FORMA LIMPIA POR FILA
function ClassRow({ clase, colors, inputBorder }) {
  const [sportName, setSportName] = useState("Cargando...")
  const [roomName, setRoomName] = useState("Cargando...")

  useEffect(() => {
    const fetchRowData = async () => {
      try {
        const response = await getSportRooms()
        const catalog = response.data || response || []
        const match = catalog.find(sr => String(sr.id) === String(clase.sport_room_id))
        
        const relation = match?.SportRoom || match?.sport_room || match?.Sport_Room || match
        setSportName(relation?.Sport?.name || relation?.sport?.name || match?.sport_name || "Clase Activa")
        setRoomName(relation?.Room?.name || relation?.room?.name || match?.room_name || "Gimnasio")
      } catch (e) {
        console.error(e)
      }
    }
    fetchRowData()
  }, [clase.sport_room_id])

  return (
    <tr style={{ borderBottom: `1px solid ${inputBorder}` }}>
      <td className="py-3 px-4 fw-bold text-white-50">#{clase.id}</td>
      <td className="py-3 fw-bold text-warning">{clase.day_of_week}</td>
      <td className="py-3">
        <Badge bg="dark" className="border border-secondary px-2 py-1.5 font-monospace text-uppercase" style={{ fontSize: '0.8rem', color: colors.yellow }}>
          ⏰ {clase.start_time?.substring(0, 5)} - {clase.end_time?.substring(0, 5)}
        </Badge>
      </td>
      <td className="py-3 fw-semibold text-white">{sportName}</td>
      <td className="py-3 text-white-50">🏢 {roomName}</td>
      <td className="py-3 text-end px-4">
        <Badge bg={clase.status ? "success" : "secondary"} className="text-uppercase px-2 py-1">
          {clase.status ? "Vigente" : "Pausada"}
        </Badge>
      </td>
    </tr>
  )
}

export default CoachDashboard