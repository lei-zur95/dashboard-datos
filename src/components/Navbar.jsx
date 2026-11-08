export default function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="navbar-logo-icon">📊</div>
          <div>
            <h1 className="navbar-title">Dashboard de Ciencia de Datos</h1>
            <p className="navbar-subtitle">Unidad 3: Frontend Aplicado a la Ciencia de Datos</p>
          </div>
        </div>
        <div className="navbar-user-badge">
          <span className="navbar-user-label">Desarrollador:</span>
          <span className="navbar-user-name">Vázquez Martín Eliezer Zuriel</span>
        </div>
      </div>
    </nav>
  );
}
