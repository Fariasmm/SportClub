// src/components/PageHeader.jsx
import React from 'react'

function PageHeader({ title, description }) {
  return (
    <div className="mb-4 animate__animated animate__fadeIn">
      <h3 className="fw-bold text-uppercase tracking-wide m-0" style={{ color: '#fff' }}>
        {title}
      </h3>
      {description && (
        <p className="text-white-50 small m-0 mt-1">
          {description}
        </p>
      )}
    </div>
  )
}

export default PageHeader