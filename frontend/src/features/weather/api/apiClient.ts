import axios from 'axios';
import { auth } from '../../../services/firebase';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Firebase auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = (error?.config || {}) as any;
    const method = (config.method || '').toLowerCase();
    const status = error?.response?.status;

    if (method !== 'get') {
      return Promise.reject(error);
    }

    if (status === 429) {
      return Promise.reject(error);
    }

    const shouldRetry = !status || (status >= 500 && status < 600);
    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config._retry = (config._retry || 0) + 1;
    if (config._retry > 2) {
      return Promise.reject(error);
    }

    const retryAfterHeader = error?.response?.headers?.['retry-after'];
    const retryAfterMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : Math.pow(2, config._retry) * 500;
    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));

    return apiClient(config);
  }
);

export default apiClient;
