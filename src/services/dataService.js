/**
 * Capa de Servicios: dataService.js
 * Prácticas 2, 3, 4 y 5 - Unidad 3: Arquitectura, APIs, Dashboard y Visualización Avanzada
 * 
 * Gestiona el consumo de endpoints externos (Axios / Open-Meteo), la carga
 * de datasets, el filtrado multidimensional y el Data Mapping para Chart.js.
 */

import apiClient from './apiClient';
import datasetRaw from '../data/dataset.json';

/**
 * Consulta la API externa de Open-Meteo (/forecast) para obtener telemetría meteorológica (Práctica 3).
 * 
 * @param {number} [latitud=19.26] - Latitud geográfica (por defecto: Chalco, Edo. Méx.)
 * @param {number} [longitud=-98.89] - Longitud geográfica (por defecto: Chalco, Edo. Méx.)
 * @returns {Promise<Object>} Objeto con datos limpios y formateados para la interfaz.
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
 * Filtra el dataset crudo en función de los parámetros de categoría y fecha (Práctica 4).
 * 
 * @param {Array} datos - Arreglo de registros crudos.
 * @param {Object} [filtros={ categoria: 'todas', fecha: '' }] - Criterios de filtrado.
 * @returns {Array} Subconjunto filtrado de registros.
 */
export const aplicarFiltros = (datos, filtros = { categoria: 'todas', fecha: '' }) => {
  if (!datos || !Array.isArray(datos)) return [];

  return datos.filter((item) => {
    // 1. Filtrado por fecha (coincidencia de prefijo YYYY-MM-DD)
    if (filtros.fecha && !item.fechaRegistro.startsWith(filtros.fecha)) {
      return false;
    }

    // 2. Filtrado por categoría analítica
    if (filtros.categoria && filtros.categoria !== 'todas') {
      switch (filtros.categoria) {
        case 'temperatura':
          return Number(item.temperatura) >= 23.0;

        case 'viento':
          return Number(item.viento || 0) >= 20.0;

        case 'calidadAire':
          return Number(item.pm25) > 35.0;

        case 'operativas':
          return item.estadoOperativo === 'Activo';

        default:
          return true;
      }
    }

    return true;
  });
};

/**
 * Procesa un arreglo de datos aplicando cálculos estadísticos y transformaciones visuales.
 * 
 * @param {Array} datos - Arreglo de registros crudos.
 * @param {Object} [filtros] - Opcional: filtros { categoria, fecha }.
 * @returns {Object} Registros enriquecidos, métricas consolidadas y vectores para gráficos.
 */
export const procesarDatos = (datos, filtros = null) => {
  const datosAProcesar = filtros ? aplicarFiltros(datos, filtros) : datos;

  if (!datosAProcesar || !Array.isArray(datosAProcesar) || datosAProcesar.length === 0) {
    return {
      registros: [],
      metricas: {
        total: '0 Sensores',
        promedioTemp: '0.0 °C',
        promedioPM25: '0.0 µg/m³',
        promedioCO2: '0 ppm',
        promedioViento: '0.0 km/h',
        activas: '0 de 0',
        estacionCritica: 'Ninguna'
      },
      etiquetas: [],
      valores: []
    };
  }

  const total = datosAProcesar.length;

  const sumaTemp = datosAProcesar.reduce((acc, curr) => acc + Number(curr.temperatura || 0), 0);
  const promedioTemp = (sumaTemp / total).toFixed(1);

  const sumaPM25 = datosAProcesar.reduce((acc, curr) => acc + Number(curr.pm25 || 0), 0);
  const promedioPM25 = (sumaPM25 / total).toFixed(1);

  const sumaCO2 = datosAProcesar.reduce((acc, curr) => acc + Number(curr.co2 || 0), 0);
  const promedioCO2 = Math.round(sumaCO2 / total);

  const sumaViento = datosAProcesar.reduce((acc, curr) => acc + Number(curr.viento || 0), 0);
  const promedioViento = (sumaViento / total).toFixed(1);

  const activas = datosAProcesar.filter(item => item.estadoOperativo === 'Activo').length;

  const estacionCritica = datosAProcesar.reduce((prev, curr) => 
    (Number(curr.pm25) > Number(prev.pm25)) ? curr : prev, datosAProcesar[0]
  );

  const registrosProcesados = datosAProcesar.map(item => {
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
      vientoFormatted: `${item.viento || 0} km/h`,
      severidadCalidad
    };
  });

  const etiquetas = datosAProcesar.map(item => item.estacion);
  const valores = datosAProcesar.map(item => item.pm25);

  return {
    registros: registrosProcesados,
    metricas: {
      total: `${total} Sensores`,
      promedioTemp: `${promedioTemp} °C`,
      promedioPM25: `${promedioPM25} µg/m³`,
      promedioCO2: `${promedioCO2} ppm`,
      promedioViento: `${promedioViento} km/h`,
      activas: `${activas} de ${total}`,
      estacionCritica: estacionCritica.estacion
    },
    etiquetas,
    valores
  };
};

/**
 * Transforma y limpia un conjunto de datos para alimentar bibliotecas de visualización (Chart.js).
 * Implementa Data Mapping extrayendo etiquetas para el eje X y valores numéricos para el eje Y,
 * con validación defensiva ante valores nulos, indefinidos o vacíos (Práctica 5).
 * 
 * @param {Array|Object} datosCrudos - Arreglo de registros o contenedor { registros: [...] }.
 * @returns {Object} Estructura limpia { labels: Array, values: Array, temperaturas: Array, vientos: Array, categorias: Object }
 */
export const formatearParaGrafico = (datosCrudos) => {
  // Validación defensiva requerida por la Práctica 5
  if (!datosCrudos) {
    return { labels: [], values: [], temperaturas: [], vientos: [], categorias: {} };
  }

  // Compatibilidad si se envía el objeto de visualización { registros: [...] } o el arreglo directo
  const lista = Array.isArray(datosCrudos)
    ? datosCrudos
    : (Array.isArray(datosCrudos?.registros) ? datosCrudos.registros : []);

  if (lista.length === 0) {
    return { labels: [], values: [], temperaturas: [], vientos: [], categorias: {} };
  }

  // Eje X: Etiquetas limpias y legibles para cada estación o registro
  const labels = lista.map((item) =>
    item.estacion ? item.estacion.replace('Estación ', '') : `Sensor #${item.id}`
  );

  // Eje Y: Valores numéricos de la serie continua (concentración PM2.5)
  const values = lista.map((item) => Number(item.pm25) || 0);

  // Series numéricas adicionales para enriquecimiento analítico
  const temperaturas = lista.map((item) => Number(item.temperatura) || 0);
  const vientos = lista.map((item) => Number(item.viento) || 0);

  // Agrupación por zonas geográficas para comparativas
  const categorias = lista.reduce((acc, curr) => {
    const zona = curr.zona || 'General';
    if (!acc[zona]) {
      acc[zona] = { sumaPM25: 0, conteo: 0, promedio: 0 };
    }
    acc[zona].sumaPM25 += Number(curr.pm25) || 0;
    acc[zona].conteo += 1;
    acc[zona].promedio = Number((acc[zona].sumaPM25 / acc[zona].conteo).toFixed(1));
    return acc;
  }, {});

  return {
    labels,
    values,
    temperaturas,
    vientos,
    categorias
  };
};

/**
 * Simula una petición HTTP asíncrona devolviendo el dataset filtrado y procesado.
 * 
 * @param {Object} [filtros={ categoria: 'todas', fecha: '' }] - Criterios de filtrado.
 * @returns {Promise<Object>} Promesa que resuelve a los datos estructurados para visualización.
 */
export const obtenerDatosVisualizacion = async (filtros = { categoria: 'todas', fecha: '' }) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const copiaDatos = JSON.parse(JSON.stringify(datasetRaw));
        const resultado = procesarDatos(copiaDatos, filtros);
        resolve(resultado);
      }, 200);
    } catch (error) {
      reject(new Error("Error al obtener los datos de visualización: " + error.message, { cause: error }));
    }
  });
};

export default {
  obtenerSerieDeTiempo,
  obtenerDatosVisualizacion,
  procesarDatos,
  aplicarFiltros,
  formatearParaGrafico
};
