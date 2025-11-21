import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';
import { getWeatherIcon, formatTime, formatTemperature, formatWindSpeed } from '../utils/helpers';
import { useSettings } from '../context/ThemeContext';

const WeatherCard = ({ weatherData, isFavorite = false, onFavoritePress, showFavoriteButton = true }) => {
  const { weatherStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);
  const { settings } = useSettings();

  if (!weatherData) return null;

  const { location, current } = weatherData;

  const weatherDetails = [
    { icon: '💨', label: 'Влажность', value: `${current.humidity}%` },
    { 
      icon: '🌬️', 
      label: 'Ветер', 
      value: formatWindSpeed(current.wind_kph, settings)
    },
    { icon: '👁️', label: 'Видимость', value: `${current.vis_km} км` },
    { 
      icon: '🌡️', 
      label: 'Ощущается', 
      value: formatTemperature(current.feelslike_c, settings)
    },
    { icon: '📊', label: 'Давление', value: `${current.pressure_mb} hPa` },
    { icon: '☂️', label: 'Осадки', value: `${current.precip_mm} mm` },
  ];

  return (
    <View style={weatherStyles.weatherCard}>
      <View style={weatherStyles.cardHeader}>
        <View>
          <Text style={weatherStyles.location}>
            {location.name}, {location.country}
          </Text>
          <Text style={weatherStyles.time}>
            {formatTime(location.localtime)}
          </Text>
        </View>
        {showFavoriteButton && onFavoritePress && (
          <TouchableOpacity 
            style={weatherStyles.favoriteButton}
            onPress={onFavoritePress}
          >
            <Ionicons 
              name={isFavorite ? "star" : "star-outline"} 
              size={24} 
              color={isFavorite ? "#FFD700" : (isDarkTheme ? "#b0b0b0" : "#3498db")} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={weatherStyles.weatherMain}>
        <View style={weatherStyles.temperatureContainer}>
          <Text style={weatherStyles.weatherIcon}>
            {getWeatherIcon(current.condition.text)}
          </Text>
          <Text style={weatherStyles.temperature}>
            {formatTemperature(current.temp_c, settings)}
          </Text>
        </View>
        <View style={weatherStyles.conditionContainer}>
          <Text style={weatherStyles.condition}>
            {current.condition.text}
          </Text>
        </View>
      </View>

      <View style={weatherStyles.detailsGrid}>
        {weatherDetails.map((detail, index) => (
          <View key={index} style={weatherStyles.detailItem}>
            <Text style={weatherStyles.detailIcon}>{detail.icon}</Text>
            <Text style={weatherStyles.detailLabel}>{detail.label}</Text>
            <Text style={weatherStyles.detailValue}>{detail.value}</Text>
          </View>
        ))}
      </View>

      <View style={weatherStyles.additionalInfo}>
        <Text style={weatherStyles.additionalText}>
          Восход: {formatTime(current.sunrise)}
        </Text>
        <Text style={weatherStyles.additionalText}>
          Закат: {formatTime(current.sunset)}
        </Text>
      </View>
    </View>
  );
};

export default WeatherCard;