// services/userService.js
import api from './api';

export const getUser = async () => {
  try {
    const response = await api.get('accounts/user/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response?.data || error.message);
    throw error;
  }
};
