import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Button as PaperButton,
  TextInput as PaperTextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { LoadingContext, SnackbarContext } from '../context/GlobalContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Local loading state for the button
  const { login } = useAuth();
  const { showSnackbar } = useContext(SnackbarContext);

  const handleLogin = async () => {
    if (!email || !password) {
      showSnackbar('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      // No need for navigation.replace(), the AppNavigator will handle it.
      showSnackbar('Login successful!');
    } catch (err) {
      showSnackbar('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PaperTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
        />
        <PaperButton
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}>
          Login
        </PaperButton>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Don’t have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  signupText: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default LoginScreen;
