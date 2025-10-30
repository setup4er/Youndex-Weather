import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { weatherStyles } from '../styles/commonStyles';
import { getWeatherIcon, formatTime } from '../utils/helpers';

const WeatherCard = ({ weatherData, onSave, showSaveButton = true }) => {
  if (!weatherData) return null;

  const { location, current } = weatherData;

  const weatherDetails = [
    { icon: '💨', label: 'Влажность', value: `${current.humidity}%` },
    { icon: '🌬️', label: 'Ветер', value: `${current.wind_kph} км/ч` },
    { icon: '👁️', label: 'Видимость', value: `${current.vis_km} км` },
    { icon: '🌡️', label: 'Ощущается', value: `${Math.round(current.feelslike_c)}°C` },
    { icon: '📊', label: 'Давление', value: `${current.pressure_mb} hPa` },
    { icon: '☂️', label: 'Осадки', value: `${current.precip_mm} mm` },
  ];

  return (
    <View style={weatherStyles.weatherCard}>
      {/* Заголовок с кнопкой сохранения */}
      <View style={weatherStyles.cardHeader}>
        <View>
          <Text style={weatherStyles.location}>
            {location.name}, {location.country}
          </Text>
          <Text style={weatherStyles.time}>
            {formatTime(location.localtime)}
          </Text>
        </View>
        {showSaveButton && onSave && (
          <TouchableOpacity 
            style={weatherStyles.saveButton}
            onPress={onSave}
          >
            <Ionicons name="bookmark-outline" size={20} color="#3498db" />
          </TouchableOpacity>
        )}
      </View>

      {/* Основная информация о погоде */}
      <View style={weatherStyles.weatherMain}>
        <View style={weatherStyles.temperatureContainer}>
          <Text style={weatherStyles.weatherIcon}>
            {getWeatherIcon(current.condition.text)}
          </Text>
          <Text style={weatherStyles.temperature}>
            {Math.round(current.temp_c)}°C
          </Text>
        </View>
        <View style={weatherStyles.conditionContainer}>
          <Text style={weatherStyles.condition}>
            {current.condition.text}
          </Text>
          <Text style={weatherStyles.uvIndex}>
            UV индекс: {current.uv}
          </Text>
        </View>
      </View>

      {/* Детали погоды */}
      <View style={weatherStyles.detailsGrid}>
        {weatherDetails.map((detail, index) => (
          <View key={index} style={weatherStyles.detailItem}>
            <Text style={weatherStyles.detailIcon}>{detail.icon}</Text>
            <Text style={weatherStyles.detailLabel}>{detail.label}</Text>
            <Text style={weatherStyles.detailValue}>{detail.value}</Text>
          </View>
        ))}
      </View>

      {/* Дополнительная информация */}
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