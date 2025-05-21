import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../services/api';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
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
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      await axios.patch(`${BASE_URL}/profile/`, profile, {
        headers: { Authorization: `Token ${token}` },
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={profile.email}
        editable={false}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="First Name"
        value={profile.first_name}
        onChangeText={text => handleChange('first_name', text)}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Last Name"
        value={profile.last_name}
        onChangeText={text => handleChange('last_name', text)}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Sex"
        value={profile.sex}
        onChangeText={text => handleChange('sex', text)}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="State"
        value={profile.state}
        onChangeText={text => handleChange('state', text)}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="LGA"
        value={profile.lga}
        onChangeText={text => handleChange('lga', text)}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={profile.dob}
        onChangeText={text => handleChange('dob', text)}
        style={{ marginBottom: 20, borderBottomWidth: 1 }}
      />
      <Button title={loading ? "Saving..." : "Save Profile"} onPress={handleSave} disabled={loading} />
    </ScrollView>
  );
};

export default ProfileScreen;
