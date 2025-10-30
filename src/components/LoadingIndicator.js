import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { loadingStyles } from '../styles/commonStyles';

const LoadingIndicator = ({ message = "Загрузка...", size = "large" }) => {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size={size} color="#3498db" />
      <Text style={loadingStyles.text}>{message}</Text>
    </View>
  );
};

export default LoadingIndicator;