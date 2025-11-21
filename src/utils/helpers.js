// Форматирование времени
export const formatTime = (dateString) => {
  if (!dateString) return '--:--';
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Форматирование даты
export const formatDate = (dateString) => {
  if (!dateString) return '--.--.----';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Получение иконки погоды
export const getWeatherIcon = (condition) => {
  if (!condition) return '🌤️';
  
  const conditionLower = condition.toLowerCase();
  
  const icons = {
    sunny: '☀️',
    clear: '☀️',
    'partly cloudy': '⛅',
    cloudy: '☁️',
    overcast: '☁️',
    mist: '🌫️',
    fog: '🌫️',
    'light rain': '🌦️',
    rain: '🌧️',
    'heavy rain': '⛈️',
    thunderstorm: '⛈️',
    snow: '❄️',
    'light snow': '🌨️',
    sleet: '🌨️',
    drizzle: '🌦️',
  };

  return icons[conditionLower] || '🌤️';
};

// Добавление в историю поиска
export const addToSearchHistory = (history, weatherData) => {
  const newSearch = {
    id: Date.now().toString(),
    location: weatherData.location.name,
    country: weatherData.location.country,
    temperature: Math.round(weatherData.current.temp_c),
    condition: weatherData.current.condition.text,
    timestamp: new Date().toISOString(),
    type: 'search'
  };

  // Удаляем дубликаты и ограничиваем историю 10 элементами
  const filteredHistory = history.filter(
    item => item.location !== newSearch.location
  );

  return [newSearch, ...filteredHistory.slice(0, 9)];
};

// Проверка подключения к интернету
export const checkInternetConnection = async () => {
  try {
    const response = await fetch('https://www.google.com', { method: 'HEAD' });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Форматирование температуры
export const formatTemperature = (temp, unit = 'c') => {
  if (unit === 'c') {
    return `${Math.round(temp)}°C`;
  } else {
    return `${Math.round(temp * 9/5 + 32)}°F`;
  }
};

// Форматирование скорости ветра
export const formatWindSpeed = (speed, unit = 'kmh') => {
  if (unit === 'kmh') {
    return `${speed} км/ч`;
  } else {
    return `${(speed / 1.609).toFixed(1)} миль/ч`;
  }
};