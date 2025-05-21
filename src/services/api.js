// src/services/api.js
import axios from 'axios';
const BASE_URL = 'http://192.168.43.137:8000/api/';

export const registerUser = async (data) => {
  const response = await axios.post(`${BASE_URL}accounts/signup/`, data);
  console.log("Submitting data to API:", data);
  return response.data;
};

export const getUserInfo = () => {
  return axios.get(`${BASE_URL}/api/accounts/user/`);
};

export default BASE_URL;
