import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';
import { getWeatherIcon, formatDate } from '../utils/helpers';

const HistoryItem = ({ item, onPress, onDelete }) => {
  const { historyItemStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);

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

      <Text style={historyItemStyles.condition}>
        {item.condition}
      </Text>

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