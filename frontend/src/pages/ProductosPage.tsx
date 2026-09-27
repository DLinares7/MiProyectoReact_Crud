import React, { useEffect, useState } from 'react';

interface Producto {
    id?: string;
    nombre: string;
    precio: number;
    stock: number;
}

const API_URL = 'https://miproyectoreact-crud-2.onrender.com';

export const ProductosPage: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');

    const cargarProductos = () => {
        fetch(`${API_URL}/productos`)
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(error => console.error("Error cargando productos:", error));
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const agregarProducto = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !precio || !stock) return;

        const nuevoProd = {
            nombre,
            precio: parseFloat(precio),
            stock: parseInt(stock, 10),
        };

        fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProd)
        })
            .then(() => {
                setNombre('');
                setPrecio('');
                setStock('');
                cargarProductos();
            })
            .catch(error => console.error("Error guardando producto:", error));
    };

    const eliminarProducto = (id: string) => {
        fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE'
        })
            .then(() => cargarProductos())
            .catch(error => console.error("Error borrando producto:", error));
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '25px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 5px 0' }}>
                    📦 Catálogo de Productos
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    Administra el inventario conectado a tu base de datos en la nube.
                </p>
            </header>

            {/* Formulario */}
            <form onSubmit={agregarProducto} style={styles.form}>
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Precio ($)"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    style={styles.inputSmall}
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    style={styles.inputSmall}
                />
                <button type="submit" style={styles.button}>
                    Agregar
                </button>
            </form>

            {/* Tabla de Productos */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeaderRow}>
                            <th style={styles.th}>Producto</th>
                            <th style={styles.th}>Precio</th>
                            <th style={styles.th}>Stock</th>
                            <th style={styles.th}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={styles.emptyCell}>
                                    No hay productos registrados en la base de datos.
                                </td>
                            </tr>
                        ) : (
                            productos.map((prod) => (
                                <tr key={prod.id} style={styles.tableRow}>
                                    <td style={styles.td}>{prod.nombre}</td>
                                    <td style={styles.td}>${Number(prod.precio).toFixed(2)}</td>
                                    <td style={styles.td}>
                                        <span style={prod.stock < 12 ? styles.badgeLow : styles.badgeOk}>
                                            {prod.stock} unidades
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => eliminarProducto(prod.id!)}
                                            style={styles.deleteButton}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    form: {
        display: 'flex',
        gap: '10px',
        marginBottom: '25px',
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        flexWrap: 'wrap' as const,
    },
    input: {
        flex: 2,
        minWidth: '200px',
        padding: '10px 14px',
        fontSize: '14px',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        outline: 'none',
    },
    inputSmall: {
        flex: 1,
        minWidth: '100px',
        padding: '10px 14px',
        fontSize: '14px',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        outline: 'none',
    },
    button: {
        padding: '10px 18px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
    },
    tableContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        textAlign: 'left' as const,
    },
    tableHeaderRow: {
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
    },
    th: {
        padding: '12px 16px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
    },
    tableRow: {
        borderBottom: '1px solid #f1f5f9',
    },
    td: {
        padding: '14px 16px',
        fontSize: '14px',
        color: '#334155',
    },
    emptyCell: {
        textAlign: 'center' as const,
        padding: '30px',
        color: '#94a3b8',
        fontSize: '14px',
    },
    badgeOk: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
    },
    badgeLow: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        color: '#ef4444',
        border: '1px solid #fecaca',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500',
    },
};