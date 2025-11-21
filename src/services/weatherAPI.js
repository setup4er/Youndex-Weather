import axios from 'axios';

const API_KEY = '1961bb74564d412286f53506240109';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// Кэш для запросов
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут

export const fetchWeatherData = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const cacheKey = encodedQuery.toLowerCase();
    
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Используем кэшированные данные для:', query);
      return cached.data;
    }

    console.log('Запрос погоды для:', query);
    
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${encodedQuery}&aqi=no`,
      { timeout: 10000 }
    );
    
    // Сохраняем в кэш
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    console.error('Ошибка API:', error.response?.data || error.message);
    
    if (error.response?.data?.error?.code === 1006) {
      throw new Error('Город не найден. Проверьте правильность написания.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Превышено время ожидания ответа от сервера');
    } else if (error.response?.status === 401) {
      throw new Error('Ошибка авторизации API');
    } else {
      throw new Error('Ошибка соединения. Проверьте интернет.');
    }
  }
};

export const fetchWeatherByCoords = async (lat, lon) => {
  return fetchWeatherData(`${lat},${lon}`);
};

// Очистка кэша
export const clearCache = () => {
  const cacheSize = cache.size;
  cache.clear();
  console.log(`✅ Кэш очищен. Удалено записей: ${cacheSize}`);
  return cacheSize;
};

// Получение статистики кэша
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};