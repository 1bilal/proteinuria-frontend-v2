import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TestResultsScreen from '../screens/TestResultsScreen';
import SubmitResultScreen from '../screens/SubmitResultScreen';
import NewTestScreen from '../screens/NewTestScreen';
import TestResultScreen from '../screens/TestResultScreen';

import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/colors';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen
      name="TestResults"
      component={TestResultsScreen}
      options={{ title: 'My Test Results' }}
    />
    <Stack.Screen name="SubmitResult" component={SubmitResultScreen} />
    <Stack.Screen name="NewTest" component={NewTestScreen} />
    <Stack.Screen name="TestResult" component={TestResultScreen} options={{ title: 'Result Details' }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
