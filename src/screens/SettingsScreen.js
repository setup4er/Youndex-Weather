// В options SettingsScreen в AppNavigator уже установлен заголовок "Настройки"
// Но если нужно изменить заголовок в самом компоненте, можно добавить:
import React, { useState, useEffect, useContext } from 'react';
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
import { getSettings, saveSettings, clearSearchHistory, clearAllAppData } from '../services/storageService';
import { clearCache } from '../services/weatherAPI';
import ThemeContext from '../context/ThemeContext';

const SettingsScreen = () => {
  const { settingsStyles } = useThemeStyles();
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    autoRefresh: true,
    darkMode: false,
    celsius: true,
    kmh: true,
  });

  // Загрузка настроек при монтировании
  useEffect(() => {
    loadSettings();
  }, []);

  // Загрузка настроек из хранилища
  const loadSettings = async () => {
    try {
      const savedSettings = await getSettings();
      console.log('Loaded settings:', savedSettings);
      setSettings(prev => ({
        ...prev,
        ...savedSettings,
        darkMode: savedSettings.darkMode || false,
        autoRefresh: savedSettings.autoRefresh !== undefined ? savedSettings.autoRefresh : true
      }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Сохранение настроек при изменении
  const saveSettingsToStorage = async (newSettings) => {
    try {
      const correctSettings = {
        autoRefresh: newSettings.autoRefresh,
        darkMode: newSettings.darkMode,
        celsius: newSettings.celsius,
        kmh: newSettings.kmh,
        temperatureUnit: newSettings.celsius ? 'celsius' : 'fahrenheit',
        windSpeedUnit: newSettings.kmh ? 'kmh' : 'mph',
        theme: newSettings.darkMode ? 'dark' : 'light'
      };
      
      await saveSettings(correctSettings);
      console.log('✅ Настройки сохранены:', correctSettings);
      
      // Обновляем тему в контексте
      if (toggleTheme) {
        toggleTheme(newSettings.darkMode);
      }
      
      // Показываем уведомление об изменении автообновления
      if (settings.autoRefresh !== newSettings.autoRefresh) {
        Alert.alert(
          'Настройки сохранены', 
          `Автообновление ${newSettings.autoRefresh ? 'включено' : 'выключено'}. 
          Изменения вступят в силу при следующем переходе на главный экран.`
        );
      }
      
    } catch (error) {
      console.error('❌ Ошибка сохранения настроек:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить настройки');
    }
  };

  const toggleSetting = async (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    
    setSettings(newSettings);
    await saveSettingsToStorage(newSettings);
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
              await clearCache(); // Очищаем кэш API
              await clearSearchHistory(); // Очищаем историю поиска
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
            setSettings(defaultSettings);
            await saveSettingsToStorage(defaultSettings);
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
          onToggle={() => toggleSetting('darkMode')}
        />
        <SettingItem
          icon="refresh"
          title="Авто-обновление"
          description="Автоматически обновлять погоду при открытии главного экрана"
          value={settings.autoRefresh}
          onToggle={() => toggleSetting('autoRefresh')}
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
          <Text style={settingsStyles.infoValue}>1.0.0</Text>
        </View>
        <View style={settingsStyles.infoItem}>
          <Text style={settingsStyles.infoLabel}>Последнее обновление:</Text>
          <Text style={settingsStyles.infoValue}>Ноябрь 2024</Text>
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
      </View>
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

export default SettingsScreen;