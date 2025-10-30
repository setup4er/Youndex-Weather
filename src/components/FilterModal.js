import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { filterModalStyles } from '../styles/commonStyles';

const FilterModal = ({ visible, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
      sortBy: 'date',
      order: 'desc',
      type: 'all',
      dateRange: 'all'
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const FilterSection = ({ title, children }) => (
    <View style={filterModalStyles.section}>
      <Text style={filterModalStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const FilterOption = ({ label, value, selected, onSelect }) => (
    <TouchableOpacity
      style={[
        filterModalStyles.option,
        selected && filterModalStyles.optionSelected
      ]}
      onPress={onSelect}
    >
      <Text style={[
        filterModalStyles.optionText,
        selected && filterModalStyles.optionTextSelected
      ]}>
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark" size={16} color="#3498db" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={filterModalStyles.container}>
        {/* Заголовок */}
        <View style={filterModalStyles.header}>
          <Text style={filterModalStyles.title}>Фильтры и сортировка</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#7f8c8d" />
          </TouchableOpacity>
        </View>

        <ScrollView style={filterModalStyles.content}>
          {/* Сортировка */}
          <FilterSection title="Сортировать по">
            <View style={filterModalStyles.optionsRow}>
              <FilterOption
                label="Дате"
                value="date"
                selected={localFilters.sortBy === 'date'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, sortBy: 'date' }))}
              />
              <FilterOption
                label="Температуре"
                value="temperature"
                selected={localFilters.sortBy === 'temperature'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, sortBy: 'temperature' }))}
              />
              <FilterOption
                label="Местоположению"
                value="location"
                selected={localFilters.sortBy === 'location'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, sortBy: 'location' }))}
              />
            </View>
          </FilterSection>

          {/* Порядок */}
          <FilterSection title="Порядок">
            <View style={filterModalStyles.optionsRow}>
              <FilterOption
                label="По убыванию"
                value="desc"
                selected={localFilters.order === 'desc'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, order: 'desc' }))}
              />
              <FilterOption
                label="По возрастанию"
                value="asc"
                selected={localFilters.order === 'asc'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, order: 'asc' }))}
              />
            </View>
          </FilterSection>

          {/* Тип поиска */}
          <FilterSection title="Тип поиска">
            <View style={filterModalStyles.optionsRow}>
              <FilterOption
                label="Все"
                value="all"
                selected={localFilters.type === 'all'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, type: 'all' }))}
              />
              <FilterOption
                label="По GPS"
                value="gps"
                selected={localFilters.type === 'gps'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, type: 'gps' }))}
              />
              <FilterOption
                label="По поиску"
                value="search"
                selected={localFilters.type === 'search'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, type: 'search' }))}
              />
            </View>
          </FilterSection>

          {/* Диапазон дат */}
          <FilterSection title="Период">
            <View style={filterModalStyles.optionsColumn}>
              <FilterOption
                label="Все время"
                value="all"
                selected={localFilters.dateRange === 'all'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, dateRange: 'all' }))}
              />
              <FilterOption
                label="Сегодня"
                value="today"
                selected={localFilters.dateRange === 'today'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, dateRange: 'today' }))}
              />
              <FilterOption
                label="Последние 7 дней"
                value="week"
                selected={localFilters.dateRange === 'week'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, dateRange: 'week' }))}
              />
              <FilterOption
                label="Последние 30 дней"
                value="month"
                selected={localFilters.dateRange === 'month'}
                onSelect={() => setLocalFilters(prev => ({ ...prev, dateRange: 'month' }))}
              />
            </View>
          </FilterSection>
        </ScrollView>

        {/* Кнопки действий */}
        <View style={filterModalStyles.footer}>
          <TouchableOpacity 
            style={filterModalStyles.resetButton}
            onPress={handleReset}
          >
            <Text style={filterModalStyles.resetButtonText}>Сбросить</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={filterModalStyles.applyButton}
            onPress={handleApply}
          >
            <Text style={filterModalStyles.applyButtonText}>Применить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;