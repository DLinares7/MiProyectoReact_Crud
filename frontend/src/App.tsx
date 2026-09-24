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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '30px', fontFamily: 'system-ui' }}>
      <h1 style={{ textAlign: 'center' }}>Gestor de Tareas Full-Stack</h1>

      <form onSubmit={agregarTarea} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          value={nombreTarea}
          onChange={(e) => setNombreTarea(e.target.value)}
          placeholder="¿Qué necesitas hacer?"
          style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Agregar
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareas.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No hay tareas pendientes.</p>
        ) : (
          tareas.map((tarea) => (
            <li key={tarea.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#242424',
              borderRadius: '6px',
              border: '1px solid #444'
            }}>
              <div
                onClick={() => toggleCompletada(tarea)}
                style={{
                  cursor: 'pointer',
                  flex: 1,
                  textDecoration: tarea.completada ? 'line-through' : 'none',
                  color: tarea.completada ? '#888' : '#fff'
                }}
              >
                {tarea.completada ? '✅' : '⏳'} {tarea.nombre}
              </div>

              <button
                onClick={() => eliminarTarea(tarea.id!)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Borrar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default App