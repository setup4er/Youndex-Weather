import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';
import { APP_VERSION } from '../utils/constants';

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
        <View>
          <Image source={require('../../assets/icon.png')}
          style={aboutStyles.logoImage}
          />
        </View>
        <Text style={aboutStyles.appName}>ТЫндекс Погода</Text>
        <Text style={aboutStyles.appVersion}>Версия {APP_VERSION.value}</Text>
        <Text style={aboutStyles.appDescription}>
          Простое и удобное приложение для отслеживания погоды
        </Text>
      </View>

      <InfoCard
        icon="information-circle"
        title="О приложении"
        description="Приложение предоставляет актуальную информацию о погоде по всему миру. Использует данные от ведущих метеорологических сервисов."
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
        description="Приложение разработано с использованием React Native и Expo."
      />

    </ScrollView>
  );
};

export default AboutScreen;