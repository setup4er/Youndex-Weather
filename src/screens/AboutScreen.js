import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';

const AboutScreen = () => {
  const { aboutStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  const InfoCard = ({ icon, title, description, action }) => (
    <View style={aboutStyles.infoCard}>
      <View style={aboutStyles.cardHeader}>
        <Ionicons name={icon} size={24} color="#3498db" />
        <Text style={aboutStyles.cardTitle}>{title}</Text>
      </View>
      <Text style={aboutStyles.cardDescription}>{description}</Text>
      {action && (
        <TouchableOpacity 
          style={aboutStyles.cardButton}
          onPress={action.onPress}
        >
          <Text style={aboutStyles.cardButtonText}>{action.text}</Text>
          <Ionicons name="open-outline" size={16} color="#3498db" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={aboutStyles.container}>
      <View style={aboutStyles.header}>
        <View style={aboutStyles.logo}>
          <Ionicons name="partly-sunny" size={64} color="#3498db" />
        </View>
        <Text style={aboutStyles.appName}>WeatherApp</Text>
        <Text style={aboutStyles.appVersion}>Версия 1.0.0</Text>
        <Text style={aboutStyles.appDescription}>
          Простое и удобное приложение для отслеживания погоды
        </Text>
      </View>

      <InfoCard
        icon="information-circle"
        title="О приложении"
        description="WeatherApp предоставляет актуальную информацию о погоде по всему миру. Использует данные от ведущих метеорологических сервисов."
      />

      <InfoCard
        icon="cloud"
        title="Источник данных"
        description="Данные о погоде предоставляются WeatherAPI.com - надежным сервисом метеорологических данных."
        action={{
          text: 'Посетить WeatherAPI',
          onPress: () => openLink('https://www.weatherapi.com/')
        }}
      />

      <InfoCard
        icon="code"
        title="Разработка"
        description="Приложение разработано с использованием React Native и Expo. Код открыт и доступен на GitHub."
        action={{
          text: 'GitHub репозиторий',
          onPress: () => openLink('https://github.com')
        }}
      />

      <View style={aboutStyles.footer}>
        <Text style={aboutStyles.footerText}>
          © 2024 WeatherApp. Все права защищены.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;