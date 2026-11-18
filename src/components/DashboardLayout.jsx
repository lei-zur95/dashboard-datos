import { useState, useEffect } from 'react';
import PanelFiltros from './PanelFiltros';
import TarjetaMetrica from './TarjetaMetrica';
import GraficoTendencia from './charts/GraficoTendencia';
import GraficoComparativo from './charts/GraficoComparativo';
import TablaDatos from './TablaDatos';
import PanelAnalitico from './PanelAnalitico';
import { obtenerDatosVisualizacion, formatearParaGrafico } from '../services/dataService';

/**
 * Componente Contenedor: DashboardLayout.jsx
 * Práctica 5 - Unidad 3: Visualización Avanzada de Datos en el Dashboard
 * 
 * Gestiona el estado compartido de los filtros (Lifting State Up),
 * coordina la obtención de datos y ensambla la interfaz integrando
 * gráficos interactivos con Chart.js y react-chartjs-2 en CSS Grid.
 */
export default function DashboardLayout() {
  // 1. Estado global compartido para los controles de filtrado
  const [filtros, setFiltros] = useState({
    categoria: 'todas',
    fecha: ''
  });

  // 2. Estado local para almacenar la información procesada y sincronizada
  const [datosVisualizacion, setDatosVisualizacion] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 3. useEffect que "escucha" cambios en [filtros] para sincronizar en tiempo real
  useEffect(() => {
    let activo = true;

    const actualizarDatosDashboard = async () => {
      try {
        setCargando(true);
        // Consulta el servicio modular pasando el estado actual de filtros
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

  // Data Mapping: Estructuras limpias { labels, values } preparadas para Chart.js
  const datosGrafico = formatearParaGrafico(datosVisualizacion);

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

        {/* Resumen contextual de la arquitectura */}
        <div className="sidebar-info-card">
          <h5 className="sidebar-info-titulo">Visualización Avanzada</h5>
          <p className="sidebar-info-desc">
            Integración de <strong>Chart.js</strong> y <strong>react-chartjs-2</strong> en Canvas HTML5. 
            Las gráficas de línea y barras se animan reactivamente ante cualquier cambio en el panel de filtros.
          </p>
        </div>
      </aside>

      {/* =========================================================================
          ÁREA PRINCIPAL (GRID FLUIDO Y RESPONSIVO)
          ========================================================================= */}
      <section className="dashboard-main-area">
        {/* Práctica 3: Telemetría en tiempo real desde Open-Meteo vía Axios */}
        <PanelAnalitico />

        {/* Encabezado del área de visualización analítica */}
        <header className="seccion-header">
          <div>
            <span className="seccion-tag">Práctica 5 &bull; Visualización Avanzada</span>
            <h2 className="seccion-titulo">Tablero de Control y Análisis Gráfico</h2>
            <p className="seccion-subtitulo">
              Visualizaciones interactivas de telemetría ambiental filtradas por 
              categoría <strong>&ldquo;{filtros.categoria}&rdquo;</strong>
              {filtros.fecha ? ` y fecha "${filtros.fecha}"` : ' (todas las fechas)'}.
            </p>
          </div>

          <div className="badge-estado-conexion">
            <span className="punto-latencia"></span>
            <span>{registros.length} Estaciones Analizadas</span>
          </div>
        </header>

        {cargando ? (
          <div className="cargando-contenedor">
            <div className="spinner"></div>
            <p>Sincronizando métricas y renderizando gráficos interactivos...</p>
          </div>
        ) : (
          <>
            {/* 1. SECCIÓN SUPERIOR: Cuadrícula de Tarjetas de Métricas (KPIs) */}
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

            {/* 2. SECCIÓN CENTRAL: Cuadrícula de Gráficos Interactivos (Chart.js) */}
            <div className="charts-grid-container" aria-label="Gráficos de Visualización">
              {/* Gráfico 1: Evolución temporal o continua con <Line /> */}
              <GraficoTendencia
                labels={datosGrafico.labels}
                values={datosGrafico.values}
                titulo="Evolución de Concentración PM2.5 (µg/m³)"
              />

              {/* Gráfico 2: Comparativa de severidad con <Bar /> */}
              <GraficoComparativo
                labels={datosGrafico.labels}
                values={datosGrafico.values}
                titulo="Comparativa de Severidad por Sensor"
              />
            </div>

            {/* 3. SECCIÓN INFERIOR: Tabla de Datos Tabular */}
            <TablaDatos datos={registros} />
          </>
        )}
      </section>
    </div>
  );
}
