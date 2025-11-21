// Форматирование времени
export const formatTime = (dateString) => {
  if (!dateString) return '--:--';
  
  try {
    // Пытаемся распарсить как ISO строку
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Если это не ISO строка (например, "06:45 AM"), конвертируем в 24-часовой формат
      return convertTo24HourFormat(dateString);
    }
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // 24-часовой формат
    });
  } catch (error) {
    console.error('Ошибка форматирования времени:', error);
    return dateString; // Возвращаем исходное значение в случае ошибки
  }
};

// Конвертация времени из 12-часового формата (AM/PM) в 24-часовой
export const convertTo24HourFormat = (time12h) => {
  if (!time12h) return '--:--';
  
  try {
    // Разбиваем строку на время и AM/PM
    const [time, period] = time12h.split(' ');
    if (!time || !period) return time12h;
    
    // Разбиваем время на часы и минуты
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) return time12h;
    
    let hours24 = parseInt(hours, 10);
    
    // Конвертируем в 24-часовой формат
    if (period.toUpperCase() === 'PM' && hours24 !== 12) {
      hours24 += 12;
    } else if (period.toUpperCase() === 'AM' && hours24 === 12) {
      hours24 = 0;
    }
    
    // Форматируем с ведущими нулями
    return `${hours24.toString().padStart(2, '0')}:${minutes}`;
  } catch (error) {
    console.error('Ошибка конвертации времени:', error);
    return time12h;
  }
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

// Форматирование температуры с учетом настроек
export const formatTemperature = (tempC, settings) => {
  if (settings.celsius) {
    return `${Math.round(tempC)}°C`;
  } else {
    // Конвертация в Кельвины: K = C + 273.15
    const tempK = tempC + 273.15;
    return `${Math.round(tempK)}K`;
  }
};

// Форматирование скорости ветра с учетом настроек
export const formatWindSpeed = (speedKph, settings) => {
  if (settings.kmh) {
    return `${speedKph} км/ч`;
  } else {
    // Конвертация в м/с: 1 км/ч = 0.277778 м/с
    const speedMs = speedKph * 0.277778;
    return `${speedMs.toFixed(1)} м/с`;
  }
};

// Форматирование температуры для истории и избранного
export const formatTemperatureForDisplay = (tempC, settings) => {
  if (settings.celsius) {
    return `${tempC}°C`;
  } else {
    const tempK = tempC + 273.15;
    return `${Math.round(tempK)}K`;
  }
};