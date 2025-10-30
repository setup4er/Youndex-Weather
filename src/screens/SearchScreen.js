import React, { useState } from 'react';
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
import WeatherCard from '../components/WeatherCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { fetchWeatherData } from '../services/weatherAPI';
import { saveSearchHistory } from '../services/storageService';
import { searchScreenStyles } from '../styles/commonStyles';

// Популярные города для быстрого доступа
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
      
      // Сохраняем в историю
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

  const handleCityPress = (cityName) => {
    setSearchQuery(cityName);
    handleSearch(cityName);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setWeatherData(null);
    setSearchPerformed(false);
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
              <Text style={searchScreenStyles.resultTitle}>
                Погода в {weatherData.location.name}
              </Text>
              <WeatherCard weatherData={weatherData} />
            </View>
          )}

          {searchPerformed && !weatherData && !loading && (
            <View style={searchScreenStyles.noResults}>
              <Ionicons name="search-outline" size={48} color="#bdc3c7" />
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