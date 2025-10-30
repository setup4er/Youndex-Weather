import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import WeatherCard from '../components/WeatherCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { fetchWeatherByCoords } from '../services/weatherAPI';
import { saveSearchHistory } from '../services/storageService';
import { homeStyles } from '../styles/commonStyles';

const HomeScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setLocationPermission(true);
        setLocationError('');
        return true;
      } else {
        setLocationPermission(false);
        setLocationError('Разрешение на доступ к местоположению не предоставлено');
        return false;
      }
    } catch (error) {
      console.error('Permission error:', error);
      setLocationError('Ошибка запроса разрешения');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setLocationError('');

      // Запрашиваем разрешение
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      console.log('🔄 Получение местоположения...');
      
      // Получаем местоположение с высокой точностью
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000, // 15 секунд таймаут
      });

      console.log('📍 Координаты получены:', location.coords);
      await fetchWeather(location.coords);
      
    } catch (error) {
      console.error('Location error:', error);
      handleLocationError(error);
    }
  };

  const fetchWeather = async (coords) => {
    try {
      const data = await fetchWeatherByCoords(coords.latitude, coords.longitude);
      setWeatherData(data);
      
      // Сохраняем в историю
      await saveSearchHistory({
        location: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        timestamp: new Date().toISOString(),
        type: 'gps'
      });
      
    } catch (error) {
      console.error('Weather fetch error:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось получить данные о погоде');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLocationError = (error) => {
    let errorMessage = 'Не удалось определить ваше местоположение';
    
    if (error.code === 'ERR_CANCELED') {
      errorMessage = 'Запрос местоположения отменен';
    } else if (error.code === 'ERR_TIMEOUT') {
      errorMessage = 'Превышено время ожидания определения местоположения';
    } else if (error.code === 'ERR_NOT_AVAILABLE') {
      errorMessage = 'Службы геолокации недоступны';
    }
    
    setLocationError(errorMessage);
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    getCurrentLocation();
  };

  const openSettings = async () => {
    try {
      // На Android можно открыть настройки
      await Location.enableNetworkProviderAsync();
    } catch (error) {
      Alert.alert(
        'Настройки местоположения',
        'Пожалуйста, включите GPS и разрешите доступ к местоположению в настройках устройства',
        [{ text: 'OK' }]
      );
    }
  };

  if (loading) {
    return <LoadingIndicator message="Определяем ваше местоположение..." />;
  }

  return (
    <ScrollView
      style={homeStyles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3498db']}
          tintColor="#3498db"
        />
      }
    >
      <View style={homeStyles.content}>
        <Text style={homeStyles.title}>Текущая погода</Text>
        
        {/* Сообщения об ошибках */}
        {locationError ? (
          <View style={homeStyles.errorCard}>
            <Ionicons name="location-outline" size={40} color="#e74c3c" />
            <Text style={homeStyles.errorTitle}>Проблема с местоположением</Text>
            <Text style={homeStyles.errorText}>{locationError}</Text>
            <TouchableOpacity 
              style={homeStyles.retryButton}
              onPress={getCurrentLocation}
            >
              <Text style={homeStyles.retryButtonText}>Попробовать снова</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={homeStyles.settingsButton}
              onPress={openSettings}
            >
              <Text style={homeStyles.settingsButtonText}>Проверить настройки</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!locationPermission && !locationError && (
          <View style={homeStyles.permissionCard}>
            <Ionicons name="location-outline" size={40} color="#f39c12" />
            <Text style={homeStyles.permissionTitle}>Нужен доступ к местоположению</Text>
            <Text style={homeStyles.permissionText}>
              Для показа погоды разрешите доступ к вашему местоположению
            </Text>
            <TouchableOpacity 
              style={homeStyles.permissionButton}
              onPress={requestLocationPermission}
            >
              <Text style={homeStyles.permissionButtonText}>Разрешить</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Погода */}
        {weatherData && !locationError && (
          <WeatherCard weatherData={weatherData} />
        )}

        {/* Информация */}
        <View style={homeStyles.infoSection}>
          <Text style={homeStyles.infoTitle}>Как это работает?</Text>
          <View style={homeStyles.infoItem}>
            <Ionicons name="location" size={20} color="#3498db" />
            <Text style={homeStyles.infoText}>Определяем ваше местоположение по GPS</Text>
          </View>
          <View style={homeStyles.infoItem}>
            <Ionicons name="cloud" size={20} color="#3498db" />
            <Text style={homeStyles.infoText}>Получаем актуальные данные о погоде</Text>
          </View>
          <View style={homeStyles.infoItem}>
            <Ionicons name="refresh" size={20} color="#3498db" />
            <Text style={homeStyles.infoText}>Потяните вниз для обновления</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;