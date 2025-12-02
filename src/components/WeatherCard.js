import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';
import { 
  getWeatherIcon, 
  formatTime, 
  formatTemperature, 
  formatWindSpeed,
  formatWindDirection,
  getWindDirectionSymbol
} from '../utils/helpers';
import { useSettings } from '../context/ThemeContext';

const WeatherCard = ({ weatherData, isFavorite = false, onFavoritePress, showFavoriteButton = true }) => {
  const { weatherStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);
  const { settings } = useSettings();

  if (!weatherData) return null;

  const { location, current, forecast } = weatherData;

  // Получаем данные о восходе и закате из forecast
  const sunrise = forecast?.forecastday?.[0]?.astro?.sunrise;
  const sunset = forecast?.forecastday?.[0]?.astro?.sunset;

  // Нормальное давление на уровне моря (гПа)
  const NORMAL_PRESSURE = 1013.25;
  
  // Рассчитываем отклонение давления от нормы
  const pressureDiff = current?.pressure_mb ? current.pressure_mb - NORMAL_PRESSURE : 0;
  const pressureIcon = pressureDiff >= 0 ? '⬆️' : '⬇️';
  const pressureStatus = pressureDiff > 10 ? 'Высокое' : 
                        pressureDiff < -10 ? 'Низкое' : 'Нормальное';
  const pressureColor = pressureDiff > 10 ? '#4CAF50' : // Зеленый для высокого
                       pressureDiff < -10 ? '#FF5722' : // Красный для низкого
                       '#2196F3'; // Синий для нормального

  // Получаем вероятность осадков из прогноза
  const precipitationChance = Math.max(
    forecast?.forecastday?.[0]?.day?.daily_chance_of_rain || 0,
    forecast?.forecastday?.[0]?.day?.daily_chance_of_snow || 0
  );

  // Определяем тип осадков по текущим условиям
  const getPrecipitationType = () => {
    const condition = current?.condition?.text?.toLowerCase() || '';
    if (condition.includes('rain') || condition.includes('дожд')) return 'Дождь';
    if (condition.includes('snow') || condition.includes('снег')) return 'Снег';
    if (condition.includes('sleet') || condition.includes('мокрый снег')) return 'Мокрый снег';
    if (condition.includes('drizzle') || condition.includes('морось')) return 'Морось';
    return '';
  };

  const precipitationType = getPrecipitationType();
  const hasPrecipitation = current?.precip_mm > 0;

  // Определяем иконку осадков
  const getPrecipitationIcon = () => {
    if (!hasPrecipitation && precipitationChance === 0) return '☀️';
    if (precipitationType === 'Дождь') return '🌧️';
    if (precipitationType === 'Снег') return '❄️';
    if (precipitationType === 'Мокрый снег') return '🌨️';
    if (precipitationType === 'Морось') return '🌦️';
    return '☔';
  };

  // Форматируем направление ветра
  const windDirection = formatWindDirection(current.wind_dir);
  const windDirectionSymbol = getWindDirectionSymbol(current.wind_dir);

  const weatherDetails = [
    { 
      icon: '💨', 
      label: 'Влажность', 
      value: `${current.humidity}%` 
    },
    { 
      icon: '🌬️', 
      label: 'Ветер', 
      value: formatWindSpeed(current.wind_kph, settings),
      additional: `${windDirectionSymbol} ${windDirection}`,
      subValue: current.wind_dir ? `Направление: ${windDirection}` : ''
    },
    { 
      icon: '👁️', 
      label: 'Видимость', 
      value: `${current.vis_km} км`
    },
    { 
      icon: '🌡️', 
      label: 'Ощущается', 
      value: formatTemperature(current.feelslike_c, settings)
    },
    { 
      icon: '📊', 
      label: 'Давление', 
      value: `${current.pressure_mb} hPa`,
      additional: `${pressureIcon} ${Math.abs(pressureDiff).toFixed(1)} hPa (${pressureStatus})`,
      color: pressureColor
    },
    { 
      icon: getPrecipitationIcon(), 
      label: 'Осадки', 
      value: hasPrecipitation ? `${current.precip_mm} мм` : 'Нет',
      additional: precipitationType || '',
      chance: precipitationChance > 0 ? `Вероятность: ${precipitationChance}%` : ''
    },
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
            <Text style={[
              weatherStyles.detailValue,
              detail.color ? { color: detail.color } : {}
            ]}>
              {detail.value}
            </Text>
            {detail.additional && (
              <Text style={[
                weatherStyles.detailAdditional,
                detail.color ? { color: detail.color } : {}
              ]}>
                {detail.additional}
              </Text>
            )}
            {detail.chance && (
              <Text style={weatherStyles.detailChance}>
                {detail.chance}
              </Text>
            )}
            {detail.subValue && (
              <Text style={weatherStyles.detailChance}>
                {detail.subValue}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Блок с восходом и закатом - показываем только если данные доступны */}
      {(sunrise || sunset) && (
        <View style={weatherStyles.additionalInfo}>
          {sunrise && (
            <Text style={weatherStyles.additionalText}>
              Восход: {formatTime(sunrise)}
            </Text>
          )}
          {sunset && (
            <Text style={weatherStyles.additionalText}>
              Закат: {formatTime(sunset)}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default WeatherCard;