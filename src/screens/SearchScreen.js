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

import { WORLD_CAPITALS } from '../utils/constants';


const getRandomCapitals = (count = 8) => {
  const capitalsCopy = [...WORLD_CAPITALS];
  const randomCapitals = [];
  
  const actualCount = Math.min(count, capitalsCopy.length);
  
  for (let i = 0; i < actualCount; i++) {
    const randomIndex = Math.floor(Math.random() * capitalsCopy.length);
    randomCapitals.push(capitalsCopy[randomIndex]);
    capitalsCopy.splice(randomIndex, 1);
  }
  
  return randomCapitals;
};

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
  const [randomCapitals, setRandomCapitals] = useState([]);

  const { searchScreenStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);

  // Загрузка настроек при монтировании
  useEffect(() => {
    loadSettings();
    generateRandomCapitals();
  }, []);

  // Генерация случайных столиц при каждом открытии экрана
  const generateRandomCapitals = () => {
    const newCapitals = getRandomCapitals(8);
    setRandomCapitals(newCapitals);
  };

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

  const handleRefreshCapitals = () => {
    generateRandomCapitals();
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <Text style={searchScreenStyles.suggestionsTitle}>
                  Случайные столицы мира
                </Text>
                <TouchableOpacity
                  onPress={handleRefreshCapitals}
                  style={{
                    padding: 8,
                    backgroundColor: isDarkTheme ? '#333' : '#f0f0f0',
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Ionicons name="refresh" size={16} color="#3498db" />
                  <Text style={{ color: '#3498db', fontSize: 12, marginLeft: 4 }}>
                    Обновить
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={searchScreenStyles.citiesGrid}>
                {randomCapitals.map((city, index) => (
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
            <View style={searchScreenStyles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
              <Text style={searchScreenStyles.tip}>
                Нажмите "Обновить" для получения новых столиц
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;