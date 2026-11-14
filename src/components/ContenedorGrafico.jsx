/**
 * @param {Object} props
 * @param {Array} props.registros
 */
export default function ContenedorGrafico({ registros = [] }) {
  if (!registros || registros.length === 0) {
    return (
      <div className="grafico-card-contenedor">
        <div className="grafico-encabezado">
          <h3 className="grafico-titulo">Distribución y Comparativa de Sensores</h3>
          <span className="grafico-subtitulo">No hay registros para graficar con los filtros actuales</span>
        </div>
        <div className="grafico-vacio">
          <p>Ajusta o limpia los filtros para visualizar la gráfica comparativa.</p>
        </div>
      </div>
    );
  }

  const maxPM25 = Math.max(...registros.map(r => Number(r.pm25) || 1), 70);

  return (
    <div className="grafico-card-contenedor">
      <div className="grafico-encabezado">
        <div>
          <span className="seccion-tag">Visualización Central &bull; Gráfica Dinámica</span>
          <h3 className="grafico-titulo">
            Concentración de Micropartículas PM2.5 por Estación ($\mu g/m^3$)
          </h3>
          <p className="grafico-subtitulo">
            Comparativa visual sincronizada en tiempo real según los filtros activos.
          </p>
        </div>
        <div className="grafico-badge-puntos">
          <span className="punto-leyenda punto-verde"></span> Buena (&lt;25)
          <span className="punto-leyenda punto-amarillo"></span> Aceptable (25-50)
          <span className="punto-leyenda punto-rojo"></span> Crítica (&gt;50)
        </div>
      </div>

      <div className="grafico-barras-lista">
        {registros.map((item) => {
          const porcentaje = Math.min(Math.round((item.pm25 / maxPM25) * 100), 100);
          let colorBarra = '#10b981'; // verde
          if (item.pm25 > 50) colorBarra = '#f43f5e'; // rojo
          else if (item.pm25 > 25) colorBarra = '#f59e0b'; // amarillo

          return (
            <div key={item.id} className="grafico-fila-barra">
              <div className="grafico-etiqueta-estacion" title={item.estacion}>
                <span className="nombre-estacion-truncado">{item.estacion}</span>
                <span className="badge-zona-grafico">{item.zona}</span>
              </div>

              <div className="grafico-riel-barra">
                <div
                  className="grafico-progreso-barra"
                  style={{
                    width: `${porcentaje}%`,
                    backgroundColor: colorBarra,
                    boxShadow: `0 0 10px ${colorBarra}40`
                  }}
                >
                  <span className="grafico-valor-interno">
                    {item.pm25} µg/m³
                  </span>
                </div>
              </div>

              <div className="grafico-valor-temp" title={`Temperatura: ${item.temperatura}°C | Viento: ${item.viento || 0} km/h`}>
                <span>🌡️ {item.temperatura}°C</span>
                <span className="grafico-viento-txt">💨 {item.viento || 0} km/h</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
