/**
 * @param {Object} props
 * @param {Object} props.filtros
 * @param {Function} props.setFiltros
 * @param {number} [props.totalResultados]
 */
export default function PanelFiltros({ filtros, setFiltros, totalResultados }) {
  const handleCategoriaChange = (e) => {
    setFiltros({
      ...filtros,
      categoria: e.target.value
    });
  };

  const handleFechaChange = (e) => {
    setFiltros({
      ...filtros,
      fecha: e.target.value
    });
  };

  const handleResetFiltros = () => {
    setFiltros({
      categoria: 'todas',
      fecha: ''
    });
  };

  const hayFiltrosActivos = filtros.categoria !== 'todas' || Boolean(filtros.fecha);

  return (
    <aside className="panel-filtros-card">
      <div className="panel-filtros-encabezado">
        <div className="filtros-icono-titulo">
          <span className="icono-filtro">⚙️</span>
          <div>
            <h4 className="filtros-titulo">Filtros Globales</h4>
            <span className="filtros-subtitulo">Sincronización en tiempo real</span>
          </div>
        </div>

        {hayFiltrosActivos && (
          <button
            type="button"
            className="btn-limpiar-filtros"
            onClick={handleResetFiltros}
            title="Restablecer todos los filtros"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="panel-filtros-controles">
        {}
        <div className="filtro-grupo">
          <label htmlFor="filtro-categoria" className="filtro-label">
            Categoría de Datos:
          </label>
          <div className="select-wrapper">
            <select
              id="filtro-categoria"
              value={filtros.categoria}
              onChange={handleCategoriaChange}
              className="filtro-select"
            >
              <option value="todas">Todas las categorías</option>
              <option value="temperatura">Temperatura Alta (≥ 23°C)</option>
              <option value="viento">Viento Fuerte (≥ 20 km/h)</option>
              <option value="calidadAire">Alerta Calidad de Aire (PM2.5)</option>
              <option value="operativas">Sensores Activos</option>
            </select>
          </div>
        </div>

        {}
        <div className="filtro-grupo">
          <label htmlFor="filtro-fecha" className="filtro-label">
            Fecha de Registro:
          </label>
          <input
            type="date"
            id="filtro-fecha"
            value={filtros.fecha}
            onChange={handleFechaChange}
            className="filtro-input-date"
            title="Selecciona una fecha de medición (ej. 2026-11-05, 2026-11-06, 2026-11-10, 2026-11-13)"
          />
        </div>

        {}
        <div className="filtro-resumen-badge">
          <span className="punto-filtro-activo"></span>
          <span>
            {totalResultados !== undefined
              ? `${totalResultados} registros filtrados`
              : 'Filtros aplicados'}
          </span>
        </div>
      </div>
    </aside>
  );
}
