import React, { useEffect, useState } from 'react';

interface Cliente {
    id?: string;
    nombre: string;
    estado: 'Activo' | 'Inactivo' | 'Pendiente';
    completada: boolean;
}

const API_URL = 'https://miproyectoreact-crud-2.onrender.com';

export const ClientesPage: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [nombreCliente, setNombreCliente] = useState('');

    // Estados para la paginación (máximo 7 registros por página)
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 7;

    const cargarClientes = () => {
        fetch(`${API_URL}/clientes`)
            .then(res => res.json())
            .then((data: unknown) => {
                if (Array.isArray(data)) {
                    const adaptados = data.map((item) => {
                        const rawItem = item as Record<string, unknown>;

                        const idStr = rawItem.id as string;
                        const estadoGuardadoLocal = idStr ? localStorage.getItem(`estado_cliente_${idStr}`) : null;

                        const estadoActual: 'Activo' | 'Inactivo' | 'Pendiente' =
                            (estadoGuardadoLocal === 'Activo' || estadoGuardadoLocal === 'Inactivo' || estadoGuardadoLocal === 'Pendiente')
                                ? (estadoGuardadoLocal as 'Activo' | 'Inactivo' | 'Pendiente')
                                : (rawItem.completada ? 'Activo' : 'Pendiente');

                        return {
                            id: idStr,
                            nombre: (rawItem.nombre as string) || '',
                            estado: estadoActual,
                            completada: Boolean(rawItem.completada)
                        };
                    });
                    setClientes(adaptados);
                }
            })
            .catch(error => console.error("Error cargando clientes:", error));
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const agregarCliente = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombreCliente.trim()) return;

        const nuevoCliente = {
            nombre: nombreCliente,
            completada: false
        };

        fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCliente)
        })
            .then(res => res.json())
            .then((createdItem: unknown) => {
                const item = createdItem as Record<string, unknown>;
                if (item && item.id) {
                    localStorage.setItem(`estado_cliente_${item.id}`, 'Pendiente');
                }
                setNombreCliente('');
                setPaginaActual(1); // Opcional: vuelve a la primera página al agregar uno nuevo
                cargarClientes();
            })
            .catch(error => console.error("Error guardando cliente:", error));
    };

    const cambiarEstado = (cliente: Cliente) => {
        let siguienteEstado: 'Activo' | 'Inactivo' | 'Pendiente' = 'Pendiente';

        if (cliente.estado === 'Pendiente') {
            siguienteEstado = 'Activo';
        } else if (cliente.estado === 'Activo') {
            siguienteEstado = 'Inactivo';
        } else if (cliente.estado === 'Inactivo') {
            siguienteEstado = 'Pendiente';
        }

        if (cliente.id) {
            localStorage.setItem(`estado_cliente_${cliente.id}`, siguienteEstado);
        }

        const clienteActualizado = {
            ...cliente,
            completada: siguienteEstado === 'Activo'
        };

        fetch(`${API_URL}/clientes/${cliente.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteActualizado)
        })
            .then(() => cargarClientes())
            .catch(error => console.error("Error actualizando estado:", error));
    };

    const eliminarCliente = (id: string) => {
        fetch(`${API_URL}/clientes/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                localStorage.removeItem(`estado_cliente_${id}`);
                cargarClientes();
            })
            .catch(error => console.error("Error borrando cliente:", error));
    };

    const getBadgeStyle = (estado: string) => {
        switch (estado) {
            case 'Activo':
                return { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
            case 'Inactivo':
                return { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
            default: // Pendiente
                return { backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fef08a' };
        }
    };

    // --- LÓGICA DE PAGINACIÓN ---
    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const clientesVisibles = clientes.slice(indicePrimerRegistro, indiceUltimoRegistro);
    const totalPaginas = Math.ceil(clientes.length / registrosPorPagina);

    const siguientePagina = () => {
        if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
    };

    const paginaAnterior = () => {
        if (paginaActual > 1) setPaginaActual(paginaActual - 1);
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <header style={{ marginBottom: '25px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 5px 0' }}>
                    👥 Gestión de Clientes
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    Administra la cartera de clientes y su estado actual en la base de datos.
                </p>
            </header>

            {/* Formulario */}
            <form onSubmit={agregarCliente} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                <input
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    placeholder="Nombre del cliente..."
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        fontSize: '14px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px 18px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: '1px solid #2563eb',
                        borderRadius: '6px'
                    }}
                >
                    Agregar Cliente
                </button>
            </form>

            {/* Listado con Paginación */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {clientes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '14px' }}>
                        No hay clientes registrados por ahora.
                    </div>
                ) : (
                    clientesVisibles.map((cliente) => (
                        <li key={cliente.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            marginBottom: '10px',
                            backgroundColor: '#ffffff',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                                <span style={{
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    color: cliente.estado === 'Inactivo' ? '#94a3b8' : '#334155',
                                    textDecoration: cliente.estado === 'Inactivo' ? 'line-through' : 'none'
                                }}>
                                    {cliente.nombre}
                                </span>

                                <button
                                    onClick={() => cambiarEstado(cliente)}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        ...getBadgeStyle(cliente.estado)
                                    }}
                                    title="Haz clic para cambiar el estado"
                                >
                                    {cliente.estado}
                                </button>
                            </div>

                            <button
                                onClick={() => eliminarCliente(cliente.id!)}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#ef4444',
                                    border: '1px solid #fecaca',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}
                            >
                                Borrar
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* Controles de Desplazamiento (Paginación) */}
            {clientes.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '10px 0' }}>
                    <button
                        onClick={paginaAnterior}
                        disabled={paginaActual === 1}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: paginaActual === 1 ? '#e2e8f0' : '#2563eb',
                            color: paginaActual === 1 ? '#94a3b8' : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Anterior
                    </button>

                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>
                        Página {paginaActual} de {totalPaginas || 1}
                    </span>

                    <button
                        onClick={siguientePagina}
                        disabled={paginaActual === totalPaginas || totalPaginas === 0}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: (paginaActual === totalPaginas || totalPaginas === 0) ? '#e2e8f0' : '#2563eb',
                            color: (paginaActual === totalPaginas || totalPaginas === 0) ? '#94a3b8' : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: (paginaActual === totalPaginas || totalPaginas === 0) ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};