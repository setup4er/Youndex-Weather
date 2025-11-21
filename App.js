import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { View, Text, StyleSheet, AppState } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase, getSettings } from './src/services/storageService';
import * as NavigationBar from 'expo-navigation-bar';
import { ThemeProvider, SettingsProvider } from './src/context/ThemeContext';

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
  const [appState, setAppState] = useState(AppState.currentState);
  const [initialTheme, setInitialTheme] = useState(null);

  // Загрузка начальных настроек темы
  const loadInitialTheme = async () => {
    try {
      const settings = await getSettings();
      console.log('🎨 Загружена начальная тема:', settings.darkMode);
      setInitialTheme(settings.darkMode || false);
    } catch (error) {
      console.error('❌ Ошибка загрузки начальной темы:', error);
      setInitialTheme(false);
    }
  };

  // Настройка навигационной панели
  const setupNavigationBar = async (isDarkTheme) => {
    try {
      console.log('Настройка навигационной панели для темы:', isDarkTheme ? 'темная' : 'светлая');
      
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

  // Обработчик изменения состояния приложения
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      console.log('Состояние приложения изменилось:', nextAppState);
      
      if (nextAppState === 'active') {
        // При возврате в активное состояние перестраиваем навигационную панель
        setupNavigationBar(initialTheme);
      }
      
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [initialTheme]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Запуск приложения ТЫндекс Погода...');
        
        await loadInitialTheme();
        await initDatabase();
        
        // Первоначальная настройка навигационной панели
        await setupNavigationBar(initialTheme);
        
        setAppReady(true);
        console.log('Приложение готово к работе, начальная тема:', initialTheme);
      } catch (error) {
        console.log('Ошибка при инициализации:', error);
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!appReady || initialTheme === null) {
    return (
      <LoadingScreen message="Инициализация приложения..." />
    );
  }

  return (
    <SettingsProvider initialTheme={initialTheme}>
      <ThemeProvider>
        <NavigationContainer theme={initialTheme ? CustomDarkTheme : CustomLightTheme}>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SettingsProvider>
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