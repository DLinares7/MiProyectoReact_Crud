import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientesPage } from './pages/ClientesPage';
import { ProductosPage } from './pages/ProductosPage';

// Componente para las vistas que sí llevan el menú lateral
const LayoutWithSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={styles.appContainer}>
      <Sidebar />
      <main style={styles.mainContent}>{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal (/) muestra la pantalla de Bienvenida/Login a pantalla completa */}
        <Route path="/" element={<WelcomePage />} />

        {/* Vistas internas con el menú lateral */}
        <Route
          path="/dashboard"
          element={
            <LayoutWithSidebar>
              <DashboardPage />
            </LayoutWithSidebar>
          }
        />
        <Route
          path="/clientes"
          element={
            <LayoutWithSidebar>
              <ClientesPage />
            </LayoutWithSidebar>
          }
        />
        <Route
          path="/productos"
          element={
            <LayoutWithSidebar>
              <ProductosPage />
            </LayoutWithSidebar>
          }
        />
      </Routes>
    </Router>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  mainContent: {
    marginLeft: '250px',
    padding: '40px',
    flex: 1,
  },
};

export default App;