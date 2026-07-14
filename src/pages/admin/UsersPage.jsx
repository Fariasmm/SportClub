// src/pages/admin/UsersPage.jsx
import { useEffect, useState } from "react"
import { Badge, Button, Card, Spinner, Table, Row, Col } from "react-bootstrap"
import Swal from "sweetalert2"
import UserFormModal from "../../components/users/UserFormModal"
import SearchBar from "../../components/SearchBar" // 👈 Importamos el buscador
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../services/userService"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
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
      html: `<div style="text-align: left; font-size: 0.95rem;">
              <strong>El servidor rechazó la solicitud por lo siguiente:</strong><br/><br/>
              ${errorMsg}
             </div>`,
      icon: "error",
      background: colors.purple,
      color: "#fff",
      confirmButtonColor: colors.yellow
    });
  }

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data.data || data || [])
    } catch (error) {
      handleCatchError(error, "Error al Cargar Usuarios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // ⚡ FILTRADO REACTIVO DE USUARIOS
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase()
    return (
      user.full_name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
    )
  })

  const openCreateModal = () => {
    setSelectedUser(null)
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData)
        Swal.fire({
          title: "Actualizado",
          text: "Usuario actualizado correctamente",
          icon: "success",
          background: colors.purple,
          color: "#fff",
          confirmButtonColor: colors.yellow
        })
      } else {
        await createUser(formData)
        Swal.fire({
          title: "Creado",
          text: "Usuario creado correctamente",
          icon: "success",
          background: colors.purple,
          color: "#fff",
          confirmButtonColor: colors.yellow
        })
      }
      closeModal()
      loadUsers()
    } catch (error) {
      handleCatchError(error, "Error en Formulario")
    }
  }

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará de forma permanente a ${user.full_name || "este usuario"}`,
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
        await deleteUser(user.id)
        Swal.fire({
          title: "Eliminado",
          text: "Usuario eliminado correctamente",
          icon: "success",
          background: colors.purple,
          color: "#fff",
          confirmButtonColor: colors.yellow
        })
        loadUsers()
      } catch (error) {
        handleCatchError(error, "Error al Eliminar")
      }
    }
  }

  const renderRoleBadge = (role) => {
    if (role === "admin") return <Badge bg="danger" className="text-uppercase px-2 py-1">Administrador</Badge>
    if (role === "coach") return <Badge bg="success" className="text-uppercase px-2 py-1">Coach</Badge>
    return <Badge bg="info" className="text-dark text-uppercase px-2 py-1">Socio</Badge>
  }

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-uppercase tracking-wide m-0" style={{ color: '#fff' }}>
            👥 Gestión de Usuarios
          </h2>
          <p className="text-white-50 small m-0 mt-1">Administra las cuentas, accesos y roles de la plataforma.</p>
        </div>
        <Button 
          onClick={openCreateModal}
          className="fw-bold text-uppercase d-flex align-items-center gap-2 border-0 shadow-sm"
          style={{ backgroundColor: colors.yellow, color: colors.purple, padding: '10px 20px', borderRadius: '8px' }}
        >
          <span>➕</span> Nuevo Usuario
        </Button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar por nombre, email o rol..." 
          />
        </Col>
      </Row>

      <Card className="border-0 shadow-lg text-white" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
        <Card.Body className="p-0">
          
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
              <Spinner animation="border" style={{ color: colors.yellow }} role="status" />
              <span className="text-white-50 small text-uppercase tracking-wider">Cargando usuarios...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <Table variant="dark" hover className="m-0 align-middle" style={{ backgroundColor: colors.purple }}>
                <thead style={{ borderBottom: `2px solid ${colors.inputBorder}` }}>
                  <tr className="text-white-50 text-uppercase small tracking-wider">
                    <th className="py-3 px-4" style={{ width: '80px' }}>ID</th>
                    <th className="py-3">Nombre</th>
                    <th className="py-3">Correo Electrónico</th>
                    <th className="py-3" style={{ width: '150px' }}>Rol</th>
                    <th className="py-3 text-end px-4" style={{ width: '200px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? ( // 👈 Mapeamos el arreglo filtrado
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-white-50">
                        {searchTerm ? "No se encontraron usuarios para esta búsqueda." : "No hay usuarios registrados en el sistema."}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => ( // 👈 Mapeamos el arreglo filtrado
                      <tr key={user.id} style={{ borderBottom: `1px solid ${colors.inputBorder}` }}>
                        <td className="py-3 px-4 fw-bold text-white-50">#{user.id}</td>
                        <td className="py-3 fw-semibold text-white">{user.full_name}</td>
                        <td className="py-3 text-white-50">{user.email}</td>
                        <td className="py-3">{renderRoleBadge(user.role)}</td>
                        <td className="py-3 text-end px-4">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button 
                              size="sm" 
                              variant="outline-light" 
                              className="fw-semibold text-uppercase px-3"
                              onClick={() => openEditModal(user)}
                              style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                            >
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-danger" 
                              className="fw-semibold text-uppercase px-3"
                              onClick={() => handleDelete(user)}
                              style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                            >
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

      <UserFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </div>
  )
}

export default UsersPage