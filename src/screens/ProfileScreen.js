import React, { useEffect, useState, useContext } from 'react';
import { View, Alert, ScrollView, StyleSheet } from 'react-native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../services/api';
import { LoadingContext, SnackbarContext } from '../../App';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    sex: '',
    state: '',
    lga: '',
    dob: '',
  });
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          navigation.replace('Login');
          return;
        }

        const response = await axios.get(`${BASE_URL}accounts/user/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        showSnackbar('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      await axios.patch(`${BASE_URL}accounts/profile/`, profile, {
        headers: { Authorization: `Token ${token}` },
      });
      showSnackbar('Profile updated successfully!');
    } catch (error) {
      showSnackbar('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Profile Information</Text>
        <PaperTextInput
          label="Email"
          value={profile.email}
          editable={false}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="First Name"
          value={profile.first_name}
          onChangeText={text => handleChange('first_name', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="Last Name"
          value={profile.last_name}
          onChangeText={text => handleChange('last_name', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="Sex"
          value={profile.sex}
          onChangeText={text => handleChange('sex', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="State"
          value={profile.state}
          onChangeText={text => handleChange('state', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="LGA"
          value={profile.lga}
          onChangeText={text => handleChange('lga', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperTextInput
          label="Date of Birth (YYYY-MM-DD)"
          value={profile.dob}
          onChangeText={text => handleChange('dob', text)}
          mode="outlined"
          style={styles.input}
        />
        <PaperButton
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}>
          Save Profile
        </PaperButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileScreen;
