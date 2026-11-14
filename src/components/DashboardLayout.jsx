import { useState, useEffect } from 'react';
import PanelFiltros from './PanelFiltros';
import TarjetaMetrica from './TarjetaMetrica';
import ContenedorGrafico from './ContenedorGrafico';
import TablaDatos from './TablaDatos';
import PanelAnalitico from './PanelAnalitico';
import { obtenerDatosVisualizacion } from '../services/dataService';

export default function DashboardLayout() {
  // 1. Estado global compartido para los controles de filtrado
  const [filtros, setFiltros] = useState({
    categoria: 'todas',
    fecha: ''
  });

  const [datosVisualizacion, setDatosVisualizacion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    const actualizarDatosDashboard = async () => {
      try {
        setCargando(true);
        const resultado = await obtenerDatosVisualizacion(filtros);
        if (activo) {
          setDatosVisualizacion(resultado);
        }
      } catch (error) {
        console.error("Error al sincronizar el dashboard con los filtros:", error);
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    actualizarDatosDashboard();

    return () => {
      activo = false;
    };
  }, [filtros]);

  const metricas = datosVisualizacion?.metricas;
  const registros = datosVisualizacion?.registros || [];

  return (
    <div className="dashboard-grid-layout">
      {/* =========================================================================
          COLUMNA / BARRA LATERAL: Controles y Filtros Compartidos
          ========================================================================= */}
      <aside className="dashboard-sidebar-area">
        <PanelFiltros
          filtros={filtros}
          setFiltros={setFiltros}
          totalResultados={registros.length}
        />

        {}
        <div className="sidebar-info-card">
          <h5 className="sidebar-info-titulo">Arquitectura React</h5>
          <p className="sidebar-info-desc">
            Los filtros modifican el estado compartido en <code className="codigo-inline">DashboardLayout</code>,
            propagando los datos reactivamente a tarjetas, gráficas y tablas mediante <strong>Lifting State Up</strong>.
          </p>
        </div>
      </aside>

      {/* =========================================================================
          ÁREA PRINCIPAL (GRID FLUIDO Y RESPONSIVO)
          ========================================================================= */}
      <section className="dashboard-main-area">
        {}
        <PanelAnalitico />

        {}
        <header className="seccion-header">
          <div>
            <span className="seccion-tag">Práctica 4 &bull; Dashboard Interactivo</span>
            <h2 className="seccion-titulo">Visualización y Telemetría Multidimensional</h2>
            <p className="seccion-subtitulo">
              Métricas sincronizadas automáticamente con los filtros globales: 
              categoría <strong>&ldquo;{filtros.categoria}&rdquo;</strong>
              {filtros.fecha ? ` y fecha "${filtros.fecha}"` : ' (todas las fechas)'}.
            </p>
          </div>

          <div className="badge-estado-conexion">
            <span className="punto-latencia"></span>
            <span>{registros.length} Estaciones en Vista</span>
          </div>
        </header>

        {cargando ? (
          <div className="cargando-contenedor">
            <div className="spinner"></div>
            <p>Sincronizando métricas y tablas con los nuevos filtros...</p>
          </div>
        ) : (
          <>
            {}
            <div className="tarjetas-grid" aria-label="KPIs Dinámicos">
              <TarjetaMetrica
                titulo="Temperatura Promedio"
                valor={metricas?.promedioTemp}
                subtitulo="Media de estaciones filtradas"
                icono="🌡️"
                color="#f59e0b"
              />

              <TarjetaMetrica
                titulo="Nivel Medio PM2.5"
                valor={metricas?.promedioPM25}
                subtitulo="Partículas finas en suspensión"
                icono="🌫️"
                color="#38bdf8"
              />

              <TarjetaMetrica
                titulo="Viento Promedio"
                valor={metricas?.promedioViento}
                subtitulo="Velocidad media de anemómetro"
                icono="💨"
                color="#10b981"
              />

              <TarjetaMetrica
                titulo="Sensores Activos"
                valor={metricas?.activas}
                subtitulo="Disponibilidad operativa actual"
                icono="📡"
                color="#a855f7"
              />
            </div>

            {}
            <ContenedorGrafico registros={registros} />

            {}
            <TablaDatos datos={registros} />
          </>
        )}
      </section>
    </div>
  );
}
