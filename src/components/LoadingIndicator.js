import React, { useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';
const LoadingIndicator = ({ message = "Загрузка...", size = "large" }) => {
  const { loadingStyles } = useThemeStyles();
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size={size} color="#3498db" />
      <Text style={loadingStyles.text}>{message}</Text>
    </View>
  );
};

export default LoadingIndicator;