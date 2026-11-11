import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.open-meteo.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Tiempo límite de espera de 10 segundos
});

export default apiClient;
