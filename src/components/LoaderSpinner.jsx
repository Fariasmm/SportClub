// src/components/LoaderSpinner.jsx
import React from 'react'
import { Spinner } from 'react-bootstrap'

function LoaderSpinner({ message = "Cargando información..." }) {
  const colors = {
    yellow: '#f3b600',
    darkBg: '#12071f'
  }

  return (
    <div 
      className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 w-100" 
      style={{ minHeight: '40vh' }}
    >
      <Spinner animation="border" style={{ color: colors.yellow }} />
      <span className="text-white-50 text-uppercase tracking-wider small">
        {message}
      </span>
    </div>
  )
}

export default LoaderSpinner