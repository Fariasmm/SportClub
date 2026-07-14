// src/components/SearchBar.jsx
import React from "react"
import { Form, InputGroup } from "react-bootstrap"

function SearchBar({ value, onChange, placeholder = "Buscar..." }) {
  const colors = {
    purple: '#2b124c',
    yellow: '#f3b600',
    darkBg: '#1c0b33',
    inputBorder: '#442373'
  }

  return (
    <Form.Group className="mb-3">
      <InputGroup className="shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <InputGroup.Text 
          style={{ 
            backgroundColor: colors.darkBg, 
            border: `1px solid ${colors.inputBorder}`, 
            borderRight: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1rem'
          }}
        >
          🔍
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-white py-2"
          style={{ 
            backgroundColor: colors.darkBg, 
            border: `1px solid ${colors.inputBorder}`, 
            borderLeft: 'none',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        {value && (
          <Button 
            variant="dark"
            onClick={() => onChange("")}
            style={{ 
              backgroundColor: colors.darkBg, 
              border: `1px solid ${colors.inputBorder}`, 
              borderLeft: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.8rem'
            }}
          >
            ❌
          </Button>
        )}
      </InputGroup>
    </Form.Group>
  )
}

// Botón auxiliar interno para limpiar rápidamente la barra de búsqueda
import { Button } from "react-bootstrap"

export default SearchBar