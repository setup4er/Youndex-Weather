import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@my_kursach_search_history';
const SETTINGS_KEY = '@my_kursach_settings';
const FAVORITES_KEY = '@my_kursach_favorites';

// Инициализация хранилища
export const initDatabase = async () => {
  console.log('AsyncStorage инициализирован');
  return Promise.resolve();
};

// Сохранение поиска в историю
export const saveSearchHistory = async (searchData) => {
  try {
    const existingHistory = await getSearchHistory();
    
    const newItem = {
      id: Date.now().toString(),
      location: searchData.location || 'Unknown',
      country: searchData.country || 'Unknown',
      temperature: searchData.temperature || 0,
      condition: searchData.condition || 'Unknown',
      type: searchData.type || 'search',
      timestamp: searchData.timestamp || new Date().toISOString()
    };
    
    // Добавляем в начало, убираем дубликаты, ограничиваем 50 записями
    const filteredHistory = existingHistory.filter(
      item => item.location !== newItem.location
    );
    const updatedHistory = [newItem, ...filteredHistory].slice(0, 50);
    
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    console.log('Данные сохранены в историю');
    
    return newItem;
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    throw error;
  }
};

// Получение истории поиска
export const getSearchHistory = async () => {
  try {
    const historyJSON = await AsyncStorage.getItem(HISTORY_KEY);
    return historyJSON ? JSON.parse(historyJSON) : [];
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
    return [];
  }
};

// Очистка истории
export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    console.log('История очищена');
    return Promise.resolve();
  } catch (error) {
    console.error('Ошибка очистки истории:', error);
    throw error;
  }
};

// Удаление отдельной записи
export const deleteHistoryItem = async (id) => {
  try {
    const history = await getSearchHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    console.log('Запись удалена из истории');
    return Promise.resolve();
  } catch (error) {
    console.error('Ошибка удаления записи:', error);
    throw error;
  }
};

// Сохранение настроек
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    console.log('Настройки сохранены');
    return Promise.resolve();
  } catch (error) {
    console.error('Ошибка сохранения настроек:', error);
    throw error;
  }
};

// Загрузка настроек
export const getSettings = async () => {
  try {
    const settingsJSON = await AsyncStorage.getItem(SETTINGS_KEY);
    const defaultSettings = {
      temperatureUnit: 'celsius',
      windSpeedUnit: 'kmh',
      theme: 'light',
      darkMode: false,
      autoRefresh: true,
      celsius: true,
      kmh: true
    };
    return settingsJSON ? { ...defaultSettings, ...JSON.parse(settingsJSON) } : defaultSettings;
  } catch (error) {
    console.error('Ошибка загрузки настроек:', error);
    return defaultSettings;
  }
};

// Всегда возвращаем true для проверки
export const checkDatabase = async () => {
  return Promise.resolve(true);
};

// Экспорт истории (для настроек)
export const exportHistory = async () => {
  try {
    const history = await getSearchHistory();
    return JSON.stringify(history, null, 2);
  } catch (error) {
    throw error;
  }
};

// Добавление в избранное
export const addToFavorites = async (weatherData) => {
  try {
    const existingFavorites = await getFavorites();
    
    const newFavorite = {
      id: Date.now().toString(),
      location: weatherData.location.name,
      country: weatherData.location.country,
      temperature: Math.round(weatherData.current.temp_c),
      condition: weatherData.current.condition.text,
      timestamp: new Date().toISOString(),
      data: weatherData // Сохраняем полные данные для передачи в SelectedWeatherScreen
    };
    
    // Проверяем, нет ли уже этого города в избранном
    const isAlreadyFavorite = existingFavorites.some(
      item => item.location === newFavorite.location
    );
    
    if (isAlreadyFavorite) {
      throw new Error('Этот город уже в избранном');
    }
    
    const updatedFavorites = [newFavorite, ...existingFavorites];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    
    console.log('Город добавлен в избранное');
    return newFavorite;
  } catch (error) {
    console.error('Ошибка добавления в избранное:', error);
    throw error;
  }
};

// Получение избранного
export const getFavorites = async () => {
  try {
    const favoritesJSON = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
  } catch (error) {
    console.error('Ошибка загрузки избранного:', error);
    return [];
  }
};

// Удаление из избранного
export const removeFromFavorites = async (location) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(item => item.location !== location);
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    console.log('Город удален из избранного');
    
    return updatedFavorites;
  } catch (error) {
    console.error('Ошибка удаления из избранного:', error);
    throw error;
  }
};

// Проверка, есть ли город в избранном
export const isFavorite = async (location) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(item => item.location === location);
  } catch (error) {
    console.error('Ошибка проверки избранного:', error);
    return false;
  }
};

// Очистка избранного
export const clearFavorites = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    console.log('✅ Избранное очищено');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Ошибка очистки избранного:', error);
    throw error;
  }
};

// Полная очистка всех данных приложения
export const clearAllAppData = async () => {
  try {
    await AsyncStorage.multiRemove([HISTORY_KEY, FAVORITES_KEY]);
    console.log('✅ Все данные приложения очищены');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Ошибка очистки всех данных:', error);
    throw error;
  }
};