import { useState } from 'react';
import { obtenerSerieDeTiempo } from '../services/dataService';
import TarjetaMetrica from './TarjetaMetrica';

export default function PanelAnalitico() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleConsultarClima = async (forzarError = false) => {
    setCargando(true);
    setError(null);

    try {
      const lat = forzarError ? 9999 : 19.26;
      const lon = forzarError ? 9999 : -98.89;

      const resultado = await obtenerSerieDeTiempo(lat, lon);
      setDatos(resultado);
    } catch (err) {
      setError(err.message || 'Error al conectar con la API de ciencia de datos.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="panel-analitico-card">
      <div className="panel-analitico-header">
        <div>
          <span className="seccion-tag">Integración de API REST &bull; Práctica 3</span>
          <h3 className="panel-analitico-titulo">
            Telemetría Meteorológica en Tiempo Real (Open-Meteo API)
          </h3>
          <p className="panel-analitico-descripcion">
            Consumo asíncrono con Axios conectado a microservicios externos de datos meteorológicos y series temporales.
          </p>
        </div>

        {}
        <div className="panel-acciones-botones">
          <button
            type="button"
            className="btn-antgravity-primary"
            onClick={() => handleConsultarClima(false)}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner-boton"></span>
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <span>📡</span>
                <span>Analizar Datos Climáticos</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-antgravity-secondary"
            onClick={() => handleConsultarClima(true)}
            disabled={cargando}
            title="Prueba de laboratorio: Fuerza una respuesta de error para verificar la captura en la UI"
          >
            Simular Fallo de Conexión
          </button>
        </div>
      </div>

      {}

      {}
      {cargando && (
        <div className="panel-estado-cargando" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p className="texto-cargando">Analizando datos...</p>
          <span className="subtexto-cargando">Realizando petición GET a /v1/forecast mediante Axios</span>
        </div>
      )}

      {}
      {!cargando && error && (
        <div 
          className="alerta-error"
          role="alert"
          style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #f87171',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            margin: '1.25rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)'
          }}
        >
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>⚠️</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>Error en la Petición a la API:</strong>
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        </div>
      )}

      {}
      {!cargando && !error && datos && (
        <div className="panel-datos-contenedor">
          <div className="panel-datos-metadata">
            <span><strong>Ubicación:</strong> {datos.coordenadas}</span>
            <span>&bull;</span>
            <span><strong>Zona Horaria:</strong> {datos.zonaHoraria}</span>
            <span>&bull;</span>
            <span><strong>Última Lectura:</strong> {datos.horaRegistro}</span>
          </div>

          <div className="tarjetas-grid" style={{ marginBottom: 0 }}>
            <TarjetaMetrica
              titulo="Temperatura Actual"
              valor={datos.temperaturaActual}
              subtitulo="Medición atmosférica a 2 metros"
              icono="🌡️"
              color="#38bdf8"
            />
            <TarjetaMetrica
              titulo="Sensación Térmica"
              valor={datos.sensacionTermica}
              subtitulo="Índice aparente de confort térmico"
              icono="🔥"
              color="#f59e0b"
            />
            <TarjetaMetrica
              titulo="Humedad Relativa"
              valor={datos.humedadRelativa}
              subtitulo="Concentración de vapor en aire"
              icono="💧"
              color="#06b6d4"
            />
            <TarjetaMetrica
              titulo="Velocidad del Viento"
              valor={datos.velocidadViento}
              subtitulo="Velocidad media anemométrica a 10m"
              icono="💨"
              color="#10b981"
            />
          </div>
        </div>
      )}

      {}
      {!cargando && !error && !datos && (
        <div className="panel-estado-espera">
          <p>
            Haz clic en <strong>&ldquo;Analizar Datos Climáticos&rdquo;</strong> para iniciar la petición HTTP vía Axios a la API pública de Open-Meteo.
          </p>
        </div>
      )}
    </section>
  );
}
