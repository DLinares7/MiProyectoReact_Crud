import { useEffect, useState } from 'react'

interface Tarea {
  id?: string;
  nombre: string;
  completada: boolean;
}

// URL de tu backend desplegado en Render
const API_URL = 'https://miproyectoreact-crud-2.onrender.com';

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [nombreTarea, setNombreTarea] = useState('')

  // [READ] Leer tareas
  const cargarTareas = () => {
    fetch(`${API_URL}/tareas`)
      .then(res => res.json())
      .then(data => setTareas(data))
      .catch(error => console.error("Error cargando tareas:", error))
  }

  useEffect(() => {
    cargarTareas()
  }, [])

  // [CREATE] Crear tarea
  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombreTarea.trim()) return

    fetch(`${API_URL}/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreTarea, completada: false })
    })
      .then(() => {
        setNombreTarea('')
        cargarTareas()
      })
      .catch(error => console.error("Error guardando:", error))
  }

  // [UPDATE] Cambiar estado de completada
  const toggleCompletada = (tarea: Tarea) => {
    const tareaActualizada = { ...tarea, completada: !tarea.completada }

    fetch(`${API_URL}/tareas/${tarea.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tareaActualizada)
    })
      .then(() => cargarTareas())
      .catch(error => console.error("Error actualizando:", error))
  }

  // [DELETE] Borrar tarea
  const eliminarTarea = (id: string) => {
    fetch(`${API_URL}/tareas/${id}`, {
      method: 'DELETE'
    })
      .then(() => cargarTareas())
      .catch(error => console.error("Error borrando:", error))
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: '#e0e0e0',
      padding: '40px 20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>

        {/* Encabezado Profesional */}
        <header style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>
            Gestor de Tareas
          </h1>
          <p style={{ fontSize: '14px', color: '#888888', margin: 0 }}>
            Aplicación Full-Stack en la nube
          </p>
        </header>

        {/* Formulario de Creación */}
        <form onSubmit={agregarTarea} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input
            type="text"
            value={nombreTarea}
            onChange={(e) => setNombreTarea(e.target.value)}
            placeholder="¿Qué tarea deseas agregar?"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '15px',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#1e1e1e',
              color: '#ffffff',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 22px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
          >
            Agregar
          </button>
        </form>

        {/* Listado de Tareas */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tareas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#666', fontSize: '15px' }}>
              No hay tareas pendientes por ahora. ¡Agrega una!
            </div>
          ) : (
            tareas.map((tarea) => (
              <li key={tarea.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                marginBottom: '12px',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                border: '1px solid #2a2a2a',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                <div
                  onClick={() => toggleCompletada(tarea)}
                  style={{
                    cursor: 'pointer',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '15px',
                    textDecoration: tarea.completada ? 'line-through' : 'none',
                    color: tarea.completada ? '#6b7280' : '#f3f4f6',
                    userSelect: 'none'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{tarea.completada ? '✅' : '⏳'}</span>
                  <span>{tarea.nombre}</span>
                </div>

                <button
                  onClick={() => eliminarTarea(tarea.id!)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #7f1d1d',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  Borrar
                </button>
              </li>
            ))
          )}
        </ul>

      </div>
    </div>
  )
}

export default App