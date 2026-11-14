import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import './App.css';

export default function App() {
  return (
    <div className="app-wrapper">
      {}
      <Navbar />

      {}
      <main className="dashboard-container">
        <DashboardLayout />
      </main>

      {}
      <footer className="footer-dashboard">
        <div className="footer-content">
          <span>Desarrollo de Aplicaciones para Ciencia de Datos &bull; Unidad 3</span>
          <span><strong>Vázquez Martín Eliezer Zuriel</strong></span>
        </div>
      </footer>
    </div>
  );
}