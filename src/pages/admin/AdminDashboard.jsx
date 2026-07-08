// src/pages/admin/AdminDashboard.jsx
import PageHeader from "../../components/PageHeader"

function AdminDashboard() {
  return (
    <div className="animate__animated animate__fadeIn">
      {/* El encabezado ya es inyectado por el Layout de manera limpia */}
      <div className="p-5 text-center bg-opacity-10 rounded-3" style={{ background: '#2b124c', border: '1px solid #442373' }}>
        <span className="display-3 mb-3 d-block">🏢</span>
        <h4 className="fw-bold text-white mb-2">Consola de Administración</h4>
        <p className="text-white-50 m-0 max-w-md mx-auto">
          Usa la barra superior para gestionar los usuarios del sistema, configurar las dependencias físicas, estructurar los bloques deportivos y controlar la agenda horaria del club.
        </p>
      </div>
    </div>
  )
}

export default AdminDashboard