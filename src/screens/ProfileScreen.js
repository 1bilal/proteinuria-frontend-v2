import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
  Text,
  Avatar,
  Card,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUser, updateUser } from '../services/userService';
import { LoadingContext, SnackbarContext } from '../context/GlobalContext';

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
        const userData = await getUser();
        setProfile(userData);
      } catch (error) {
        showSnackbar('Failed to load profile');
        // If 401, AuthContext/api interceptor might handle it, or we redirect
        // But getUser throws, so we catch here.
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
    // 1. Optimistic Update: Show success immediately
    showSnackbar('Profile updated successfully!');

    // 2. Background API Call
    try {
      await updateUser(profile);
    } catch (error) {
      showSnackbar('Failed to save profile changes to server.');
    }
  };

  const theme = useTheme();

  const getInitials = () => {
    const first = profile.first_name?.charAt(0) || '';
    const last = profile.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerContainer}>
            <Avatar.Text
              size={80}
              label={getInitials()}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <Text variant="headlineSmall" style={styles.headerName}>
              {profile.first_name} {profile.last_name}
            </Text>
            <Text variant="bodyMedium" style={styles.headerEmail}>
              {profile.email}
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Personal Information
            </Text>
            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <PaperTextInput
                  label="First Name"
                  value={profile.first_name}
                  onChangeText={(text) => handleChange('first_name', text)}
                  mode="outlined"
                  style={styles.input}
                />
                <PaperTextInput
                  label="Last Name"
                  value={profile.last_name}
                  onChangeText={(text) => handleChange('last_name', text)}
                  mode="outlined"
                  style={styles.input}
                />
                <View style={styles.row}>
                  <PaperTextInput
                    label="Sex"
                    value={profile.sex}
                    onChangeText={(text) => handleChange('sex', text)}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                  />
                  <PaperTextInput
                    label="DOB (YYYY-MM-DD)"
                    value={profile.dob}
                    onChangeText={(text) => handleChange('dob', text)}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                  />
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Location Details
            </Text>
            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <PaperTextInput
                  label="State"
                  value={profile.state}
                  onChangeText={(text) => handleChange('state', text)}
                  mode="outlined"
                  style={styles.input}
                />
                <PaperTextInput
                  label="LGA"
                  value={profile.lga}
                  onChangeText={(text) => handleChange('lga', text)}
                  mode="outlined"
                  style={styles.input}
                />
              </Card.Content>
            </Card>
          </View>

          <View style={styles.footer}>
            <PaperButton
              mode="contained"
              onPress={handleSave}
              loading={isLoading}
              disabled={isLoading}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}>
              Save Changes
            </PaperButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerName: {
    marginTop: 12,
    fontWeight: 'bold',
    color: '#004D40',
  },
  headerEmail: {
    color: '#5F6368',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#444746',
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    gap: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    marginTop: 8,
  },
  saveButton: {
    borderRadius: 100,
  },
  saveButtonContent: {
    paddingVertical: 6,
  },
});

export default ProfileScreen;
