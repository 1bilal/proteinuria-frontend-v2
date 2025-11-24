// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use LAN IP for Physical Devices & Emulators
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.137:8000/api/';

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token to every request (safe for your own backend)
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
export { BASE_URL };

