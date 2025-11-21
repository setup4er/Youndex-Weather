import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import HistoryItem from '../components/HistoryItem';
import FilterModal from '../components/FilterModal';
import LoadingIndicator from '../components/LoadingIndicator';
import { 
  getSearchHistory, 
  clearSearchHistory,
  deleteHistoryItem,
  exportHistory 
} from '../services/storageService';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const { historyScreenStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'date',
    order: 'desc',
    type: 'all'
  });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [history, filters]);

  const loadHistory = async () => {
    try {
      const historyData = await getSearchHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить историю');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...history];

    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    filtered.sort((a, b) => {
      if (filters.sortBy === 'date') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (filters.sortBy === 'temperature') {
        return filters.order === 'desc' ? 
          b.temperature - a.temperature : 
          a.temperature - b.temperature;
      } else if (filters.sortBy === 'location') {
        return filters.order === 'desc' ?
          b.location.localeCompare(a.location) :
          a.location.localeCompare(b.location);
      }
      return 0;
    });

    if (filters.sortBy === 'date' && filters.order === 'asc') {
      filtered.reverse();
    }

    setFilteredHistory(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistory();
  }, []);

  const handleHistoryPress = (item) => {
    navigation.navigate('SelectedWeather', { 
      location: item.location
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Очистка истории',
      'Вы уверены, что хотите очистить всю историю поиска?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Очистить', 
          style: 'destructive',
          onPress: async () => {
            await clearSearchHistory();
            setHistory([]);
            setFilteredHistory([]);
          }
        },
      ]
    );
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteHistoryItem(id);
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить запись');
    }
  };

  const handleExportHistory = async () => {
    try {
      const historyData = await exportHistory();
      console.log('Export history:', historyData);
      Alert.alert('Успех', 'История экспортирована в консоль');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось экспортировать историю');
    }
  };

  if (loading) {
    return <LoadingIndicator message="Загрузка истории..." />;
  }

  return (
    <View style={historyScreenStyles.container}>
      {/* Заголовок с кнопками */}
      <View style={historyScreenStyles.header}>
        <Text style={historyScreenStyles.title}>История поиска</Text>
        <View style={historyScreenStyles.headerButtons}>
          <TouchableOpacity 
            style={historyScreenStyles.iconButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={24} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={historyScreenStyles.iconButton}
            onPress={handleExportHistory}
          >
            <Ionicons name="download" size={24} color="#3498db" />
          </TouchableOpacity>
          {history.length > 0 && (
            <TouchableOpacity 
              style={historyScreenStyles.iconButton}
              onPress={handleClearHistory}
            >
              <Ionicons name="trash" size={24} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Статистика */}
      <View style={historyScreenStyles.stats}>
        <Text style={historyScreenStyles.statsText}>
          Всего записей: {history.length}
        </Text>
        <Text style={historyScreenStyles.statsText}>
          Показано: {filteredHistory.length}
        </Text>
      </View>

      {/* Список истории */}
      <ScrollView
        style={historyScreenStyles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <HistoryItem 
              key={item.id} 
              item={item} 
              onDelete={() => handleDeleteItem(item.id)}
              onPress={() => handleHistoryPress(item)}
            />
          ))
        ) : (
          <View style={historyScreenStyles.emptyState}>
            <Ionicons name="time-outline" size={64} color={isDarkTheme ? '#666666' : '#bdc3c7'} />
            <Text style={historyScreenStyles.emptyStateText}>
              История поиска пуста
            </Text>
            <Text style={historyScreenStyles.emptyStateSubtext}>
              Начните поиск погоды, чтобы увидеть здесь историю
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Модальное окно фильтров */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </View>
  );
};

export default HistoryScreen;