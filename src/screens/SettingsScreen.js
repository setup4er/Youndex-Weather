import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { settingsStyles } from '../styles/commonStyles';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoRefresh: false,
    darkMode: false,
    celsius: true,
    kmh: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Очистка кэша',
      'Это действие очистит все временные данные приложения.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Очистить', 
          style: 'destructive',
          onPress: () => Alert.alert('Успех', 'Кэш очищен')
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Сброс настроек',
      'Все настройки будут возвращены к значениям по умолчанию.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Сбросить', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: true,
              autoRefresh: false,
              darkMode: false,
              celsius: true,
              kmh: true,
            });
            Alert.alert('Успех', 'Настройки сброшены');
          }
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, description, value, onToggle, type = 'switch' }) => (
    <View style={settingsStyles.settingItem}>
      <View style={settingsStyles.settingInfo}>
        <View style={settingsStyles.settingHeader}>
          <Ionicons name={icon} size={24} color="#3498db" />
          <Text style={settingsStyles.settingTitle}>{title}</Text>
        </View>
        {description && (
          <Text style={settingsStyles.settingDescription}>{description}</Text>
        )}
      </View>
      
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#3498db' : '#f4f3f4'}
        />
      ) : (
        <TouchableOpacity onPress={onToggle}>
          <Ionicons name="chevron-forward" size={24} color="#bdc3c7" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={settingsStyles.container}>
      <Text style={settingsStyles.title}>Настройки</Text>

      {/* Уведомления */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Уведомления</Text>
        <SettingItem
          icon="notifications"
          title="Пуш-уведомления"
          description="Получать уведомления о изменении погоды"
          value={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
        />
      </View>

      {/* Настройки погоды */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Единицы измерения</Text>
        <SettingItem
          icon="thermometer"
          title="Температура в °C"
          description="Отображать температуру в Цельсиях"
          value={settings.celsius}
          onToggle={() => toggleSetting('celsius')}
        />
        <SettingItem
          icon="speedometer"
          title="Скорость ветра в км/ч"
          description="Отображать скорость ветра в километрах в час"
          value={settings.kmh}
          onToggle={() => toggleSetting('kmh')}
        />
      </View>

      {/* Внешний вид */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Внешний вид</Text>
        <SettingItem
          icon="moon"
          title="Темная тема"
          description="Использовать темную цветовую схему"
          value={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
        />
        <SettingItem
          icon="refresh"
          title="Авто-обновление"
          description="Автоматически обновлять погоду при открытии"
          value={settings.autoRefresh}
          onToggle={() => toggleSetting('autoRefresh')}
        />
      </View>

      {/* Действия */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Действия</Text>
        
        <TouchableOpacity 
          style={settingsStyles.actionButton}
          onPress={handleClearCache}
        >
          <Ionicons name="trash" size={20} color="#e74c3c" />
          <Text style={[settingsStyles.actionText, { color: '#e74c3c' }]}>
            Очистить кэш
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={settingsStyles.actionButton}
          onPress={handleResetSettings}
        >
          <Ionicons name="refresh" size={20} color="#3498db" />
          <Text style={[settingsStyles.actionText, { color: '#3498db' }]}>
            Сбросить настройки
          </Text>
        </TouchableOpacity>
      </View>

      {/* Информация о приложении */}
      <View style={settingsStyles.infoSection}>
        <Text style={settingsStyles.infoTitle}>Информация</Text>
        <View style={settingsStyles.infoItem}>
          <Text style={settingsStyles.infoLabel}>Версия приложения:</Text>
          <Text style={settingsStyles.infoValue}>1.0.0</Text>
        </View>
        <View style={settingsStyles.infoItem}>
          <Text style={settingsStyles.infoLabel}>Последнее обновление:</Text>
          <Text style={settingsStyles.infoValue}>Октябрь 2024</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;