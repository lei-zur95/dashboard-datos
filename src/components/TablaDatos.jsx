/**
 * @param {Object} props
 * @param {Array|Object} props.datos 
 */
export default function TablaDatos({ datos = [] }) {
  const listaRegistros = Array.isArray(datos) ? datos : (datos?.registros || []);

  const getBadgeCalidadClass = (calidad) => {
    switch (calidad) {
      case 'Buena':
        return 'badge badge-buena';
      case 'Aceptable':
        return 'badge badge-aceptable';
      case 'Mala':
        return 'badge badge-mala';
      case 'Muy Mala':
        return 'badge badge-critica';
      default:
        return 'badge badge-default';
    }
  };

  const getBadgeEstadoClass = (estado) => {
    switch (estado) {
      case 'Activo':
        return 'estado-indicador estado-activo';
      case 'Mantenimiento':
        return 'estado-indicador estado-mantenimiento';
      case 'Calibrando':
        return 'estado-indicador estado-calibrando';
      default:
        return 'estado-indicador';
    }
  };

  return (
    <div className="tabla-card-contenedor">
      <div className="tabla-encabezado-seccion">
        <div>
          <h3 className="tabla-titulo">Registros del Dataset de Sensores Ambientales</h3>
          <p className="tabla-descripcion">
            Visualización tabular generada dinámicamente mediante el procesamiento del servicio <code className="codigo-inline">dataService.js</code>.
          </p>
        </div>
        <div className="tabla-conteo-badge">
          {listaRegistros.length} registros cargados
        </div>
      </div>

      <div className="tabla-scroll-wrapper">
        <table className="tabla-datos">
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>ID</th>
              <th>Estación de Monitoreo</th>
              <th>Zona</th>
              <th style={{ textAlign: 'right' }}>Temperatura</th>
              <th style={{ textAlign: 'right' }}>Humedad</th>
              <th style={{ textAlign: 'right' }}>PM2.5</th>
              <th style={{ textAlign: 'right' }}>CO₂</th>
              <th style={{ textAlign: 'center' }}>Calidad del Aire</th>
              <th style={{ textAlign: 'center' }}>Estado Operativo</th>
              <th style={{ textAlign: 'center' }}>Último Registro</th>
            </tr>
          </thead>
          <tbody>
            {listaRegistros.length === 0 ? (
              <tr>
                <td colSpan="10" className="tabla-vacia">
                  No hay datos disponibles para mostrar.
                </td>
              </tr>
            ) : (
              listaRegistros.map((item) => (
                <tr key={item.id} className="tabla-fila">
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#94a3b8' }}>
                    #{item.id}
                  </td>
                  <td className="celda-destacada">
                    {item.estacion}
                  </td>
                  <td>
                    <span className="zona-pill">{item.zona}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                    {item.temperaturaFormatted || `${item.temperatura} °C`}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                    {item.humedadFormatted || `${item.humedad} %`}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: '600' }}>
                    {item.pm25Formatted || `${item.pm25} µg/m³`}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                    {item.co2Formatted || `${item.co2} ppm`}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={getBadgeCalidadClass(item.calidadAire)}>
                      {item.calidadAire}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={getBadgeEstadoClass(item.estadoOperativo)}>
                      <span className="punto-estado"></span>
                      {item.estadoOperativo}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                    {item.fechaRegistro}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
