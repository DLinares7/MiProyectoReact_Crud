import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const WelcomePage: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const navigate = useNavigate();

    const handleSumbit = (e: React.FormEvent) => {
        e.preventDefault();
        // Podés guardar el nombre en localStorage si querés usarlo después
        if (nombre) localStorage.setItem('nombreUsuario', nombre);

        // Redirige al dashboard o clientes
        navigate('/dashboard');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>¡Bienvenido a Mi Empresa!</h1>
                <p style={styles.subtitle}>Ingresa tus datos o presiona Enter para continuar</p>

                <form onSubmit={handleSumbit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        style={styles.input}
                    />

                    <button type="submit" style={styles.button}>
                        Ingresar / Continuar
                    </button>
                </form>

                <p style={styles.footerText}>
                    Si no tienes cuenta, simplemente presiona <strong>Enter</strong>.
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
    },
    card: {
        backgroundColor: '#1e293b',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center' as const,
        color: '#fff',
    },
    title: {
        fontSize: '24px',
        marginBottom: '10px',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: '14px',
        color: '#94a3b8',
        marginBottom: '25px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '15px',
    },
    input: {
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #334155',
        backgroundColor: '#0f172a',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
    },
    button: {
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#2563eb',
        color: '#fff',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px',
    },
    footerText: {
        marginTop: '20px',
        fontSize: '13px',
        color: '#64748b',
    },
};