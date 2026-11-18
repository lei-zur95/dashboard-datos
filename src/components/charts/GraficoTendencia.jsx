import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registro explícito de módulos requeridos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Componente: GraficoTendencia.jsx
 * Práctica 5 - Unidad 3: Visualización Avanzada de Datos en el Dashboard
 * 
 * Implementa un gráfico de líneas animado e interactivo con react-chartjs-2
 * para representar la serie continua de mediciones o predicciones.
 * 
 * @param {Object} props
 * @param {Array<string>} props.labels - Etiquetas del eje X
 * @param {Array<number>} props.values - Valores numéricos del eje Y
 * @param {string} [props.titulo] - Título descriptivo de la gráfica
 */
export default function GraficoTendencia({
  labels = [],
  values = [],
  titulo = 'Evolución de Concentración PM2.5 (µg/m³)'
}) {
  // Manejo de caso vacío
  if (!labels || labels.length === 0) {
    return (
      <div className="chart-card-wrapper">
        <div className="chart-header-card">
          <h4 className="chart-title-text">{titulo}</h4>
        </div>
        <div className="chart-empty-fallback">
          <span className="chart-empty-icon">📈</span>
          <p>No hay datos disponibles para mostrar la tendencia.</p>
        </div>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Partículas PM2.5 (µg/m³)',
        data: values,
        fill: true,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.18)',
        borderWidth: 2.5,
        tension: 0.35, // Curvatura suave de línea
        pointBackgroundColor: '#0284c7',
        pointBorderColor: '#38bdf8',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#38bdf8',
        pointHoverBorderWidth: 2.5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 650,
      easing: 'easeInOutQuad'
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: 'inherit', size: 12 },
          boxWidth: 14
        }
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
        usePointStyle: true,
        callbacks: {
          label: (context) => ` Nivel: ${context.parsed.y} µg/m³`
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
          color: 'rgba(51, 65, 85, 0.25)'
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
          <span className="seccion-tag">Chart.js &bull; Línea Temporal</span>
          <h4 className="chart-title-text">{titulo}</h4>
        </div>
        <span className="chart-legend-badge">{labels.length} estaciones</span>
      </div>

      <div className="chart-canvas-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
