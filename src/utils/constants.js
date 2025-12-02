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