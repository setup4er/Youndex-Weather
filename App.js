import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { View, Text, StyleSheet, AppState } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase, getSettings } from './src/services/storageService';
import * as NavigationBar from 'expo-navigation-bar';
import ThemeContext from './src/context/ThemeContext';

const LoadingScreen = ({ message }) => (
  <View style={styles.loadingContainer}>
    <Text style={styles.appTitle}>ТЫндекс Погода</Text>
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

// Кастомные темы для навигации
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    background: '#f8f9fa',
    card: 'white',
    text: '#2c3e50',
    border: '#e0e0e0',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#3498db',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#333333',
  },
};

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  // Загрузка настроек темы
  const loadThemeSettings = async () => {
    try {
      const settings = await getSettings();
      console.log('Загруженные настройки темы:', settings.darkMode);
      setIsDarkTheme(settings.darkMode || false);
    } catch (error) {
      console.error('Ошибка загрузки темы:', error);
    }
  };

  // Настройка навигационной панели
  const setupNavigationBar = async () => {
    try {
      console.log('Настройка навигационной панели...');
      
      // Скрываем навигационную панель
      await NavigationBar.setVisibilityAsync('hidden');
      
      // Устанавливаем прозрачный фон
      await NavigationBar.setBackgroundColorAsync('#00000000');
      
      // Устанавливаем поведение - скрытие с возможностью показа жестом
      await NavigationBar.setBehaviorAsync('overlay-swipe');
      
      console.log('Навигационная панель настроена');
    } catch (error) {
      console.log('Ошибка настройки навигационной панели:', error);
    }
  };

  // Переключение темы
  const toggleTheme = (darkMode) => {
    console.log('Переключение темы на:', darkMode);
    setIsDarkTheme(darkMode);
  };

  // Обработчик изменения состояния приложения
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      console.log('Состояние приложения изменилось:', nextAppState);
      
      if (nextAppState === 'active') {
        // При возврате в активное состояние перестраиваем навигационную панель
        setupNavigationBar();
      }
      
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Запуск приложения ТЫндекс Погода...');
        
        // Первоначальная настройка навигационной панели
        await setupNavigationBar();
        
        await initDatabase();
        await loadThemeSettings();
        setAppReady(true);
        console.log('Приложение готово к работе, тема:', isDarkTheme ? 'темная' : 'светлая');
      } catch (error) {
        console.log('Ошибка при инициализации:', error);
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  // Дополнительный эффект для настройки панели при изменении темы
  useEffect(() => {
    if (appReady) {
      setupNavigationBar();
    }
  }, [isDarkTheme, appReady]);

  if (!appReady) {
    return (
      <LoadingScreen message="Инициализация хранилища..." />
    );
  }

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      <NavigationContainer theme={isDarkTheme ? CustomDarkTheme : CustomLightTheme}>
        <AppNavigator />
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
});