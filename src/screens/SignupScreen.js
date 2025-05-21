import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { registerUser } from '../services/api';

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
    dob: '',  // format: YYYY-MM-DD
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirm_password) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const payload = { ...formData };
    delete payload.confirm_password;

    try {
      const response = await registerUser(payload);
      Alert.alert('Success', 'Account created');
      navigation.navigate('Login');
    } catch (error) {
        console.log(error.response?.data);
        Alert.alert('Signup failed', error.message || 'Please check your data');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={text => handleChange('email', text)} />
      <TextInput placeholder="First Name" onChangeText={text => handleChange('first_name', text)} />
      <TextInput placeholder="Last Name" onChangeText={text => handleChange('last_name', text)} />
      <TextInput placeholder="Sex" onChangeText={text => handleChange('sex', text)} />
      <TextInput placeholder="State" onChangeText={text => handleChange('state', text)} />
      <TextInput placeholder="LGA" onChangeText={text => handleChange('lga', text)} />
      <TextInput placeholder="DOB (YYYY-MM-DD)" onChangeText={text => handleChange('dob', text)} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={text => handleChange('password', text)} />
      <TextInput placeholder="Confirm Password" secureTextEntry onChangeText={text => handleChange('confirm_password', text)} />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}
