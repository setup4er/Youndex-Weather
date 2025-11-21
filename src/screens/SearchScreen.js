import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SearchBar from '../components/SearchBar';
import { getSettings } from '../services/storageService';
import WeatherCard from '../components/WeatherCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { fetchWeatherData } from '../services/weatherAPI';
import { saveSearchHistory, addToFavorites, isFavorite, removeFromFavorites } from '../services/storageService';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';

const POPULAR_CITIES = [
  { name: 'Москва', country: 'Россия' },
  { name: 'Санкт-Петербург', country: 'Россия' },
  { name: 'Новосибирск', country: 'Россия' },
  { name: 'Екатеринбург', country: 'Россия' },
  { name: 'Казань', country: 'Россия' },
  { name: 'Киев', country: 'Украина' },
  { name: 'Минск', country: 'Беларусь' },
  { name: 'Алматы', country: 'Казахстан' },
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isFavoriteCity, setIsFavoriteCity] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [settings, setSettings] = useState({
    celsius: true,
    kmh: true
  });

  const { searchScreenStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);

  // Загрузка настроек при монтировании
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getSettings();
      setSettings({
        celsius: savedSettings.celsius !== undefined ? savedSettings.celsius : true,
        kmh: savedSettings.kmh !== undefined ? savedSettings.kmh : true
      });
    } catch (error) {
      console.error('Error loading settings in SearchScreen:', error);
    }
  };

  const handleSearch = async (query = searchQuery) => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      Alert.alert('Ошибка', 'Пожалуйста, введите название города или страны');
      return;
    }

    if (trimmedQuery.length < 2) {
      Alert.alert('Ошибка', 'Введите хотя бы 2 символа для поиска');
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const data = await fetchWeatherData(trimmedQuery);
      setWeatherData(data);
      
      const favoriteStatus = await isFavorite(data.location.name);
      setIsFavoriteCity(favoriteStatus);
      
      await saveSearchHistory({
        location: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        timestamp: new Date().toISOString(),
        type: 'search'
      });
      
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Ошибка поиска', error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritePress = async () => {
    if (favoriteLoading || !weatherData) return;
    
    setFavoriteLoading(true);
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
      Alert.alert('Ошибка', error.message);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCityPress = (cityName) => {
    setSearchQuery(cityName);
    handleSearch(cityName);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setWeatherData(null);
    setSearchPerformed(false);
    setIsFavoriteCity(false);
  };

  return (
    <KeyboardAvoidingView
      style={searchScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={searchScreenStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={searchScreenStyles.content}>
          <Text style={searchScreenStyles.title}>Поиск погоды</Text>
          
          <SearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={clearSearch}
            loading={loading}
            placeholder="Введите город или страну..."
          />

          {loading && (
            <LoadingIndicator message="Ищем погоду..." />
          )}

          {weatherData && !loading && (
            <View style={searchScreenStyles.resultSection}>
              <View style={searchScreenStyles.resultHeader}>
                <Text style={searchScreenStyles.resultTitle}>
                  Погода в {weatherData.location.name}
                </Text>
                <TouchableOpacity 
                  style={[
                    searchScreenStyles.favoriteButton,
                    isFavoriteCity && searchScreenStyles.favoriteButtonActive
                  ]}
                  onPress={handleFavoritePress}
                  disabled={favoriteLoading}
                >
                  <Ionicons 
                    name={isFavoriteCity ? "star" : "star-outline"} 
                    size={24} 
                    color={isFavoriteCity ? "#FFD700" : (isDarkTheme ? "#b0b0b0" : "#7f8c8d")} 
                  />
                </TouchableOpacity>
              </View>
              <WeatherCard 
                weatherData={weatherData} 
                showFavoriteButton={false}
              />
            </View>
          )}

          {searchPerformed && !weatherData && !loading && (
            <View style={searchScreenStyles.noResults}>
              <Ionicons name="search-outline" size={48} color={isDarkTheme ? "#666666" : "#bdc3c7"} />
              <Text style={searchScreenStyles.noResultsText}>
                Ничего не найдено
              </Text>
              <Text style={searchScreenStyles.noResultsSubtext}>
                Попробуйте другой город или проверьте написание
              </Text>
            </View>
          )}

          {!searchPerformed && (
            <View style={searchScreenStyles.suggestionsSection}>
              <Text style={searchScreenStyles.suggestionsTitle}>
                Популярные города:
              </Text>
              <View style={searchScreenStyles.citiesGrid}>
                {POPULAR_CITIES.map((city, index) => (
                  <TouchableOpacity
                    key={index}
                    style={searchScreenStyles.cityButton}
                    onPress={() => handleCityPress(city.name)}
                  >
                    <Text style={searchScreenStyles.cityName}>{city.name}</Text>
                    <Text style={searchScreenStyles.cityCountry}>{city.country}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={searchScreenStyles.tipsSection}>
            <Text style={searchScreenStyles.tipsTitle}>Советы по поиску:</Text>
            <View style={searchScreenStyles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
              <Text style={searchScreenStyles.tip}>
                Можно вводить города на русском или английском
              </Text>
            </View>
            <View style={searchScreenStyles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
              <Text style={searchScreenStyles.tip}>
                Работают как крупные города, так и маленькие населенные пункты
              </Text>
            </View>
            <View style={searchScreenStyles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
              <Text style={searchScreenStyles.tip}>
                Можно искать по названию страны
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;