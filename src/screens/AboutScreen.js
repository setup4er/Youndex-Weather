import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { aboutStyles } from '../styles/commonStyles';

const AboutScreen = () => {
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
      {/* Заголовок */}
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

      {/* Информация о приложении */}
      <InfoCard
        icon="information-circle"
        title="О приложении"
        description="WeatherApp предоставляет актуальную информацию о погоде по всему миру. Использует данные от ведущих метеорологических сервисов."
      />

      {/* Источник данных */}
      <InfoCard
        icon="cloud"
        title="Источник данных"
        description="Данные о погоде предоставляются WeatherAPI.com - надежным сервисом метеорологических данных."
        action={{
          text: 'Посетить WeatherAPI',
          onPress: () => openLink('https://www.weatherapi.com/')
        }}
      />

      {/* Разработчик */}
      <InfoCard
        icon="code"
        title="Разработка"
        description="Приложение разработано с использованием React Native и Expo. Код открыт и доступен на GitHub."
        action={{
          text: 'GitHub репозиторий',
          onPress: () => openLink('https://github.com')
        }}
      />

      {/* Контакты */}
      <InfoCard
        icon="mail"
        title="Обратная связь"
        description="Есть вопросы или предложения? Мы будем рады получить ваши отзывы."
        action={{
          text: 'Написать разработчику',
          onPress: () => openLink('mailto:developer@example.com')
        }}
      />

      {/* Лицензия */}
      <InfoCard
        icon="document-text"
        title="Лицензия"
        description="Приложение распространяется по лицензии MIT. Исходный код доступен для использования и модификации."
      />

      {/* Благодарности */}
      <View style={aboutStyles.credits}>
        <Text style={aboutStyles.creditsTitle}>Благодарности</Text>
        <Text style={aboutStyles.creditsText}>
          • React Native команда за отличный фреймворк
        </Text>
        <Text style={aboutStyles.creditsText}>
          • Expo за инструменты разработки
        </Text>
        <Text style={aboutStyles.creditsText}>
          • WeatherAPI.com за данные о погоде
        </Text>
        <Text style={aboutStyles.creditsText}>
          • Ionicons за иконки
        </Text>
      </View>

      {/* Копирайт */}
      <View style={aboutStyles.footer}>
        <Text style={aboutStyles.footerText}>
          © 2024 WeatherApp. Все права защищены.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;