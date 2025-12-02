import { StyleSheet, Platform } from 'react-native';
import React from 'react';
import ThemeContext from '../context/ThemeContext';

// Цветовые схемы
const lightColors = {
  primary: '#3498db',
  primaryLight: '#5dade2',
  primaryDark: '#2980b9',
  background: '#f8f9fa',
  card: 'white',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  border: '#e0e0e0',
  error: '#e74c3c',
  errorLight: '#fadbd8',
  warning: '#f39c12',
  warningLight: '#fdebd0',
  success: '#27ae60',
  successLight: '#d5f4e6',
  shadow: '#000',
  gray: '#bdc3c7',
  grayLight: '#ecf0f1',
  white: '#ffffff',
  black: '#000000',
  // Новые цвета для давления
  pressureHigh: '#4CAF50',    // Зеленый для высокого давления
  pressureNormal: '#2196F3',  // Синий для нормального
  pressureLow: '#FF5722',     // Красный для низкого
  // Новые цвета для осадков
  precipitationHigh: '#2196F3',   // Синий для высокой вероятности осадков
  precipitationMedium: '#673AB7', // Фиолетовый для средней
  precipitationLow: '#4CAF50',    // Зеленый для низкой
};

const darkColors = {
  primary: '#3498db',
  primaryLight: '#5dade2',
  primaryDark: '#2980b9',
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  border: '#333333',
  error: '#e74c3c',
  errorLight: '#2a1a1a',
  warning: '#f39c12',
  warningLight: '#2a241a',
  success: '#27ae60',
  successLight: '#1a2a1a',
  shadow: '#000',
  gray: '#666666',
  grayLight: '#2a2a2a',
  white: '#ffffff',
  black: '#000000',
  // Новые цвета для давления (более темные оттенки)
  pressureHigh: '#2E7D32',    // Темно-зеленый для высокого давления
  pressureNormal: '#1565C0',  // Темно-синий для нормального
  pressureLow: '#D32F2F',     // Темно-красный для низкого
  // Новые цвета для осадков
  precipitationHigh: '#1565C0',   // Темно-синий для высокой вероятности осадков
  precipitationMedium: '#512DA8', // Темно-фиолетовый для средней
  precipitationLow: '#2E7D32',    // Темно-зеленый для низкой
};

// Создаем контекст темы по умолчанию для случаев, когда ThemeContext не доступен
const defaultThemeContext = {
  isDarkTheme: false,
  toggleTheme: () => {},
};

// Функция для создания стилей с учетом темы
export const createStyles = (isDarkTheme = false) => {
  const colors = isDarkTheme ? darkColors : lightColors;
  
  return {
    // Общие стили
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: colors.text,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },

    // Стили для навигации
    tabStyles: {
      tabBar: {
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      },
      tabBarLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.text,
      },
      header: {
        backgroundColor: colors.primary,
      },
      headerTitle: {
        fontWeight: 'bold',
        color: 'white',
      },
    },

    // Стили для главного экрана
    homeStyles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      content: {
        padding: 16,
        paddingBottom: 70,
        paddingTop: 30,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
        textAlign: 'center',
      },
      selectedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      backButton: {
        padding: 8,
      },
      selectedTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        flex: 1,
      },
      backButtonPlaceholder: {
        width: 40,
      },
      errorCard: {
        backgroundColor: colors.errorLight,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: colors.error,
      },
      errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.error,
        marginTop: 10,
        marginBottom: 5,
      },
      errorText: {
        fontSize: 14,
        color: colors.error,
        textAlign: 'center',
        marginBottom: 15,
      },
      retryButton: {
        backgroundColor: colors.error,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 10,
      },
      retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      settingsButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
      },
      settingsButtonText: {
        color: colors.primary,
        fontWeight: '500',
      },
      permissionCard: {
        backgroundColor: colors.warningLight,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: colors.warning,
      },
      permissionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.warning,
        marginTop: 10,
        marginBottom: 5,
      },
      permissionText: {
        fontSize: 14,
        color: colors.warning,
        textAlign: 'center',
        marginBottom: 15,
      },
      permissionButton: {
        backgroundColor: colors.warning,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
      },
      permissionButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      infoSection: {
        marginTop: 20,
        padding: 16,
        backgroundColor: colors.card,
        borderRadius: 8,
      },
      infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
      },
      infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 10,
      },
      favoritesSection: {
        marginTop: 10,
        marginBottom: 20,
      },
      favoritesScrollView: {
        marginHorizontal: -5,
      },
      favoriteItem: {
        backgroundColor: colors.card,
        padding: 15,
        borderRadius: 12,
        marginHorizontal: 5,
        width: 140,
        alignItems: 'center',
        ...Platform.select({
          ios: {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          android: {
            elevation: 2,
          },
        }),
      },
      favoriteCity: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 5,
        textAlign: 'center',
      },
      favoriteTemp: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.error,
        marginBottom: 3,
      },
      favoriteCondition: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
      },
      noFavorites: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: colors.card,
        borderRadius: 12,
        marginVertical: 10,
      },
      noFavoritesText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '500',
      },
      noFavoritesSubtext: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
        marginTop: 5,
      },
      favoritesLoading: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      },
    }),

    // Стили для выбранной погоды
    selectedWeatherStyles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      content: {
        padding: 16,
        paddingBottom: 70,
        paddingTop: 30,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      backButton: {
        padding: 8,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        flex: 1,
      },
      backButtonPlaceholder: {
        width: 40,
      },
      errorCard: {
        backgroundColor: colors.errorLight,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: colors.error,
      },
      errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.error,
        marginTop: 10,
        marginBottom: 5,
      },
      errorText: {
        fontSize: 14,
        color: colors.error,
        textAlign: 'center',
        marginBottom: 15,
      },
      retryButton: {
        backgroundColor: colors.error,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 10,
      },
      retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      settingsButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
      },
      settingsButtonText: {
        color: colors.primary,
        fontWeight: '500',
      },
      permissionCard: {
        backgroundColor: colors.warningLight,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: colors.warning,
      },
      permissionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.warning,
        marginTop: 10,
        marginBottom: 5,
      },
      permissionText: {
        fontSize: 14,
        color: colors.warning,
        textAlign: 'center',
        marginBottom: 15,
      },
      permissionButton: {
        backgroundColor: colors.warning,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
      },
      permissionButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      infoSection: {
        marginTop: 20,
        padding: 16,
        backgroundColor: colors.card,
        borderRadius: 8,
      },
      infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
      },
      infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 10,
      },
      loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      },
      loadingText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 10,
      },
    }),

    // Стили для экрана поиска
    searchScreenStyles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scrollView: {
        flex: 1,
      },
      content: {
        padding: 16,
        paddingBottom: 70,
        paddingTop: 30,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
        textAlign: 'center',
      },
      resultSection: {
        marginTop: 20,
      },
      resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
      },
      noResults: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      },
      noResultsText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
      },
      noResultsSubtext: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
        marginTop: 8,
      },
      tipsSection: {
        marginTop: 20,
        padding: 16,
        backgroundColor: colors.card,
        borderRadius: 8,
      },
      tipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
      },
      tip: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 5,
      },
      suggestionsSection: {
        marginTop: 20,
      },
      suggestionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 15,
      },
      citiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      },
      cityButton: {
        width: '48%',
        backgroundColor: colors.card,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        ...Platform.select({
          ios: {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          android: {
            elevation: 2,
          },
        }),
      },
      cityName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
      },
      cityCountry: {
        fontSize: 12,
        color: colors.textSecondary,
      },
      tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
      },
      resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
      },
      favoriteButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: colors.grayLight,
        marginLeft: 10,
      },
      favoriteButtonActive: {
        backgroundColor: colors.warningLight,
      },
    }),

    // Стили для поисковой строки
    searchStyles: StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
      },
      searchIcon: {
        marginRight: 8,
      },
      input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
      },
      clearButton: {
        padding: 4,
      },
      searchButton: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 50,
      },
      searchButtonDisabled: {
        backgroundColor: colors.gray,
      },
      searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
    }),

    // Стили для карточки погоды
    weatherStyles: StyleSheet.create({
      weatherCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        ...Platform.select({
          ios: {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
        }),
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
      },
      location: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
      },
      time: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
      },
      favoriteButton: {
        padding: 8,
      },
      weatherMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      },
      temperatureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      weatherIcon: {
        fontSize: 48,
        marginRight: 10,
      },
      temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.error,
      },
      conditionContainer: {
        alignItems: 'flex-end',
      },
      condition: {
        fontSize: 18,
        color: colors.textSecondary,
        marginBottom: 4,
      },
      detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
      },
      detailItem: {
        width: '48%',
        backgroundColor: colors.grayLight,
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        minHeight: 85, // Минимальная высота для одинаковых блоков
      },
      detailIcon: {
        fontSize: 20,
        marginBottom: 4,
      },
      detailLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
      },
      detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
      },
      // Новые стили для дополнительной информации
      detailAdditional: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
        textAlign: 'center',
        fontWeight: '500',
      },
      detailChance: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 1,
        fontStyle: 'italic',
        textAlign: 'center',
      },
      // Новые стили для визуальных индикаторов
      pressureIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
      },
      precipitationIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
      },
      indicatorText: {
        fontSize: 10,
        marginLeft: 2,
      },
      additionalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 16,
      },
      additionalText: {
        fontSize: 14,
        color: colors.textSecondary,
      },
    }),

    // Стили для экрана истории
    historyScreenStyles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: 70,
        paddingTop: 30,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.card,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
      },
      headerButtons: {
        flexDirection: 'row',
      },
      iconButton: {
        padding: 8,
        marginLeft: 16,
      },
      stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: colors.card,
        marginBottom: 1,
      },
      statsText: {
        fontSize: 14,
        color: colors.textSecondary,
      },
      list: {
        flex: 1,
      },
      emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      },
      emptyStateText: {
        fontSize: 18,
        color: colors.textSecondary,
        marginTop: 16,
        marginBottom: 8,
      },
      emptyStateSubtext: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
      },
    }),

    // Стили для элемента истории
    historyItemStyles: StyleSheet.create({
      container: {
        backgroundColor: colors.card,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 8,
        ...Platform.select({
          ios: {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          },
          android: {
            elevation: 2,
          },
        }),
      },
      content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      mainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      },
      typeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      },
      locationInfo: {
        flex: 1,
      },
      location: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
      },
      country: {
        fontSize: 14,
        color: colors.textSecondary,
      },
      weatherInfo: {
        alignItems: 'flex-end',
      },
      temperatureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      weatherIcon: {
        fontSize: 20,
        marginRight: 4,
      },
      temperature: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.error,
        marginRight: 40,
      },
      time: {
        fontSize: 12,
        color: colors.textSecondary,
      },
      condition: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 8,
      },
      deleteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
      },
    }),

    // Стили для модального окна фильтров
    filterModalStyles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
      },
      content: {
        flex: 1,
        padding: 16,
      },
      section: {
        marginBottom: 24,
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
      },
      optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      optionsColumn: {},
      option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.grayLight,
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
        minWidth: 100,
      },
      optionSelected: {
        backgroundColor: colors.primaryLight + '20',
        borderColor: colors.primary,
        borderWidth: 1,
      },
      optionText: {
        fontSize: 14,
        color: colors.text,
      },
      optionTextSelected: {
        color: colors.primary,
        fontWeight: 'bold',
      },
      footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      },
      resetButton: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.grayLight,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
      },
      resetButtonText: {
        color: colors.textSecondary,
        fontWeight: 'bold',
      },
      applyButton: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.primary,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 8,
      },
      applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
    }),

    // Стили для экрана настроек
    settingsStyles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 30,
        paddingBottom: 70,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        margin: 16,
      },
      section: {
        backgroundColor: colors.card,
        marginBottom: 16,
        paddingHorizontal: 16,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 16,
        marginBottom: 12,
      },
      settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      settingInfo: {
        flex: 1,
      },
      settingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      settingTitle: {
        fontSize: 16,
        color: colors.text,
        marginLeft: 12,
      },
      settingDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 36,
      },
      actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      actionText: {
        fontSize: 16,
        marginLeft: 12,
      },
      infoSection: {
        backgroundColor: colors.card,
        marginTop: 16,
        padding: 16,
      },
      infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
      },
      infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
      },
      infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
      },
      infoValue: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
      },
    }),

    // Стили для экрана "О приложении"
    aboutStyles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      header: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: colors.card,
        marginBottom: 16,
      },
      logoImage: {
        width: 100, // или нужный вам размер
        height: 100, // или нужный вам размер
      },
      logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primaryLight + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      },
      appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
      },
      appVersion: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 8,
      },
      appDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
      },
      infoCard: {
        backgroundColor: colors.card,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
      },
      cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 12,
      },
      cardDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: 12,
      },
      cardButton: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      cardButtonText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
        marginRight: 4,
      },
      credits: {
        backgroundColor: colors.card,
        padding: 16,
        margin: 16,
        borderRadius: 8,
      },
      creditsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
      },
      creditsText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
      },
      footer: {
        padding: 16,
        alignItems: 'center',
      },
      footerText: {
        fontSize: 12,
        color: colors.gray,
      },
    }),

    // Стили для индикатора загрузки
    loadingStyles: StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      text: {
        marginTop: 12,
        fontSize: 16,
        color: colors.textSecondary,
      },
    }),
  };
};

// Хук для использования стилей с текущей темой
// Исправленный хук для использования стилей
export const useThemeStyles = () => {
  const themeContext = React.useContext(ThemeContext);
  
  if (!themeContext) {
    console.error('ThemeContext не найден! Убедитесь, что компонент обернут в ThemeContext.Provider');
  }
  
  const isDarkTheme = themeContext?.isDarkTheme || false;
  console.log('useThemeStyles вызван с isDarkTheme:', isDarkTheme);
  
  return createStyles(isDarkTheme);
};

// Для обратной совместимости оставляем старые экспорты
const lightStyles = createStyles(false);

export const commonStyles = lightStyles;
export const homeStyles = lightStyles.homeStyles;
export const searchScreenStyles = lightStyles.searchScreenStyles;
export const weatherStyles = lightStyles.weatherStyles;
export const settingsStyles = lightStyles.settingsStyles;
export const aboutStyles = lightStyles.aboutStyles;
export const historyScreenStyles = lightStyles.historyScreenStyles;
export const historyItemStyles = lightStyles.historyItemStyles;
export const filterModalStyles = lightStyles.filterModalStyles;
export const searchStyles = lightStyles.searchStyles;
export const loadingStyles = lightStyles.loadingStyles;
export const tabStyles = lightStyles.tabStyles;
export const selectedWeatherStyles = lightStyles.selectedWeatherStyles;

// Экспортируем цвета для использования в компонентах
export { lightColors, darkColors };