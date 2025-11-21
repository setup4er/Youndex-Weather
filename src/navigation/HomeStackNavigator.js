import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import SelectedWeatherScreen from '../screens/SelectedWeatherScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
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
        name="HomeMain" 
        component={HomeScreen}
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

export default HomeStackNavigator;