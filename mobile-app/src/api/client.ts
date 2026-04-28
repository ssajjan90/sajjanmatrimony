import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator → 10.0.2.2 | iOS simulator → localhost | Physical device → machine IP
export const API_BASE_URL = 'http://10.0.2.2:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const raw = await AsyncStorage.getItem('auth-storage');
    if (raw) {
      const { state } = JSON.parse(raw);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    }
  } catch {
    // no-op — unauthenticated request
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

export default apiClient;
