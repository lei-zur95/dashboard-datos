import apiClient from './apiClient';
import datasetRaw from '../data/dataset.json';

/**
 * @param {number} [latitud=19.26] 
 * @param {number} [longitud=-98.89] 
 * @returns {Promise<Object>} 
 */
export const obtenerSerieDeTiempo = async (latitud = 19.26, longitud = -98.89) => {
  try {
    const response = await apiClient.get('/forecast', {
      params: {
        latitude: latitud,
        longitude: longitud,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m',
        hourly: 'temperature_2m',
        timezone: 'auto'
      }
    });

    const data = response.data;
    const current = data.current || {};
    const units = data.current_units || {};

    return {
      temperaturaActual: `${current.temperature_2m !== undefined ? current.temperature_2m : 'N/A'} ${units.temperature_2m || '°C'}`,
      sensacionTermica: `${current.apparent_temperature !== undefined ? current.apparent_temperature : 'N/A'} ${units.apparent_temperature || '°C'}`,
      humedadRelativa: `${current.relative_humidity_2m !== undefined ? current.relative_humidity_2m : 'N/A'} ${units.relative_humidity_2m || '%'}`,
      velocidadViento: `${current.wind_speed_10m !== undefined ? current.wind_speed_10m : 'N/A'} ${units.wind_speed_10m || 'km/h'}`,
      precipitacion: `${current.precipitation !== undefined ? current.precipitation : 0} ${units.precipitation || 'mm'}`,
      horaRegistro: current.time ? current.time.replace('T', ' ') : 'Reciente',
      coordenadas: `${data.latitude?.toFixed(2)}° N, ${data.longitude?.toFixed(2)}° W`,
      zonaHoraria: data.timezone || 'Auto',
      serieHoraria: data.hourly || null,
      raw: data
    };
  } catch (error) {
    let mensajeError;

    if (error.response) {
      mensajeError = `Error del Servidor (${error.response.status}): ${error.response.data?.reason || error.message}`;
    } else if (error.request) {
      mensajeError = 'Fallo de conexión: No se pudo contactar al servidor de Open-Meteo. Verifica tu conexión a internet o la URL configurada.';
    } else {
      mensajeError = `Error en la solicitud: ${error.message}`;
    }

    throw new Error(mensajeError, { cause: error });
  }
};

/**
 * @returns {Promise<Array>} Promesa que resuelve al array de registros del dataset.
 */
export const obtenerDatosVisualizacion = async () => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(JSON.parse(JSON.stringify(datasetRaw)));
      }, 350);
    } catch (error) {
      reject(new Error("Error al obtener el dataset de visualización: " + error.message, { cause: error }));
    }
  });
};

/**
 * @param {Array} datos 
 * @returns {Object}
 */
export const procesarDatos = (datos) => {
  if (!datos || !Array.isArray(datos) || datos.length === 0) {
    return {
      registros: [],
      metricas: {
        total: 0,
        promedioTemp: "0.0 °C",
        promedioPM25: "0.0 µg/m³",
        promedioCO2: "0 ppm",
        activas: "0 / 0",
        estacionCritica: "N/A"
      },
      etiquetas: [],
      valores: []
    };
  }

  const total = datos.length;

  const sumaTemp = datos.reduce((acc, curr) => acc + Number(curr.temperatura || 0), 0);
  const promedioTemp = (sumaTemp / total).toFixed(1);

  const sumaPM25 = datos.reduce((acc, curr) => acc + Number(curr.pm25 || 0), 0);
  const promedioPM25 = (sumaPM25 / total).toFixed(1);

  const sumaCO2 = datos.reduce((acc, curr) => acc + Number(curr.co2 || 0), 0);
  const promedioCO2 = Math.round(sumaCO2 / total);

  const activas = datos.filter(item => item.estadoOperativo === 'Activo').length;

  const estacionCritica = datos.reduce((prev, curr) => 
    (Number(curr.pm25) > Number(prev.pm25)) ? curr : prev, datos[0]
  );

  const registrosProcesados = datos.map(item => {
    let severidadCalidad = 'normal';
    if (item.calidadAire === 'Buena') severidadCalidad = 'buena';
    else if (item.calidadAire === 'Aceptable') severidadCalidad = 'aceptable';
    else if (item.calidadAire === 'Mala') severidadCalidad = 'mala';
    else if (item.calidadAire === 'Muy Mala') severidadCalidad = 'critica';

    return {
      ...item,
      temperaturaFormatted: `${item.temperatura} °C`,
      humedadFormatted: `${item.humedad} %`,
      pm25Formatted: `${item.pm25} µg/m³`,
      co2Formatted: `${item.co2} ppm`,
      severidadCalidad
    };
  });

  const etiquetas = datos.map(item => item.estacion);
  const valores = datos.map(item => item.pm25);

  return {
    registros: registrosProcesados,
    metricas: {
      total: `${total} Sensores`,
      promedioTemp: `${promedioTemp} °C`,
      promedioPM25: `${promedioPM25} µg/m³`,
      promedioCO2: `${promedioCO2} ppm`,
      activas: `${activas} de ${total}`,
      estacionCritica: estacionCritica.estacion
    },
    etiquetas,
    valores
  };
};

export default {
  obtenerSerieDeTiempo,
  obtenerDatosVisualizacion,
  procesarDatos
};
