import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://miproyectoreact-crud-2.onrender.com';

interface Tarea {
    id?: string;
    nombre: string;
    completada: boolean;
}

interface Producto {
    id?: string;
    nombre: string;
    precio: number;
    stock: number;
}

export const DashboardPage: React.FC = () => {
    const [nombreUsuario] = useState(() => {
        return localStorage.getItem('nombreUsuario') || 'Invitado';
    });

    const [totalClientes, setTotalClientes] = useState(0);
    const [clientesActivos, setClientesActivos] = useState(0);
    const [totalProductos, setTotalProductos] = useState(0);

    useEffect(() => {
        // Consultar clientes/tareas desde la base de datos
        fetch(`${API_URL}/tareas`)
            .then(res => res.json())
            .then((data: unknown) => {
                if (Array.isArray(data)) {
                    const tareasTyped = data as Tarea[];
                    setTotalClientes(tareasTyped.length);
                    // Contar únicamente los que están completados (activos)
                    const activos = tareasTyped.filter(t => t.completada).length;
                    setClientesActivos(activos);
                }
            })
            .catch(err => console.error("Error al cargar métricas de clientes:", err));

        // Consultar productos
        fetch(`${API_URL}/productos`)
            .then(res => res.json())
            .then((data: unknown) => {
                if (Array.isArray(data)) {
                    const productosTyped = data as Producto[];
                    setTotalProductos(productosTyped.length);
                }
            })
            .catch(err => console.error("Error al cargar métricas de productos:", err));
    }, []);

    return (
        <div>
            {/* Encabezado de bienvenida */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 5px 0' }}>
                    ¡Hola, {nombreUsuario}! 👋
                </h1>
                <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
                    Acá tenés un resumen general de la actividad de tu empresa hoy en la base de datos.
                </p>
            </div>

            {/* Tarjetas de Métricas (KPIs dinámicos) */}
            <div style={styles.gridContainer}>
                <div style={styles.card}>
                    <span style={styles.cardIcon}>👥</span>
                    <div>
                        <h3 style={styles.cardTitle}>Clientes Totales</h3>
                        <p style={styles.cardValue}>{totalClientes}</p>
                    </div>
                </div>

                <div style={styles.card}>
                    <span style={styles.cardIcon}>✅</span>
                    <div>
                        <h3 style={styles.cardTitle}>Clientes Activos</h3>
                        <p style={styles.cardValue}>{clientesActivos}</p>
                    </div>
                </div>

                <div style={styles.card}>
                    <span style={styles.cardIcon}>📦</span>
                    <div>
                        <h3 style={styles.cardTitle}>Productos Activos</h3>
                        <p style={styles.cardValue}>{totalProductos}</p>
                    </div>
                </div>
            </div>

            {/* Sección de Accesos Rápidos */}
            <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '15px' }}>
                    Accesos Rápidos
                </h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Link to="/clientes" style={styles.actionButton}>
                        👥 Gestionar Clientes
                    </Link>
                    <Link to="/productos" style={styles.actionButtonSecondary}>
                        📦 Ver Productos
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    cardIcon: {
        fontSize: '28px',
        padding: '12px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
    },
    cardTitle: {
        fontSize: '13px',
        color: '#64748b',
        margin: '0 0 5px 0',
        fontWeight: '500',
    },
    cardValue: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#0f172a',
        margin: 0,
    },
    actionButton: {
        padding: '12px 20px',
        backgroundColor: '#2563eb',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
    },
    actionButtonSecondary: {
        padding: '12px 20px',
        backgroundColor: '#ffffff',
        color: '#1e293b',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        border: '1px solid #cbd5e1',
    },
};