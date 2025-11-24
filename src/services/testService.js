// services/testService.js
import api from './api';

export const getTestResults = async () => {
  try {
    const response = await api.get('test-results/');
    return response.data;
  } catch (error) {
    console.error('Error fetching test results:', error?.response?.data || error.message);
    throw error;
  }
};


export const postTestResult = async (payload) => {
  try {
    const response = await api.post('test-results/', payload);
    return response.data;
  } catch (error) {
    console.error('Error submitting test result:', error.response?.data || error.message);
    throw error;
  }
};
