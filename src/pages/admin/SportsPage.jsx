// src/pages/admin/SportsPage.jsx
import { useEffect, useState } from "react"
import { Badge, Button, Card, Spinner, Table, Row, Col } from "react-bootstrap"
import Swal from "sweetalert2"
import SportFormModal from "../../components/sports/SportFormModal.jsx"
import SearchBar from "../../components/SearchBar" // 👈 Importamos el buscador
import { getSports, createSport, updateSport, deleteSport } from "../../services/sportService"

function SportsPage() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSport, setSelectedSport] = useState(null)
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
      errorMsg = `• <strong>Campos inválidos:</strong> Por favor, verifica que el deporte tenga un nombre único, duración coherente y un objetivo descriptivo.`;
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

  const loadSports = async () => {
    try {
      setLoading(true)
      const data = await getSports()
      setSports(data.data || [])
    } catch (error) {
      handleCatchError(error, "Error al Cargar Deportes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSports()
  }, [])

  // ⚡ FILTRADO REACTIVO DE LOS DEPORTES
  const filteredSports = sports.filter(sport => {
    const term = searchTerm.toLowerCase()
    return (
      sport.name?.toLowerCase().includes(term) ||
      sport.objective?.toLowerCase().includes(term)
    )
  })

  const openCreateModal = () => {
    setSelectedSport(null)
    setShowModal(true)
  }

  const openEditModal = (sport) => {
    setSelectedSport(sport)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSport(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedSport) {
        await updateSport(selectedSport.id, formData)
        Swal.fire({ title: "Actualizado", text: "Deporte actualizado correctamente", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      } else {
        await createSport(formData)
        Swal.fire({ title: "Creado", text: "Nueva disciplina deportiva guardada", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
      }
      closeModal()
      loadSports()
    } catch (error) {
      handleCatchError(error, "Error en Formulario de Deporte")
    }
  }

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: "¿Eliminar disciplina?",
      text: `¿Seguro que deseas eliminar ${sport.name}?`,
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
        await deleteSport(sport.id)
        Swal.fire({ title: "Eliminado", text: "Deporte eliminado correctamente", icon: "success", background: colors.purple, color: "#fff", confirmButtonColor: colors.yellow })
        loadSports()
      } catch (error) {
        handleCatchError(error, "Error al Eliminar Deporte")
      }
    }
  }

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-uppercase tracking-wide m-0" style={{ color: '#fff' }}>
            🏋️‍♂️ Gestión de Deportes
          </h2>
          <p className="text-white-50 small m-0 mt-1">Administra el catálogo de disciplinas y bloques de tiempo de las sesiones.</p>
        </div>
        <Button 
          onClick={openCreateModal}
          className="fw-bold text-uppercase d-flex align-items-center gap-2 border-0 shadow-sm"
          style={{ backgroundColor: colors.yellow, color: colors.purple, padding: '10px 20px', borderRadius: '8px' }}
        >
          <span>➕</span> Nuevo Deporte
        </Button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar disciplina u objetivo..." 
          />
        </Col>
      </Row>

      <Card className="border-0 shadow-lg text-white" style={{ backgroundColor: colors.purple, borderRadius: '12px' }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
              <Spinner animation="border" style={{ color: colors.yellow }} role="status" />
              <span className="text-white-50 small text-uppercase tracking-wider">Cargando disciplinas...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <Table variant="dark" hover className="m-0 align-middle" style={{ backgroundColor: colors.purple }}>
                <thead style={{ borderBottom: `2px solid ${colors.inputBorder}` }}>
                  <tr className="text-white-50 text-uppercase small tracking-wider">
                    <th className="py-3 px-4" style={{ width: '80px' }}>ID</th>
                    <th className="py-3">Deporte</th>
                    <th className="py-3">Objetivo Principal</th>
                    <th className="py-3" style={{ width: '130px' }}>Duración</th>
                    <th className="py-3" style={{ width: '120px' }}>Estado</th>
                    <th className="py-3 text-end px-4" style={{ width: '180px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSports.length === 0 ? ( // 👈 Mapeamos el arreglo filtrado
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">
                        {searchTerm ? "No se encontraron resultados." : "No hay disciplinas configuradas."}
                      </td>
                    </tr>
                  ) : (
                    filteredSports.map((sport) => ( // 👈 Mapeamos el arreglo filtrado
                      <tr key={sport.id} style={{ borderBottom: `1px solid ${colors.inputBorder}` }}>
                        <td className="py-3 px-4 fw-bold text-white-50">#{sport.id}</td>
                        <td className="py-3 fw-semibold text-white">{sport.name}</td>
                        <td className="py-3 text-white-50 small opacity-75">{sport.objective}</td>
                        <td className="py-3 fw-medium text-white">{sport.duration} min</td>
                        <td className="py-3">
                          <Badge bg={sport.status ? "success" : "secondary"} className="text-uppercase px-2 py-1">
                            {sport.status ? "Activo" : "Pausado"}
                          </Badge>
                        </td>
                        <td className="py-3 text-end px-4">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button size="sm" variant="outline-light" className="fw-semibold text-uppercase px-3" onClick={() => openEditModal(sport)} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
                              Editar
                            </Button>
                            <Button size="sm" variant="outline-danger" className="fw-semibold text-uppercase px-3" onClick={() => handleDelete(sport)} style={{ fontSize: '0.7rem', borderRadius: '4px' }}>
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

      <SportFormModal show={showModal} handleClose={closeModal} handleSave={handleSave} selectedSport={selectedSport} />
    </div>
  )
}

export default SportsPage