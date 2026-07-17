import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function extractErrorMessage(error, fallback = 'Произошла ошибка при обращении к серверу') {
  if (error.response) {
    const data = error.response.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object' && data.message) return data.message;
    if (error.response.status === 404) return 'Запись не найдена';
  }
  return fallback;
}
