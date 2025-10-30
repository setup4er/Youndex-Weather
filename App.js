import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/services/storageService';

const LoadingScreen = ({ message }) => (
  <View style={styles.loadingContainer}>
    <Text style={styles.appTitle}>my_kursach</Text>
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Запуск приложения my_kursach...');
        await initDatabase();
        setAppReady(true);
        console.log('Приложение готово к работе');
      } catch (error) {
        console.log('Ошибка при инициализации:', error);
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!appReady) {
    return (
      <LoadingScreen message="Инициализация хранилища..." />
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
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