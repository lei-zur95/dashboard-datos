import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PanelAnalitico from './components/PanelAnalitico';
import TarjetaMetrica from './components/TarjetaMetrica';
import TablaDatos from './components/TablaDatos';
import { obtenerDatosVisualizacion, procesarDatos } from './services/dataService';
import './App.css';

export default function App() {
  const [dataset, setDataset] = useState([]);
  const [datosProcesados, setDatosProcesados] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarYProcesarDatos = async () => {
      try {
        setCargando(true);
        setError(null);

        const datosCrudos = await obtenerDatosVisualizacion();
        setDataset(datosCrudos);

        const resultadoProcesamiento = procesarDatos(datosCrudos);
        setDatosProcesados(resultadoProcesamiento.registros);
        setMetricas(resultadoProcesamiento.metricas);
      } catch (err) {
        console.error("Error al cargar datos desde el servicio modular:", err);
        setError("Ocurrió un error al cargar los datos del servicio.");
      } finally {
        setCargando(false);
      }
    };

    cargarYProcesarDatos();
  }, []);

  return (
    <div className="app-wrapper">
      {}
      <Navbar />

      <main className="dashboard-container">
        {}
        <PanelAnalitico />

        {}
        <header className="seccion-header">
          <div>
            <span className="seccion-tag">Telemetría IoT Local &bull; Dataset</span>
            <h2 className="seccion-titulo">Red de Monitoreo Ambiental Estacionario</h2>
            <p className="seccion-subtitulo">
              Telemetría y condiciones meteorológicas de <strong>{dataset.length}</strong> estaciones de monitoreo, 
              procesadas en tiempo real mediante el servicio modular <code className="codigo-inline">dataService.js</code>.
            </p>
          </div>
          <div className="badge-estado-conexion">
            <span className="punto-latencia"></span>
            <span>Servicio Local Conectado</span>
          </div>
        </header>

        {}
        {cargando ? (
          <div className="cargando-contenedor">
            <div className="spinner"></div>
            <p>Consultando servicio de datos y calculando métricas...</p>
          </div>
        ) : error ? (
          <div className="tabla-vacia" style={{ color: '#fb7185' }}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {}
            <section className="tarjetas-grid" aria-label="Resumen Estadístico">
              <TarjetaMetrica
                titulo="Temperatura Promedio"
                valor={metricas?.promedioTemp}
                subtitulo="Media global de la red"
                icono="🌡️"
                color="#f59e0b"
              />

              <TarjetaMetrica
                titulo="Nivel Medio PM2.5"
                valor={metricas?.promedioPM25}
                subtitulo="Concentración de micropartículas"
                icono="🌫️"
                color="#38bdf8"
              />

              <TarjetaMetrica
                titulo="Concentración CO₂"
                valor={metricas?.promedioCO2}
                subtitulo="Promedio general en ppm"
                icono="🧪"
                color="#a855f7"
              />

              <TarjetaMetrica
                titulo="Estaciones Activas"
                valor={metricas?.activas}
                subtitulo="Disponibilidad operativa"
                icono="📡"
                color="#10b981"
              />
            </section>

            {}
            <section aria-label="Detalle de Registros">
              <TablaDatos datos={datosProcesados} />
            </section>
          </>
        )}
      </main>

      {}
      <footer className="footer-dashboard">
        <div className="footer-content">
          <span>Desarrollo de Aplicaciones para Ciencia de Datos &bull; Unidad 3</span>
          <span>Desarrollado por: <strong>Vázquez Martín Eliezer Zuriel</strong></span>
        </div>
      </footer>
    </div>
  );
}
