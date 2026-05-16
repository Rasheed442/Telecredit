import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || 'https://airtimeloanapi.paykiosk.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
  }
  return config;
});

// Handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
