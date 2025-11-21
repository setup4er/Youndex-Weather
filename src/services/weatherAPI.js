import axios from 'axios';

const API_KEY = '1961bb74564d412286f53506240109';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Кэш для запросов
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут

export const fetchWeatherData = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const cacheKey = `current_${encodedQuery.toLowerCase()}`;
    
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Используем кэшированные данные для:', query);
      return cached.data;
    }

    console.log('Запрос погоды для:', query);
    
    // Используем forecast endpoint чтобы получить данные о восходе и закате
    const response = await axios.get(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodedQuery}&days=1&aqi=no&alerts=no`,
      { timeout: 10000 }
    );
    
    // Форматируем данные для совместимости с текущей структурой
    const formattedData = {
      location: response.data.location,
      current: response.data.current,
      forecast: response.data.forecast
    };
    
    // Сохраняем в кэш
    cache.set(cacheKey, {
      data: formattedData,
      timestamp: Date.now()
    });
    
    return formattedData;
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