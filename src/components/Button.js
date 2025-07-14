import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Button = ({
  title,
  onPress,
  style,
  loading = false,
  disabled = false,
}) => {
  return (
    <PaperButton
      mode="contained"
      onPress={onPress}
      style={[styles.button, style]}
      loading={loading}
      disabled={disabled}>
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
});

export default Button;
