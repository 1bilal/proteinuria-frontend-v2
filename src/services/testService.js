// services/testService.js
import api from './api';

export const getTestResults = async () => {
  try {
    console.log('➡️ Calling GET test-results/...');
    const response = await api.get('test-results/');
    console.log('✅ Response from backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching test results:', error?.response?.data || error.message);
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
