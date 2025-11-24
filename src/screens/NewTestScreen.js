import React, { useState, useContext } from 'react';
import { View, Image, Alert, StyleSheet } from 'react-native';
import {
  Button,
  Text,
  Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { postTestResult } from '../services/testService';
import { LoadingContext, SnackbarContext } from '../context/GlobalContext';

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

    setIsLoading(true);
    try {
      const response = await postTestResult(formData, true); // Ensure second arg is true for multipart
      showSnackbar('Test submitted successfully!');
      navigation.navigate('TestResult', { result: response });
    } catch (error) {
      console.error(
        'Error submitting test:',
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
        <Text variant="headlineSmall" style={styles.header}>
          New Test
        </Text>
        <Text variant="bodyMedium" style={styles.subHeader}>
          Align the test strip within the frame
        </Text>

        <Card style={styles.cameraCard} mode="elevated" onPress={pickImage}>
          <Card.Content style={styles.cameraContent}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text variant="titleMedium" style={styles.placeholderText}>
                  Tap to Take Photo
                </Text>
                <Text variant="bodySmall" style={styles.placeholderSubText}>
                  Ensure good lighting
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={image ? handleSubmit : pickImage}
            loading={isLoading}
            disabled={isLoading}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}>
            {image ? 'Analyze Test Strip' : 'Open Camera'}
          </Button>

          {image && (
            <Button
              mode="text"
              onPress={pickImage}
              disabled={isLoading}
              style={styles.retakeButton}>
              Retake Photo
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    fontWeight: 'bold',
    color: '#004D40',
    textAlign: 'center',
  },
  subHeader: {
    textAlign: 'center',
    color: '#5F6368',
    marginBottom: 32,
  },
  cameraCard: {
    flex: 1,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cameraContent: {
    flex: 1,
    padding: 0, // Remove padding to let image fill
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#00897B',
    fontWeight: 'bold',
  },
  placeholderSubText: {
    color: '#747775',
    marginTop: 4,
  },
  footer: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 100,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  retakeButton: {
    marginTop: 4,
  },
});

export default NewTestScreen;
