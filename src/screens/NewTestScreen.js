import React, { useState, useContext } from 'react';
import { View, Image, Alert, StyleSheet } from 'react-native';
import {
  Button as PaperButton,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { postTestResult } from '../services/testService';
import { LoadingContext, SnackbarContext } from '../../App';

const NewTestScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Camera access is needed to take the test strip photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      showSnackbar('Please take a photo first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: 'test.jpg',
      type: 'image/jpeg',
    });
    formData.append('entry_method', 'auto');

    // Debug output of FormData (text version)
    console.log('📤 Submitting test with image:', image);

    setIsLoading(true);
    try {
      await postTestResult(formData, true); // Ensure second arg is true for multipart
      showSnackbar('Test submitted successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error(
        '❌ Error submitting test:',
        error.response?.data || error.message || error,
      );
      showSnackbar('Failed to submit test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PaperButton mode="contained" onPress={pickImage} style={styles.button}>
          Take a Photo of the Test Strip
        </PaperButton>

        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <PaperButton
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}>
              Submit Test
            </PaperButton>
          </View>
        )}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    marginVertical: 10,
    width: '80%',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default NewTestScreen;
