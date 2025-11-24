// services/userService.js
import api from './api';

export const getUser = async () => {
  try {
    const response = await api.get('accounts/profile/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await api.patch('accounts/profile/', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response?.data || error.message);
    throw error;
  }
};
