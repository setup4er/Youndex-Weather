import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import WeatherCard from '../components/WeatherCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { fetchWeatherByCoords } from '../services/weatherAPI';
import { saveSearchHistory, getFavorites, removeFromFavorites, addToFavorites, isFavorite, getSettings } from '../services/storageService';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { homeStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [currentLocationIsFavorite, setCurrentLocationIsFavorite] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Загрузка настроек при монтировании
  useEffect(() => {
    loadSettings();
    getCurrentLocation();
    loadFavorites();
  }, []);

  // Функция для загрузки настроек
  const loadSettings = async () => {
    try {
      const settings = await getSettings();
      console.log('🔄 Загружены настройки автообновления:', settings.autoRefresh);

      // Убедимся, что значение корректно
      const shouldAutoRefresh = settings.autoRefresh !== undefined ? settings.autoRefresh : true;
      console.log('✅ Установлено автообновление:', shouldAutoRefresh);
      setAutoRefresh(shouldAutoRefresh);
    } catch (error) {
      console.error('❌ Ошибка загрузки настроек:', error);
      setAutoRefresh(true); // Значение по умолчанию
    }
  };

  // Улучшенный useFocusEffect с проверкой времени
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Фокус на главном экране, автообновление:', autoRefresh);
      
      if (autoRefresh) {
        const now = Date.now();
        // Обновляем только если прошло больше 2 минут с последнего обновления
        if (!lastRefresh || (now - lastRefresh) > 2 * 60 * 1000) {
          console.log('🔄 Автообновление запущено');
          refreshAllData();
        } else {
          console.log('⏸️ Автообновление пропущено, данные свежие');
        }
      } else {
        console.log('❌ Автообновление отключено в настройках');
        // Все равно загружаем избранное, но не погоду
        loadFavorites();
      }
    }, [autoRefresh, lastRefresh])
  );

  // Функция для полного обновления данных
  const refreshAllData = useCallback(async () => {
    console.log('🔄 Полное обновление данных');
    setLastRefresh(Date.now());
    await getCurrentLocation();
    await loadFavorites();
  }, []);

  // Загрузка избранных мест
  const loadFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const favoritesData = await getFavorites();
      setFavorites(favoritesData);
      
      // Проверяем, добавлен ли текущий город в избранное
      if (weatherData) {
        const favoriteStatus = await isFavorite(weatherData.location.name);
        setCurrentLocationIsFavorite(favoriteStatus);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки избранного:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Добавление/удаление из избранного
  const handleToggleFavorite = async () => {
    if (!weatherData) return;
    
    try {
      if (currentLocationIsFavorite) {
        await removeFromFavorites(weatherData.location.name);
        setCurrentLocationIsFavorite(false);
        Alert.alert('Успех', 'Город удален из избранного');
      } else {
        await addToFavorites(weatherData);
        setCurrentLocationIsFavorite(true);
        Alert.alert('Успех', 'Город добавлен в избранное');
      }
      await loadFavorites();
    } catch (error) {
      Alert.alert('Ошибка', error.message || 'Не удалось изменить избранное');
    }
  };

  // Навигация на экран выбранной погоды
  const handleFavoritePress = (favorite) => {
    navigation.navigate('SelectedWeather', { 
      location: favorite.location 
    });
  };

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
      console.error('❌ Ошибка разрешения:', error);
      setLocationError('Ошибка запроса разрешения');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setLocationError('');

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      console.log('📍 Получение местоположения...');
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
      });

      console.log('✅ Координаты получены:', location.coords);
      await fetchWeather(location.coords);
      
    } catch (error) {
      console.error('❌ Ошибка местоположения:', error);
      handleLocationError(error);
    }
  };

  const fetchWeather = async (coords) => {
    try {
      const data = await fetchWeatherByCoords(coords.latitude, coords.longitude);
      setWeatherData(data);
      
      const favoriteStatus = await isFavorite(data.location.name);
      setCurrentLocationIsFavorite(favoriteStatus);
      
      await saveSearchHistory({
        location: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        timestamp: new Date().toISOString(),
        type: 'gps'
      });
      
    } catch (error) {
      console.error('❌ Ошибка получения погоды:', error);
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
    console.log('🔄 Ручное обновление');
    setRefreshing(true);
    setLastRefresh(Date.now());
    getCurrentLocation();
    loadFavorites();
  };

  const openSettings = async () => {
    try {
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
        {weatherData && (
          <WeatherCard 
            weatherData={weatherData} 
            isFavorite={currentLocationIsFavorite}
            onFavoritePress={handleToggleFavorite}
            showFavoriteButton={true}
          />
        )}

        {/* Избранное */}
        <>
          <Text style={homeStyles.title}>Избранное</Text>
          
          {favoritesLoading ? (
            <View style={homeStyles.favoritesLoading}>
              <Text style={{ color: isDarkTheme ? '#b0b0b0' : '#7f8c8d' }}>Загрузка избранного...</Text>
            </View>
          ) : favorites.length > 0 ? (
            <View style={homeStyles.favoritesSection}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={homeStyles.favoritesScrollView}
              >
                {favorites.map((favorite) => (
                  <TouchableOpacity 
                    key={favorite.id}
                    style={homeStyles.favoriteItem}
                    onPress={() => handleFavoritePress(favorite)}
                  >
                    <Text style={homeStyles.favoriteCity}>{favorite.location}</Text>
                    <Text style={homeStyles.favoriteTemp}>{favorite.temperature}°C</Text>
                    <Text style={homeStyles.favoriteCondition}>{favorite.condition}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={homeStyles.noFavorites}>
              <Ionicons name="star-outline" size={48} color={isDarkTheme ? '#666666' : '#bdc3c7'} />
              <Text style={homeStyles.noFavoritesText}>Отсутствуют избранные места</Text>
              <Text style={homeStyles.noFavoritesSubtext}>
                Добавьте города в избранное через кнопку звезды на карточке погоды
              </Text>
            </View>
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
              <Ionicons name="star" size={20} color="#3498db" />
              <Text style={homeStyles.infoText}>Нажмите на звезду чтобы добавить в избранное</Text>
            </View>
            <View style={homeStyles.infoItem}>
              <Ionicons name="refresh" size={20} color="#3498db" />
              <Text style={homeStyles.infoText}>
                {autoRefresh 
                  ? 'Автообновление включено - данные обновляются при переходе на вкладку' 
                  : 'Автообновление выключено - используйте pull-to-refresh для обновления'
                }
              </Text>
            </View>
            {lastRefresh && (
              <View style={homeStyles.infoItem}>
                <Ionicons name="time" size={20} color="#3498db" />
                <Text style={homeStyles.infoText}>
                  Последнее обновление: {new Date(lastRefresh).toLocaleTimeString()}
                </Text>
              </View>
            )}
          </View>
        </>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;