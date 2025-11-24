import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, logoutUser } from '../services/authService';
import { getUser } from '../services/userService';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for a token on app startup
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          api.defaults.headers.Authorization = `Token ${storedToken}`;
          try {
            const userData = await getUser();
            setUser(userData);
          } catch (userError) {
            console.error('Failed to fetch user profile:', userError);
            // If token is invalid (401), clear it
            if (userError.response && userError.response.status === 401) {
              await logout();
            }
          }
        }
      } catch (e) {
        console.error('Failed to load auth token.', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const authToken = await loginUser(email, password);
      setToken(authToken);
      api.defaults.headers.Authorization = `Token ${authToken}`;
      const userData = await getUser();
      setUser(userData);
    } catch (e) {
      console.error('Login failed', e);
      throw e; // Re-throw error to be caught by the login screen
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setToken(null);
      setUser(null);
      delete api.defaults.headers.Authorization;
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
