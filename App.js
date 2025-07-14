import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider, DefaultTheme, ActivityIndicator, Portal, Snackbar } from 'react-native-paper';
import { colors } from './src/styles/colors';
import React, { useState, createContext, useContext } from 'react';

export const LoadingContext = createContext();
export const SnackbarContext = createContext();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    error: colors.error,
    placeholder: colors.placeholder,
    disabled: colors.disabled,
    onSurface: colors.onSurface,
    backdrop: colors.backdrop,
    notification: colors.notification,
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const onDismissSnackbar = () => setSnackbarVisible(false);

  return (
    <PaperProvider theme={theme}>
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        <SnackbarContext.Provider value={{ showSnackbar }}>
          <Portal.Host>
            <AppNavigator />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator animating={true} size="large" />
              </View>
            )}
            <Snackbar
              visible={snackbarVisible}
              onDismiss={onDismissSnackbar}
              duration={3000}
              action={{
                label: 'Dismiss',
                onPress: () => {
                  // Do something
                },
              }}>
              {snackbarMessage}
            </Snackbar>
          </Portal.Host>
        </SnackbarContext.Provider>
      </LoadingContext.Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});