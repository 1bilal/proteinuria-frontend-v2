import React, { useState, useContext } from 'react';
import { View, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../services/authService';
import { LoadingContext, SnackbarContext } from '../context/GlobalContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { NIGERIAN_STATES } from '../utils/locations';

// ... (component code is replaced by previous tool call) ...



export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    sex: 'male', // Default to male
    state: '',
    lga: '',
    dob: '', // format: YYYY-MM-DD
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [lgas, setLgas] = useState([]);

  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStateChange = (itemValue) => {
    const selectedState = NIGERIAN_STATES.find(s => s.name === itemValue);
    setLgas(selectedState ? selectedState.lgas : []);
    setFormData(prev => ({ ...prev, state: itemValue, lga: '' }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      // Format: YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange('dob', formattedDate);
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirm_password) {
      showSnackbar('Passwords do not match');
      return;
    }

    const payload = { ...formData };
    // confirm_password is required by the backend serializer

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
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

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.sex}
                onValueChange={(itemValue) => handleChange('sex', itemValue)}>
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>State</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.state}
                onValueChange={handleStateChange}>
                <Picker.Item label="Select State" value="" />
                {NIGERIAN_STATES.map((state) => (
                  <Picker.Item key={state.name} label={state.name} value={state.name} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>LGA</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.lga}
                enabled={lgas.length > 0}
                onValueChange={(itemValue) => handleChange('lga', itemValue)}>
                <Picker.Item label="Select LGA" value="" />
                {lgas.map((lga) => (
                  <Picker.Item key={lga} label={lga} value={lga} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
            <PaperTextInput
              label="Date of Birth"
              value={formData.dob}
              editable={false}
              mode="outlined"
              right={<PaperTextInput.Icon icon="calendar" />}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

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
      </KeyboardAvoidingView>
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
    marginBottom: 30,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#79747E', // Match outlined text input border
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dateInput: {
    marginBottom: 10,
  },
});
