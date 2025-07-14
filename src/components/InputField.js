import React from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const InputField = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error = false,
  helperText = '',
}) => {
  return (
    <PaperTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      error={error}
      style={styles.input}
      mode="outlined"
      theme={{ colors: { primary: '#007bff' } }} // You can customize primary color here
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
});

export default InputField;
