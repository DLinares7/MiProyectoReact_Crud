import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar: React.FC = () => {
    return (
        <aside style={styles.sidebar}>
            <h2 style={styles.logo}>Mi Empresa</h2>
            <ul style={styles.menu}>
                <li>
                    <Link to="/" style={styles.link}>👋 Bienvenida / Login</Link>
                </li>
                <li>
                    <Link to="/dashboard" style={styles.link}>📊 Dashboard</Link>
                </li>
                <li>
                    <Link to="/clientes" style={styles.link}>👥 Clientes</Link>
                </li>
                <li>
                    <Link to="/productos" style={styles.link}>📦 Productos</Link>
                </li>
                <li style={{ marginTop: '30px' }}>
                    <Link to="/" style={styles.logoutLink}>🚪 Logout</Link>
                </li>
            </ul>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: '250px',
        height: '100vh',
        backgroundColor: '#1e293b',
        color: '#fff',
        padding: '20px',
        position: 'fixed' as const,
        left: 0,
        top: 0,
    },
    logo: {
        fontSize: '20px',
        marginBottom: '30px',
        textAlign: 'center' as const,
    },
    menu: {
        listStyle: 'none',
        padding: 0,
    },
    link: {
        display: 'block',
        padding: '12px 15px',
        color: '#fff',
        textDecoration: 'none',
        cursor: 'pointer',
        borderRadius: '6px',
        marginBottom: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    logoutLink: {
        display: 'block',
        padding: '12px 15px',
        color: '#f87171',
        textDecoration: 'none',
        cursor: 'pointer',
        borderRadius: '6px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
};