export const API_CONFIG = {
  BASE_URL: 'http://api.weatherapi.com/v1',
  API_KEY: '1961bb74564d412286f53506240109',
  ENDPOINTS: {
    CURRENT: '/current.json',
    FORECAST: '/forecast.json',
    SEARCH: '/search.json'
  }
};

export const WEATHER_CONDITIONS = {
  SUNNY: 'Sunny',
  CLOUDY: 'Cloudy',
  RAINY: 'Rainy',
  SNOWY: 'Snowy',
  THUNDERSTORM: 'Thunderstorm',
  FOG: 'Fog',
  MIST: 'Mist'
};

export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'search_history',
  SETTINGS: 'app_settings',
  FAVORITES: 'favorite_locations'
};

export const DEFAULT_SETTINGS = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  autoRefresh: true,
  theme: 'light'
};

export const SCREENS = {
  HOME: 'Home',
  SEARCH: 'Search',
  HISTORY: 'History',
  SETTINGS: 'Settings',
  ABOUT: 'About'
};
export const APP_VERSION = {
  value: "4.1.0"
};

// Список мировых столиц
export const WORLD_CAPITALS = [
  // Европа
  { name: 'Москва', country: 'Россия', region: 'Европа' },
  { name: 'Лондон', country: 'Великобритания', region: 'Европа' },
  { name: 'Париж', country: 'Франция', region: 'Европа' },
  { name: 'Берлин', country: 'Германия', region: 'Европа' },
  { name: 'Рим', country: 'Италия', region: 'Европа' },
  { name: 'Мадрид', country: 'Испания', region: 'Европа' },
  { name: 'Амстердам', country: 'Нидерланды', region: 'Европа' },
  { name: 'Прага', country: 'Чехия', region: 'Европа' },
  { name: 'Вена', country: 'Австрия', region: 'Европа' },
  { name: 'Варшава', country: 'Польша', region: 'Европа' },
  { name: 'Стокгольм', country: 'Швеция', region: 'Европа' },
  { name: 'Осло', country: 'Норвегия', region: 'Европа' },
  { name: 'Хельсинки', country: 'Финляндия', region: 'Европа' },
  { name: 'Афины', country: 'Греция', region: 'Европа' },
  
  // Азия
  { name: 'Токио', country: 'Япония', region: 'Азия' },
  { name: 'Пекин', country: 'Китай', region: 'Азия' },
  { name: 'Сеул', country: 'Южная Корея', region: 'Азия' },
  { name: 'Сингапур', country: 'Сингапур', region: 'Азия' },
  { name: 'Бангкок', country: 'Таиланд', region: 'Азия' },
  { name: 'Дели', country: 'Индия', region: 'Азия' },
  { name: 'Анкара', country: 'Турция', region: 'Азия' },
  { name: 'Дубай', country: 'ОАЭ', region: 'Азия' },
  
  // Северная Америка
  { name: 'Вашингтон', country: 'США', region: 'Северная Америка' },
  { name: 'Оттава', country: 'Канада', region: 'Северная Америка' },
  { name: 'Мехико', country: 'Мексика', region: 'Северная Америка' },
  
  // Южная Америка
  { name: 'Бразилиа', country: 'Бразилия', region: 'Южная Америка' },
  { name: 'Буэнос-Айрес', country: 'Аргентина', region: 'Южная Америка' },
  { name: 'Лима', country: 'Перу', region: 'Южная Америка' },
  { name: 'Сантьяго', country: 'Чили', region: 'Южная Америка' },
  
  // Африка
  { name: 'Каир', country: 'Египет', region: 'Африка' },
  { name: 'Кейптаун', country: 'ЮАР', region: 'Африка' },
  { name: 'Найроби', country: 'Кения', region: 'Африка' },
  { name: 'Абуджа', country: 'Нигерия', region: 'Африка' },
  
  // Океания
  { name: 'Канберра', country: 'Австралия', region: 'Океания' },
  { name: 'Веллингтон', country: 'Новая Зеландия', region: 'Океания' },
];
