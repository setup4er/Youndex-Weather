import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import WeatherCard from '../components/WeatherCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { fetchWeatherData } from '../services/weatherAPI';
import { saveSearchHistory, removeFromFavorites, addToFavorites, isFavorite } from '../services/storageService';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';

const SelectedWeatherScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { location } = route.params;
  const { selectedWeatherStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavoriteCity, setIsFavoriteCity] = useState(false);

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const data = await fetchWeatherData(location);
      setWeatherData(data);
      
      const favoriteStatus = await isFavorite(data.location.name);
      setIsFavoriteCity(favoriteStatus);
      
      await saveSearchHistory({
        location: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        timestamp: new Date().toISOString(),
        type: 'selected'
      });
      
    } catch (error) {
      console.error('Weather fetch error:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные о погоде');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!weatherData) return;
    
    try {
      if (isFavoriteCity) {
        await removeFromFavorites(weatherData.location.name);
        setIsFavoriteCity(false);
        Alert.alert('Успех', 'Город удален из избранного');
      } else {
        await addToFavorites(weatherData);
        setIsFavoriteCity(true);
        Alert.alert('Успех', 'Город добавлен в избранное');
      }
    } catch (error) {
      Alert.alert('Ошибка', error.message || 'Не удалось изменить избранное');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWeatherData();
  };

  if (loading) {
    return <LoadingIndicator message="Загружаем данные о погоде..." />;
  }

  return (
    <ScrollView
      style={selectedWeatherStyles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3498db']}
          tintColor="#3498db"
        />
      }
    >
      <View style={selectedWeatherStyles.content}>
        {weatherData && (
          <WeatherCard 
            weatherData={weatherData} 
            isFavorite={isFavoriteCity}
            onFavoritePress={handleToggleFavorite}
            showFavoriteButton={true}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default SelectedWeatherScreen;