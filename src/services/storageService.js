import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@my_kursach_search_history';
const SETTINGS_KEY = '@my_kursach_settings';

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
    console.error('Ошибка очистки:', error);
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
      notifications: true,
      theme: 'light'
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