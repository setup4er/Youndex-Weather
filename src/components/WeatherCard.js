import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';
import { 
  getWeatherIcon, 
  formatTime, 
  formatTemperature, 
  formatWindSpeed,
  formatWindDirection,
  getWindDirectionSymbol,
  getMoonPhaseIcon,
  getMoonPhaseName,
  getHumidityStatus,
  getPressureStatus
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
  const moonPhase = forecast?.forecastday?.[0]?.astro?.moon_phase;
  const moonIllumination = forecast?.forecastday?.[0]?.astro?.moon_illumination;

  // Рассчитываем статус влажности
  const humidityStatus = getHumidityStatus(current?.humidity);
  
  // Рассчитываем статус давления
  const pressureStatus = getPressureStatus(current?.pressure_mb);

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
      value: `${current.humidity}%`,
      additional: `${humidityStatus.icon} ${humidityStatus.status}`,
      additionalColor: humidityStatus.color
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
      additional: `${pressureStatus.icon} ${Math.abs(pressureStatus.diff || 0).toFixed(1)} hPa (${pressureStatus.status})`,
      additionalColor: pressureStatus.color
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
            <Text style={weatherStyles.detailValue}>
              {detail.value}
            </Text>
            {detail.additional && (
              <Text style={[
                weatherStyles.detailAdditional,
                detail.additionalColor ? { color: detail.additionalColor } : {}
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

      {/* Блок с дополнительной информацией */}
      <View style={weatherStyles.additionalInfo}>

        {sunrise && (
          <Text style={weatherStyles.additionalText}>
              <Image
              source={require('../../assets/icon-sunrise.png')}
              style={{ width: 20, height: 20}}
           />
            Восход: {formatTime(sunrise)}
          </Text>
        )}
        {sunset && (
          <Text style={weatherStyles.additionalText}>
              <Image
              source={require('../../assets/icon-sunset.png')}
              style={{ width: 20, height: 20}}
           />
            Закат: {formatTime(sunset)}
          </Text>
        )}
        {moonPhase && (
          <Text style={weatherStyles.moonPhaseText}>
            {getMoonPhaseIcon(moonPhase)} Фаза луны: {getMoonPhaseName(moonPhase)}
            {moonIllumination ? ` (${moonIllumination}%)` : ''}
          </Text>
        )}
      </View>
    </View>
  );
};

export default WeatherCard;