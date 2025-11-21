import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';
import HistoryScreen from '../screens/HistoryScreen';
import SelectedWeatherScreen from '../screens/SelectedWeatherScreen';

const Stack = createStackNavigator();

const HistoryStackNavigator = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const { tabStyles } = useThemeStyles();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { 
          backgroundColor: isDarkTheme ? '#121212' : '#f8f9fa' 
        },
      }}
    >
      <Stack.Screen 
        name="HistoryMain" 
        component={HistoryScreen}
      />
      <Stack.Screen 
        name="SelectedWeather" 
        component={SelectedWeatherScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
};

export default HistoryStackNavigator;