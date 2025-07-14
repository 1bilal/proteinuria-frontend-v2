import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { BASE_URL } from './api'; // Should export configured Axios instance


// --- Utility: Get stored token ---
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    console.log('Retrieved token from storage:', token);
    return token;
  } catch (error) {
    console.error('Error getting token from storage', error);
    return null;
  }
};

// --- Attach token to all requests automatically ---
api.interceptors.request.use(
  async config => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
      console.log('Attached auth token to request');
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// --- Login user and store token ---
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}accounts/token/`, {
      email,
      password,
    });

    const { token } = response.data;

    if (!token) throw new Error('No token returned from backend');

    await AsyncStorage.setItem('auth_token', token);
    return token;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// --- Fetch test results ---
export const getTestResults = async () => {
  try {
    const response = await api.get('test-results/');
    return response.data;
  } catch (error) {
    console.error('Error fetching test results:', error.response?.data || error.message);
    throw error;
  }
};

// --- Submit test result (manual or auto) ---
export const postTestResult = async (testResultData, isMultipart = false) => {
  try {
    const headers = isMultipart
      ? { 'Content-Type': 'multipart/form-data' }
      : undefined;

    const dataToSend = isMultipart
      ? testResultData
      : {
          ...testResultData,
          entry_method: 'manual',
        };

    const response = await api.post('test-results/', dataToSend, { headers });
    return response.data;
  } catch (error) {
    console.error('Error posting test result:', error.response?.data || error.message);
    throw error;
  }
};

// --- Logout user ---
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
