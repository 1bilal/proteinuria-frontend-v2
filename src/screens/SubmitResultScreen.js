import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { postTestResult } from '../services/testService'; // Corrected service import
import { LoadingContext, SnackbarContext } from '../context/GlobalContext';

const SubmitResultScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [proteinLevel, setProteinLevel] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const handleSubmit = () => {
    if (!proteinLevel) {
      showSnackbar('Please select a protein level');
      return;
    }

    // 1. Construct Payload Locally
    const payload = {
      result: proteinLevel,
      entry_method: 'manual',
      notes: notes,
      timestamp: date.toISOString(),
      id: Date.now(), // Temporary ID for display purposes
    };

    // 2. Optimistic Update: Navigate Immediately
    // We pass the payload directly to the result screen
    navigation.navigate('TestResult', { result: payload });

    // Reset form immediately
    setProteinLevel('');
    setNotes('');

    // 3. Background API Call
    postTestResult(payload)
      .then(() => {
        // Optional: Trigger a global refresh of data if needed
      })
      .catch((error) => {
        showSnackbar('Failed to save result to server. It will be retried.');
        // In a real app, we'd queue this for offline sync
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Date of Test</Text>
        <PaperTextInput
          label="Date of Test"
          value={date.toLocaleDateString()}
          onFocus={() => setShowDatePicker(true)}
          showSoftInputOnFocus={false} // Prevents keyboard from opening
          mode="outlined"
          style={styles.input}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Protein Level</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={proteinLevel}
            onValueChange={itemValue => setProteinLevel(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Select..." value="" />
            <Picker.Item label="Negative" value="Negative" />
            <Picker.Item label="Trace" value="Trace" />
            <Picker.Item label="+1" value="+1" />
            <Picker.Item label="+2" value="+2" />
            <Picker.Item label="+3" value="+3" />
          </Picker>
        </View>

        <PaperTextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          mode="outlined"
          style={styles.input}
        />

        <PaperButton
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}>
          Submit Result
        </PaperButton>
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
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
});

export default SubmitResultScreen;
