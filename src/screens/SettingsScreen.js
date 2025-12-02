import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../styles/commonStyles';
import { clearSearchHistory, clearAllAppData } from '../services/storageService';
import { clearCache } from '../services/weatherAPI';
import ThemeContext from '../context/ThemeContext';
import { useSettings } from '../context/ThemeContext';
import { APP_VERSION } from '../utils/constants';
import { getTemperatureToggleText, getWindSpeedToggleText } from '../utils/helpers';

const SettingsScreen = () => {
  const { settingsStyles } = useThemeStyles();
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const { settings, updateSettings } = useSettings();

  // Обработчик переключения настроек
  const handleToggleSetting = (key) => {
    const newValue = !settings[key];
    console.log(`🔄 Переключение настройки ${key} с ${settings[key]} на ${newValue}`);
    
    updateSettings({ [key]: newValue });
  };

  // Обработчик переключения темы
  const handleThemeToggle = () => {
    const newDarkMode = !settings.darkMode;
    console.log('🎨 Переключение темы на:', newDarkMode);
    updateSettings({ darkMode: newDarkMode });
  };

  // Получение текста для температуры
  const getTemperatureTitle = () => {
    return settings.celsius ? 'Температура в °C' : 'Температура в K';
  };

  const getTemperatureDescription = () => {
    return getTemperatureToggleText(settings.celsius);
  };

  // Получение текста для скорости ветра
  const getWindSpeedTitle = () => {
    return settings.kmh ? 'Скорость ветра в км/ч' : 'Скорость ветра в м/с';
  };

  const getWindSpeedDescription = () => {
    return getWindSpeedToggleText(settings.kmh);
  };

  const handleClearCache = async () => {
    try {
      Alert.alert(
        'Очистка кэша',
        'Это действие очистит временные данные приложения и историю поиска.',
        [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Очистить', 
            style: 'destructive',
            onPress: async () => {
              await clearCache();
              await clearSearchHistory();
              Alert.alert('✅ Успех', 'Кэш и история поиска очищены');
            }
          },
        ]
      );
    } catch (error) {
      Alert.alert('❌ Ошибка', 'Не удалось очистить кэш');
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Сброс настроек',
      'Все настройки будут возвращены к значениям по умолчанию. Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Сбросить', 
          style: 'destructive',
          onPress: async () => {
            const defaultSettings = {
              autoRefresh: true,
              darkMode: false,
              celsius: true,
              kmh: true,
            };
            await updateSettings(defaultSettings);
            Alert.alert('✅ Успех', 'Настройки сброшены к значениям по умолчанию');
          }
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Очистка всех данных',
      'ВНИМАНИЕ: Это действие удалит всю историю поиска и избранные города. Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Очистить всё', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllAppData();
              await clearCache();
              Alert.alert('✅ Успех', 'Все данные приложения очищены');
            } catch (error) {
              Alert.alert('❌ Ошибка', 'Не удалось очистить все данные');
            }
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

      {/* Внешний вид */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Внешний вид</Text>
        <SettingItem
          icon={isDarkTheme ? "moon" : "sunny"}
          title="Темная тема"
          description="Использовать темную цветовую схему"
          value={settings.darkMode}
          onToggle={handleThemeToggle}
        />
        <SettingItem
          icon="refresh"
          title="Авто-обновление"
          description="Автоматически обновлять погоду при открытии главного экрана"
          value={settings.autoRefresh}
          onToggle={() => handleToggleSetting('autoRefresh')}
        />
      </View>

      {/* Настройки погоды */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Единицы измерения</Text>
        <SettingItem
          icon="thermometer"
          title={getTemperatureTitle()}
          description={getTemperatureDescription()}
          value={settings.celsius}
          onToggle={() => handleToggleSetting('celsius')}
        />
        <SettingItem
          icon="speedometer"
          title={getWindSpeedTitle()}
          description={getWindSpeedDescription()}
          value={settings.kmh}
          onToggle={() => handleToggleSetting('kmh')}
        />
      </View>

      {/* Управление данными */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Управление данными</Text>
        
        <TouchableOpacity 
          style={settingsStyles.actionButton}
          onPress={handleClearCache}
        >
          <Ionicons name="trash" size={20} color="#e74c3c" />
          <Text style={[settingsStyles.actionText, { color: '#e74c3c' }]}>
            Очистить кэш и историю
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={settingsStyles.actionButton}
          onPress={handleClearAllData}
        >
          <Ionicons name="nuclear" size={20} color="#e74c3c" />
          <Text style={[settingsStyles.actionText, { color: '#e74c3c' }]}>
            Очистить все данные
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
          <Text style={settingsStyles.infoValue}>{APP_VERSION.value}</Text>
        </View>
        <View style={settingsStyles.infoItem}>
          <Text style={settingsStyles.infoLabel}>Последнее обновление:</Text>
          <Text style={settingsStyles.infoValue}>Ноябрь 2025</Text>
        </View>
        <View style={settingsStyles.infoItem}>
          <Text style={settingsStyles.infoLabel}>Статус автообновления:</Text>
          <Text style={settingsStyles.infoValue}>
            {settings.autoRefresh ? 'Включено' : 'Выключено'}
          </Text>
        </View>
        <View style={settingsStyles.infoItem}>
          <Text style={settingsStyles.infoLabel}>Текущая тема:</Text>
          <Text style={settingsStyles.infoValue}>
            {settings.darkMode ? 'Темная' : 'Светлая'}
          </Text>
        </View>
        <View style={settingsStyles.infoItem}>
          <Text style={settingsStyles.infoLabel}>Единицы температуры:</Text>
          <Text style={settingsStyles.infoValue}>
            {settings.celsius ? '°C' : 'K'}
          </Text>
        </View>
        <View style={settingsStyles.infoItem}>
          <Text style={settingsStyles.infoLabel}>Единицы ветра:</Text>
          <Text style={settingsStyles.infoValue}>
            {settings.kmh ? 'км/ч' : 'м/с'}
          </Text>
        </View>
      </View>
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

export default SettingsScreen;