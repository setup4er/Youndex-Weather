import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useThemeStyles } from '../styles/commonStyles';
import ThemeContext from '../context/ThemeContext';
import SearchScreen from '../screens/SearchScreen';
import SelectedWeatherScreen from '../screens/SelectedWeatherScreen';

const Stack = createStackNavigator();

const SearchStackNavigator = () => {
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
        name="SearchMain" 
        component={SearchScreen}
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

export default SearchStackNavigator;