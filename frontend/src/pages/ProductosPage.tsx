import React, { useEffect, useState } from 'react';

interface Producto {
    id?: string;
    nombre: string;
    precio: number;
    estado: 'Activo' | 'Inactivo' | 'Pendiente';
    completada: boolean;
}

const API_URL = 'https://miproyectoreact-crud-2.onrender.com';

export const ProductosPage: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoPrecio, setNuevoPrecio] = useState('');

    // Estados para la paginación (7 registros por página)
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 7;

    const cargarProductos = () => {
        fetch(`${API_URL}/productos`)
            .then(res => res.json())
            .then((data: unknown) => {
                if (Array.isArray(data)) {
                    const adaptados = data.map((item) => {
                        const rawItem = item as Record<string, unknown>;
                        const idStr = (rawItem.id || rawItem._id) as string;
                        const estadoGuardadoLocal = idStr ? localStorage.getItem(`estado_producto_${idStr}`) : null;

                        const estadoActual: 'Activo' | 'Inactivo' | 'Pendiente' =
                            (estadoGuardadoLocal === 'Activo' || estadoGuardadoLocal === 'Inactivo' || estadoGuardadoLocal === 'Pendiente')
                                ? (estadoGuardadoLocal as 'Activo' | 'Inactivo' | 'Pendiente')
                                : (rawItem.completada ? 'Activo' : 'Pendiente');

                        return {
                            id: idStr,
                            nombre: (rawItem.nombre as string) || '',
                            precio: Number(rawItem.precio) || 0,
                            estado: estadoActual,
                            completada: Boolean(rawItem.completada)
                        };
                    });
                    setProductos(adaptados);
                }
            })
            .catch(error => console.error("Error cargando productos:", error));
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    // --- AGREGAR PRODUCTO ---
    const agregarProducto = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoNombre.trim() || !nuevoPrecio) return;

        const nuevoProd = {
            nombre: nuevoNombre.trim(),
            precio: parseFloat(nuevoPrecio),
            completada: false
        };

        fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProd)
        })
            .then(() => {
                setNuevoNombre('');
                setNuevoPrecio('');
                cargarProductos();
            })
            .catch(error => console.error("Error al crear producto:", error));
    };

    // --- ELIMINAR PRODUCTO ---
    const eliminarProducto = (id?: string) => {
        if (!id) return;

        fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                localStorage.removeItem(`estado_producto_${id}`);
                cargarProductos();
            })
            .catch(error => console.error("Error al eliminar producto:", error));
    };

    // --- CAMBIAR ESTADO ---
    const cambiarEstado = (producto: Producto) => {
        let siguienteEstado: 'Activo' | 'Inactivo' | 'Pendiente' = 'Pendiente';

        if (producto.estado === 'Pendiente') {
            siguienteEstado = 'Activo';
        } else if (producto.estado === 'Activo') {
            siguienteEstado = 'Inactivo';
        } else if (producto.estado === 'Inactivo') {
            siguienteEstado = 'Pendiente';
        }

        if (producto.id) {
            localStorage.setItem(`estado_producto_${producto.id}`, siguienteEstado);
        }

        const productoActualizado = {
            ...producto,
            completada: siguienteEstado === 'Activo'
        };

        fetch(`${API_URL}/productos/${producto.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoActualizado)
        })
            .then(() => cargarProductos())
            .catch(error => console.error("Error actualizando estado del producto:", error));
    };

    const getBadgeStyle = (estado: string) => {
        switch (estado) {
            case 'Activo':
                return { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
            case 'Inactivo':
                return { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
            default:
                return { backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fef08a' };
        }
    };

    // --- LÓGICA DE PAGINACIÓN ---
    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const productosVisibles = productos.slice(indicePrimerRegistro, indiceUltimoRegistro);
    const totalPaginas = Math.ceil(productos.length / registrosPorPagina);

    const siguientePagina = () => {
        if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
    };

    const paginaAnterior = () => {
        if (paginaActual > 1) setPaginaActual(paginaActual - 1);
    };

    return (
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <header style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 5px 0' }}>
                    📦 Gestión de Productos
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    Catálogo de productos, control de estados y administración general.
                </p>
            </header>

            {/* Formulario para Agregar Producto */}
            <form onSubmit={agregarProducto} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                <input
                    type="text"
                    placeholder="Nombre del nuevo producto..."
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    style={{
                        flex: 2,
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Precio ($)"
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    Agregar
                </button>
            </form>

            {/* Listado con Paginación */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {productos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '14px' }}>
                        No hay productos registrados por ahora.
                    </div>
                ) : (
                    productosVisibles.map((producto) => (
                        <li key={producto.id} style={{
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
                                    color: producto.estado === 'Inactivo' ? '#94a3b8' : '#334155',
                                    textDecoration: producto.estado === 'Inactivo' ? 'line-through' : 'none'
                                }}>
                                    {producto.nombre}
                                </span>

                                <button
                                    onClick={() => cambiarEstado(producto)}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        ...getBadgeStyle(producto.estado)
                                    }}
                                    title="Haz clic para cambiar el estado"
                                >
                                    {producto.estado}
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span style={{ fontSize: '15px', fontWeight: '600', color: '#16a34a' }}>
                                    ${producto.precio.toFixed(2)}
                                </span>

                                <button
                                    onClick={() => eliminarProducto(producto.id)}
                                    style={{
                                        padding: '6px 14px',
                                        backgroundColor: 'transparent',
                                        color: '#ef4444',
                                        border: '1px solid #fecaca',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '500'
                                    }}
                                    title="Borrar producto "
                                >
                                    Borrar
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {/* Controles de Desplazamiento (Paginación) */}
            {productos.length > 0 && (
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