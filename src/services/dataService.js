import datasetRaw from '../data/dataset.json';

/**
 * 
 * @returns {Promise<Array>} 
 */
export const obtenerDatosVisualizacion = async () => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(JSON.parse(JSON.stringify(datasetRaw)));
      }, 350);
    } catch (error) {
      reject(new Error("Error al obtener el dataset de visualización: " + error.message));
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
  obtenerDatosVisualizacion,
  procesarDatos
};
