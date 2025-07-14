import React, { useState, useContext } from 'react';
import { View, Alert, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../services/authService'; // Corrected service import
import { LoadingContext, SnackbarContext } from '../../App';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    sex: '',
    state: '',
    lga: '',
    dob: '', // format: YYYY-MM-DD
  });
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirm_password) {
      showSnackbar('Passwords do not match');
      return;
    }

    const payload = { ...formData };
    delete payload.confirm_password;

    setIsLoading(true);
    try {
      await registerUser(payload);
      showSnackbar('Account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
      showSnackbar(
        error.response?.data?.email?.[0] ||
          error.response?.data?.password?.[0] ||
          'Signup failed. Please check your data.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <PaperTextInput
          label="Email"
          value={formData.email}
          onChangeText={text => handleChange('email', text)}
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="First Name"
          value={formData.first_name}
          onChangeText={text => handleChange('first_name', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="Last Name"
          value={formData.last_name}
          onChangeText={text => handleChange('last_name', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="Sex"
          value={formData.sex}
          onChangeText={text => handleChange('sex', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="State"
          value={formData.state}
          onChangeText={text => handleChange('state', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="LGA"
          value={formData.lga}
          onChangeText={text => handleChange('lga', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="DOB (YYYY-MM-DD)"
          value={formData.dob}
          onChangeText={text => handleChange('dob', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="Password"
          value={formData.password}
          secureTextEntry
          onChangeText={text => handleChange('password', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="Confirm Password"
          value={formData.confirm_password}
          secureTextEntry
          onChangeText={text => handleChange('confirm_password', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperButton
          mode="contained"
          onPress={handleSignup}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}>
          Sign Up
        </PaperButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});
