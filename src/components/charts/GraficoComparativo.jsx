import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registro explícito de módulos requeridos para gráficos de barras
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Componente: GraficoComparativo.jsx
 * Práctica 5 - Unidad 3: Visualización Avanzada de Datos en el Dashboard
 * 
 * Implementa un gráfico de barras interactivo con react-chartjs-2
 * para comparar proporciones y mediciones entre estaciones y zonas.
 * 
 * @param {Object} props
 * @param {Array<string>} props.labels - Etiquetas de categorías o estaciones en el eje X
 * @param {Array<number>} props.values - Mediciones numéricas del eje Y
 * @param {string} [props.titulo] - Título descriptivo del gráfico
 */
export default function GraficoComparativo({
  labels = [],
  values = [],
  titulo = 'Comparativa de Severidad Ambiental por Sensor'
}) {
  // Manejo defensivo de conjunto vacío
  if (!labels || labels.length === 0) {
    return (
      <div className="chart-card-wrapper">
        <div className="chart-header-card">
          <h4 className="chart-title-text">{titulo}</h4>
        </div>
        <div className="chart-empty-fallback">
          <span className="chart-empty-icon">📊</span>
          <p>No hay datos disponibles para la comparativa.</p>
        </div>
      </div>
    );
  }

  // Generación de paleta dinámica diferenciada según el valor de cada barra
  const backgroundColors = values.map((val) => {
    if (val > 50) return 'rgba(244, 63, 94, 0.85)'; // Crítica / Roja
    if (val > 25) return 'rgba(245, 158, 11, 0.85)'; // Aceptable / Ámbar
    return 'rgba(16, 185, 129, 0.85)'; // Buena / Esmeralda
  });

  const borderColors = values.map((val) => {
    if (val > 50) return '#f43f5e';
    if (val > 25) return '#f59e0b';
    return '#10b981';
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Concentración PM2.5 (µg/m³)',
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1.5,
        borderRadius: 6, // Bordes redondeados en la parte superior de cada barra
        borderSkipped: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 650,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#0f172a',
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        callbacks: {
          label: (context) => ` Concentración: ${context.parsed.y} µg/m³`,
          afterLabel: (context) => {
            const val = context.parsed.y;
            if (val > 50) return ' Estado: Calidad Crítica / Mala';
            if (val > 25) return ' Estado: Calidad Aceptable';
            return ' Estado: Calidad Óptima / Buena';
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 0
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          font: { size: 10 }
        },
        grid: {
          color: 'rgba(51, 65, 85, 0.25)'
        }
      }
    }
  };

  return (
    <div className="chart-card-wrapper">
      <div className="chart-header-card">
        <div>
          <span className="seccion-tag">Chart.js &bull; Barras Comparativas</span>
          <h4 className="chart-title-text">{titulo}</h4>
        </div>
        <div className="chart-semaforo-leyenda">
          <span className="punto-leyenda punto-verde"></span> Buena
          <span className="punto-leyenda punto-amarillo"></span> Aceptable
          <span className="punto-leyenda punto-rojo"></span> Crítica
        </div>
      </div>

      <div className="chart-canvas-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
