import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSettings, saveSettings } from '../services/storageService';

// Создаем контекст для настроек
const SettingsContext = createContext();

export const SettingsProvider = ({ children, initialTheme = false }) => {
  const [settings, setSettings] = useState({
    celsius: true,
    kmh: true,
    autoRefresh: true,
    darkMode: initialTheme,
  });

  // Загрузка настроек при запуске
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getSettings();
      console.log('🔄 Настройки загружены в контекст:', savedSettings);
      
      setSettings(prev => ({
        ...prev,
        ...savedSettings,
        celsius: savedSettings.celsius !== undefined ? savedSettings.celsius : true,
        kmh: savedSettings.kmh !== undefined ? savedSettings.kmh : true,
        autoRefresh: savedSettings.autoRefresh !== undefined ? savedSettings.autoRefresh : true,
        darkMode: savedSettings.darkMode !== undefined ? savedSettings.darkMode : initialTheme,
      }));
    } catch (error) {
      console.error('❌ Ошибка загрузки настроек в контекст:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      console.log('🔄 Обновление настроек в контексте:', newSettings);
      
      // Обновляем состояние синхронно
      setSettings(prev => {
        const updatedSettings = { ...prev, ...newSettings };
        
        // Сохраняем в хранилище асинхронно (без await чтобы не блокировать UI)
        saveSettings(updatedSettings).catch(error => {
          console.error('❌ Ошибка сохранения настроек:', error);
        });
        
        return updatedSettings;
      });
      
    } catch (error) {
      console.error('❌ Ошибка обновления настроек в контексте:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Хук для использования настроек
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Старый ThemeContext для обратной совместимости
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { settings, updateSettings } = useSettings();
  const isDarkTheme = settings.darkMode;

  const toggleTheme = (darkMode) => {
    console.log('🎨 Переключение темы на:', darkMode);
    updateSettings({ darkMode });
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;