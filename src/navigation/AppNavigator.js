import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SubmitResultScreen from '../screens/SubmitResultScreen';
import NewTestScreen from '../screens/NewTestScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TestResultsScreen from '../screens/TestResultScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="TestResults" component={TestResultsScreen} options={{ title: 'My Test Results' }} />
        <Stack.Screen name="SubmitResult" component={SubmitResultScreen} />
        <Stack.Screen name="NewTest" component={NewTestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;