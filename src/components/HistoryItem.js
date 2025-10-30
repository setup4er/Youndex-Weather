import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { historyItemStyles } from '../styles/commonStyles';
import { getWeatherIcon, formatDate } from '../utils/helpers';

const HistoryItem = ({ item, onPress, onDelete }) => {
  const getTypeIcon = (type) => {
    return type === 'gps' ? 'location' : 'search';
  };

  const getTypeColor = (type) => {
    return type === 'gps' ? '#27ae60' : '#3498db';
  };

  return (
    <TouchableOpacity 
      style={historyItemStyles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={historyItemStyles.content}>
        {/* Левая часть - иконка типа и местоположение */}
        <View style={historyItemStyles.mainInfo}>
          <View style={[
            historyItemStyles.typeIcon,
            { backgroundColor: `${getTypeColor(item.type)}20` }
          ]}>
            <Ionicons 
              name={getTypeIcon(item.type)} 
              size={16} 
              color={getTypeColor(item.type)} 
            />
          </View>
          <View style={historyItemStyles.locationInfo}>
            <Text style={historyItemStyles.location}>
              {item.location}
            </Text>
            <Text style={historyItemStyles.country}>
              {item.country}
            </Text>
          </View>
        </View>

        {/* Правая часть - температура и время */}
        <View style={historyItemStyles.weatherInfo}>
          <View style={historyItemStyles.temperatureContainer}>
            <Text style={historyItemStyles.weatherIcon}>
              {getWeatherIcon(item.condition)}
            </Text>
            <Text style={historyItemStyles.temperature}>
              {item.temperature}°C
            </Text>
          </View>
          <Text style={historyItemStyles.time}>
            {formatDate(item.timestamp)}
          </Text>
        </View>
      </View>

      {/* Условия погоды */}
      <Text style={historyItemStyles.condition}>
        {item.condition}
      </Text>

      {/* Кнопка удаления */}
      {onDelete && (
        <TouchableOpacity 
          style={historyItemStyles.deleteButton}
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={16} color="#e74c3c" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default HistoryItem;